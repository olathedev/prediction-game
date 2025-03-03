import { createContext, useContext, useEffect, useState } from "react";
import questionsData from "../data/question.json"; // Import your JSON file

interface Question {
  question: string;
  option1: string;
  option2: string;
}

interface GameContextType {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: string[];
  gameOver: boolean;
  nextQuestion: (answer: string) => void;
  restartGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
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

  const nextQuestion = (answer: string) => {
    setUserAnswers((prev) => [...prev, answer]);
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  return (
    <GameContext.Provider value={{ questions, currentQuestionIndex, userAnswers, gameOver, nextQuestion, restartGame: startNewGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
