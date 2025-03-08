import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useGame } from "../../context/GameContext";
import GameOverModal from "../../components/GameOver";
import TimeOver from "../../components/TimeOver";
import toast from "react-hot-toast";
import InfoScreen from "../../components/InfoScreen";
import { Howl } from "howler";
import startSound from "../../assets/sounds/start.mp3";
import timerElapseSound from "../../assets/sounds/game-over.mp3";
import { useGuessGame } from "../../hooks/use-contract.hook";

const Game = () => {
  // const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showInfoScreen, setShowInfoScreen] = useState(true);
  const { stakeETH } = useGuessGame();

  useEffect(() => {
    const sound = new Howl({
      src: [startSound],
      volume: 1,
    });
    sound.play();
  }, [showInfoScreen]);

  const {
    questions,
    currentQuestionIndex,
    nextQuestion,
    gameOver,
    restartGame,
  } = useGame();
  const [predictions, setPredictions] = useState<number[]>([]);
  console.log(predictions);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(45); // Timer state
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setPredictions((prev) => [
      ...prev,
      option === currentQuestion?.options[0] ? 0 : 1,
    ]);
  };

  useEffect(() => {
    if (showInfoScreen) return;

    if (gameOver) {
      setShowModal(true);
    }
  }, [gameOver, showInfoScreen]);

  useEffect(() => {
    if (!showInfoScreen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      const timerSound = new Howl({
        src: [timerElapseSound],
        volume: 1,
      });
      timerSound.play();
    }
  }, [timer, showInfoScreen]);

  const handleSubmit = () => {
    if (!selectedOption) {
      toast.error("please select an option");
      return;
    }

    setSelectedOption(null);
    nextQuestion(selectedOption === currentQuestion?.options[0] ? 0 : 1);
  };

  if (timer <= 0) {
    return <TimeOver />;
  }

  return (
    <>
      {showInfoScreen ? (
        <InfoScreen
          onClose={() => {
            restartGame();
            stakeETH(0.02, () => setShowInfoScreen(false));
          }}
        />
      ) : (
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="-mt-20 flex flex-col h-svh items-center justify-center"
        >
          {!gameOver ? (
            <div className="bg-custom-gradient lg:p-8 p-12 relative flex md:h-[33rem] w-[22rem] md:w-[40rem] flex-col items-center justify-center gap-8 rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] mt-12">
              
              {/* Question Progress */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute lg:top-8 lg:left-12 left-4 top-4 lg:text-xl text-sm font-semibold text-white  px-4 py-2 rounded-lg"
              >
                {currentQuestionIndex + 1} of 10
              </motion.div>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`absolute lg:top-10 top-6 right-4 lg:right-12 lg:text-3xl font-bold rounded-full lg:px-4 px-2 py-1 lg:py-2 ${
                  timer <= 15 ? "bg-red-500 text-white" : "bg-white text-black"
                } shadow-lg`}
              >
                {timer}s
              </motion.div>

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
                    selectedOption === currentQuestion?.options[0] 
                      ? "bg-green-500/60"
                      : "bg-[#000]/30"
                  }`}
                  onClick={() => handleSelect(currentQuestion?.options[0])}
                >
                  {currentQuestion?.options[0]}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className={`w-[80%] rounded-[2rem] p-4 text-xl font-semibold  text-white transition-all ${
                    selectedOption === currentQuestion?.options[1]
                      ? "bg-green-500/60"
                      : "bg-[#000]/30"
                  }`}
                  onClick={() => handleSelect(currentQuestion?.options[1])}
                >
                  {currentQuestion?.options[1]}
                </motion.button>
              </motion.div>

              {/* Back & Next Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex gap-6"
              >
                <Button
                  name="Go Back"
                  // onClick={() => navigate("/")}
                  className="uppercase bg-opacity-20"
                />
                <Button
                  name="Next"
                  onClick={handleSubmit}
                  className="uppercase bg-opacity-20"
                />
              </motion.div>
            </div>
          ) : (
            showModal && <GameOverModal onClose={() => setShowModal(false)} />
          )}
        </motion.section>
      )}
    </>
  );
};

export default Game;
