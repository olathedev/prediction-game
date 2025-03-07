import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/Button";
import { useGame } from "../../context/GameContext";

const Results = () => {
  const navigate = useNavigate();
  
  const {questions, userAnswers}= useGame();

  // Mocked data: Replace with real answers from state or API
  const results = questions.map((question, index) => ({
    question: question.question,
    correct: parseInt(question.answer) === userAnswers[index],
  }));

  const totalCorrect = results.filter((res) => res.correct).length;
  const totalIncorrect = results.length - totalCorrect;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-svh overflow-y-auto p-4 -mt-16"
    >
      <div className="bg-custom-gradient p-8 relative flex flex-col items-center gap-6 rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] w-[22rem] md:w-[40rem] min-h-[60vh] max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent scrollbar-thumb-rounded-full">
        {/* Results Title */}
        <h2 className="text-2xl font-bold text-white text-center">Your Results</h2>

        {/* Scrollable Questions List */}
        <div className="w-full flex flex-col gap-3 px-4 overflow-y-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thumb-rounded-full">
          {results.map((res, index) => (
            <div key={index} className="flex justify-between bg-black/20 p-3 rounded-lg text-white">
              <p className="text-sm">{res.question}</p>
              <span className={`text-xl ${res.correct ? "text-green-400" : "text-red-500"}`}>
                {res.correct ? "✔️" : "❌"}
              </span>
            </div>
          ))}
        </div>

        {/* Total Score */}
        <div className="text-center text-white text-lg font-semibold mt-4">
          ✅ Correct: {totalCorrect} | ❌ Incorrect: {totalIncorrect}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 mt-6">
          <Button name="Play Again" onClick={() => navigate("/game")} className="uppercase bg-opacity-20" />
          <Button name="Go Home" onClick={() => navigate("/")} className="uppercase bg-opacity-20" />
        </div>
      </div>
    </motion.section>
  );
};

export default Results;
