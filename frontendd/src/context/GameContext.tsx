import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import questionsData from "../data/question.json"; // Import your JSON file

interface Question {
  question: string;
  option1: string;
  option2: string;
}

interface GameContextType {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: number[];
  gameOver: boolean;
  nextQuestion: (answer: number) => void;
  restartGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setGameOver(false);
  };

  const nextQuestion = useCallback((answer: number) => {
    setUserAnswers((prev) => [...prev, answer]);
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  }, [currentQuestionIndex]);

  const value = useMemo(
    () => ({
      questions,
      currentQuestionIndex,
      userAnswers,
      gameOver,
      nextQuestion,
      restartGame: startNewGame,
    }),
    [questions, currentQuestionIndex, userAnswers, gameOver, nextQuestion]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
