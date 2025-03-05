import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";
import { useEffect } from "react";

const InfoScreen = () => {
  const navigate = useNavigate();

  const onPlay = () => {
    navigate('/game'); // Assuming '/game' is the route to start the game
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: "spring", ease: "backInOut" }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-custom-gradient p-8 rounded-3xl shadow-lg w-80 md:w-96 text-center flex flex-col items-center gap-4">
        <h2 className="text-3xl font-bold text-white">Get Ready!</h2>
        <p className="text-xl text-gray-300">
          You have 60 seconds to play. After that, you will lose!
        </p>
        <p className="text-xl text-gray-300">
          You are required to answer 10 questions.
        </p>
        <Button
          name="Play"
          className="uppercase w-full flex items-center justify-center"
          onClick={onPlay}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l4 4m0 0l-4 4m4-4H6" />
          </svg>
          Play
        </Button>
      </div>
    </motion.div>
  );
};

export default InfoScreen;