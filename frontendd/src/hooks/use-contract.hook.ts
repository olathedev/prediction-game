import { useState, useEffect } from "react";
import {
  useWriteContract,
  useReadContract,
  useAccount,
  BaseError,
  useBalance,
} from "wagmi";
import rawAbi from "../abi/GuessGame.json";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import { useNavigate } from "react-router-dom";

const abi = rawAbi.abi;
const CONTRACT_ADDRESS = "0xb202fc271B6A14b32Db7d8f43b82c7e383840211";

export const useGuessGame = () => {
  const { isConnected, address } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const { data: balanceData } = useBalance({ address });
  const navigate = useNavigate();

  /**
   * Stake ETH before playing.
   */
  const stakeETH = (amount: number, callback?: () => void) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (amount <= 0) {
      toast.error("Stake amount must be greater than 0.");
      return;
    }
    if (balanceData && balanceData.value < parseEther(amount.toString())) {
      toast.error("Insufficient balance.");
      return;
    }

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "stake",
        args: [],
        value: parseEther(amount.toString()),
      },
      {
        onSuccess: () => {
          toast.success("Stake successful!");
          if (callback) callback();
        },
        onError: () => {
          toast.error("Transaction failed. Please try again.");
        },
      }
    );
  };
  /**
   * Submit predictions after staking.
   */
  const submitPredictions = async (
    predictions: number[],
    correctAnswers: number[]
  ) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (predictions.length !== 10 || correctAnswers.length !== 10) {
      toast.error("Invalid number of predictions.");
      return;
    }

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "submitPredictions",
        args: [predictions, correctAnswers],
      },
      {
        onSuccess: () => {
          toast.success("Predictions submitted successfully!");
          navigate("/result");
        },
        onError: () => {
          toast.error("Transaction failed. Please try again.");
        },
      }
    );
  };

  /**
   * Fetch player details.
   */
  const { data: playerData, refetch: getPlayerDetails } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getPlayerDetails",
    args: address ? [address] : undefined,
  });

  /**
   * Fetch latest game result.
   */
  const { data: playerLatestGameResult, refetch: getPlayerLatestGameResult } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "getPlayerLatestGameResult",
      args: address ? [address] : undefined,
    });

  /**
   * Fetch global leaderboard.
   */
  const { data: globalLeaderboard, refetch: getGlobalLeaderboard } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "getGlobalLeaderboard",
    });

  return {
    stakeETH,
    submitPredictions,
    getPlayerDetails,
    getGlobalLeaderboard,
    getPlayerLatestGameResult,
    playerData,
    playerLatestGameResult,
    globalLeaderboard,
    isPending,
  };
};

export const useUsername = () => {
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { isConnected } = useAccount();
  const { data: hash, isPending, writeContract, error } = useWriteContract();

  useEffect(() => {
    if (hash) {
      setTransactionStatus("Transaction successful!");
    }
    if (error) {
      toast.error(error.message ?? "Transaction failed. Please try again.");
    }
  }, [hash, error]);

  /**
   * Handles setting the username in the smart contract.
   */
  const setUsernameOnChain = async (username: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (!username.trim()) {
      toast.error("Username cannot be empty.");
      return;
    }
    if (username.length < 4) {
      toast.error("Username must be at least 4 characters long!");
      return;
    }

    setTransactionStatus(null);
    setErrorMessage("");

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "setUsername",
        args: [username],
      });
    } catch (err: unknown) {
      if (err instanceof BaseError) {
        setErrorMessage(err.shortMessage || err.message);
      }
    }
  };

  return {
    setUsernameOnChain,
    isPending,
    transactionStatus,
    errorMessage,
  };
};
