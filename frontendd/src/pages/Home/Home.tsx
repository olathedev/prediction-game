import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/Button";
import { useAccount, useConnect } from "wagmi";
import { useGuessGame } from "../../hooks/use-contract.hook";
import { PlayerData } from "../../interface";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";

const Home = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { playerData } = useGuessGame() as { playerData: PlayerData | null };
  const { restartGame } = useGame();
  const handleStartGame = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      connect({ connector: connectors[0] });
      return;
    }
  
    if (playerData?.username) {
      restartGame()
      navigate("/game");
    } else {
      navigate("/username");
    }
  };

  return (
    <motion.section
      initial={{
        scale: 0,
      }}
      animate={{
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        type: "spring",
        ease: "backInOut",
      }}
      exit={{
        scale: 0,
      }}
      className="flex h-svh items-center justify-center"
    >
      <div className="-mt-24 bg-custom-gradient relative flex h-[29.0625rem] w-[20.25rem] shrink-0 flex-col items-center justify-center gap-[4rem] rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] md:h-[31.25rem] md:w-[37rem]">
        <div className="flex translate-y-10 flex-col items-center justify-center gap-[2.5rem]">
          <div className="text-center">
            <h1 className="font text-5xl font-bold mb-2">Lucky Me</h1>

            <h3 className="text-2xl text-gray-300">
              HyperCasual prediction game, built on{" "}
              <span className="text-yellow-500 font-bold">base</span>
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              name="Get Started!"
              className="uppercase"
              onClick={handleStartGame}
            />

            <Link to="/play-guide">
              <Button name="Play Guides" className="uppercase bg-opacity-20" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Home;
