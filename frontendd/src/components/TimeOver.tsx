import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";
import { useGame } from "../context/GameContext";
import { useGuessGame } from "../hooks/use-contract.hook";
import { useEffect } from "react";

const TimeOver = () => {
  const { isPending } = useGuessGame();
  const { restartGame } = useGame();
  const navigate = useNavigate();

  const onClose = () => {
    restartGame();
    navigate("/");
  };

  // useEffect(() => {
  //   if (transactionStatus === "success") {
  //     navigate("/");
  //   }
  // }, [transactionStatus, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: "spring", ease: "backInOut" }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-custom-gradient p-8 rounded-3xl shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] w-80 md:w-96 text-center flex flex-col items-center gap-4">
        <h2 className="text-3xl font-bold text-white">Game Over</h2>
        <p className="text-xl text-gray-300">
          Time's up! You gave it your best shot, but the clock won this round.
          you've lost your stake, Better luck next time!
        </p>

        <Button
          name={isPending ? "Processing" : "Try again"}
          className="uppercase w-full"
          onClick={onClose}
        />
      </div>
    </motion.div>
  );
};

export default TimeOver;
