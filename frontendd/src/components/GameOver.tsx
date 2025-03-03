import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";

interface GameOverModalProps {
  onClose: () => void;
}

const GameOverModal = ({ onClose }: GameOverModalProps) => {
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
        <p className="text-lg text-gray-300">You've completed 10 questions!</p>

        <Link to="/result" className="w-full">
          <Button name="View Results" className="uppercase w-full" />
        </Link>
        <button
          onClick={onClose}
          className="mt-2 text-gray-300 hover:text-white transition"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default GameOverModal;
