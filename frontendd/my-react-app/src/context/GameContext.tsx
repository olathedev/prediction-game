import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for the game
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  
  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(60);
    setQuestionsAnswered(0);
    setUserAnswers([]);
  };

  const submitAnswer = (answer) => {
    setUserAnswers([...userAnswers, answer]);
    setQuestionsAnswered(questionsAnswered + 1);
  };

  return (
    <GameContext.Provider value={{ userAnswers, gameStarted, timeLeft, questionsAnswered, startGame, submitAnswer }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};