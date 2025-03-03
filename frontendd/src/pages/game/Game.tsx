import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useGame } from "../../context/GameContext";
import GameOverModal from "../../components/GameOver";

const Game = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { questions, currentQuestionIndex, nextQuestion, gameOver, userAnswers } = useGame();

  const [showModal, setShowModal] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    console.log(userAnswers)
  }, [userAnswers])

  if (gameOver && !showModal) {
    setShowModal(true);
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="-mt-20 flex flex-col h-svh items-center justify-center"
    >
      {!gameOver ? (
        <div className="bg-custom-gradient p-8 relative flex md:h-[33rem] w-[22rem] md:w-[40rem] flex-col items-center justify-center gap-8 rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF]">
          {/* Question */}
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white text-center px-4"
          >
            {currentQuestion?.question}
          </motion.h2>

          {/* Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col w-full items-center gap-4"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={`w-[80%] rounded-[2rem] p-4 text-xl font-semibold  text-white transition-all ${
                selectedOption === currentQuestion?.option1
                  ? "bg-green-500/60"
                  : "bg-[#000]/30"
              }`}
              onClick={() => handleSelect(currentQuestion?.option1)}
            >
              {currentQuestion?.option1}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={`w-[80%] rounded-[2rem] p-4 text-xl font-semibold  text-white transition-all ${
                selectedOption === currentQuestion?.option2
                  ? "bg-green-500/60"
                  : "bg-[#000]/30"
              }`}
              onClick={() => handleSelect(currentQuestion?.option2)}
            >
              {currentQuestion?.option2}
            </motion.button>
          </motion.div>

          {/* Back Button */}
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-6"
            >
            <Button
              name="Go Back"
              onClick={() => navigate("/")}
              className="uppercase bg-opacity-20"
            />

            <Button
              name="Next"
              onClick={() => nextQuestion(selectedOption === currentQuestion?.option1 ? 0 : 1)}
              className="uppercase bg-opacity-20"
            />
            </motion.div>
        </div>
      ) : (
        showModal && <GameOverModal onClose={() => setShowModal(false)} />
      )}
      {/* <h1 className="mb-10 text-xl">Round 1</h1> */}
    </motion.section>
  );
};

export default Game;
