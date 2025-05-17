import { motion } from "framer-motion";
import PlayButton from "./Playbutton";
import { useGame } from "../context/GameContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

const InfoScreen = ({ onClose }: Props) => {
  const navigate = useNavigate();
  const { setQuestions } = useGame();
  const [loading, setLoading] = useState(false);

  const onStart = async () => {
    if (loading) return; 

    setLoading(true);
    try {
      const res = await fetch(
        "https://prediction-api-1.onrender.com/api/create-question"
      );
      const data = await res.json();
      if (res.ok) {
        setQuestions(data?.questions);
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: "spring", ease: "backInOut" }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center px-5"
    >
      <div className="bg-custom-gradient p-8 relative flex md:h-[30rem] w-full md:w-[38rem] flex-col items-center justify-center gap-8 rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] mt-12">
        <h2 className="text-3xl font-bold text-white">
          Get Ready! Please read!
        </h2>
        <p className="text-[22px] text-gray-300 text-center">
          Hey there, Player! In this challenge, you'll need to answer 10
          predictive questions and stake{" "}
          <span className="text-yellow-500">0.02 ETH</span>. If you get
          8 predictions right, you'll double your stake. You've got just 45
          seconds to showcase your skills and beat the clock. Remember, time
          waits for no one, so stay sharp and have fun! Good luck!
        </p>

        {/* Play Button with Loading State */}
        <div
          className={`mt-2 relative ${
            loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
          }`}
          onClick={!loading ? onStart : undefined}
        >
          <PlayButton />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
              <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-8 h-8"></div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="text-gray-300 cursor-pointer text-xl hover:text-white transition"
        >
          Exit game
        </button>
      </div>
    </motion.div>
  );
};

export default InfoScreen;
