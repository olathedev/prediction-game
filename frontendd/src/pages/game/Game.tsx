import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Game = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Example question
  const question = "Two high-performance race cars are lined up at the starting line, ready to battle it out on a fast-paced, high-stakes track. Car A and Car B, which do you think would win";
  const options = ["Car A", "Car B", "Both"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-svh items-center justify-center"
    >
        <h1 className="mb-4 text-3xl">Round 1</h1>
      <div className="bg-custom-gradient p-8 relative flex md:h-[33rem] w-[22rem] md:h-[35rem] md:w-[40rem] flex-col items-center justify-center gap-8 rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF]">
        
        {/* Question */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-white text-center px-4"
        >
          {question}
        </motion.h2>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col w-full items-center gap-4"
        >
          {options.map((option, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={`w-[80%] rounded-[2rem] p-4 text-xl font-semibold  text-white transition-all ${
                selectedOption === option
                  ? "bg-green-500"
                  : "bg-[#2463FF] hover:bg-blue-600"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </motion.button>
          ))}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-6"
        >
          <Button name="Go Back" onClick={() => navigate("/")} className="uppercase bg-opacity-20" />
            
          <Button name="Submit" onClick={() => navigate("/")} className="uppercase bg-opacity-20" />

        </motion.div>
      </div>
    </motion.section>
  );
};

export default Game;
