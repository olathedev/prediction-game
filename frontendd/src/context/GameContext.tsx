import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

interface Question {
  question: string;
  answer: string ;
  options: string[];
}

interface GameContextType {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: number[];
  gameOver: boolean;
  nextQuestion: (answer: number) => void;
  restartGame: () => void;
  getQuestions: () => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
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
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setGameOver(false);
  };

  const getQuestions = useCallback(async () => {
    try {
      const res = await fetch(
        "https://prediction-api-1.onrender.com/api/create-question"
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  }, []);

  const nextQuestion = useCallback(
    (answer: number) => {
      setUserAnswers((prev) => [...prev, answer]);
      if (currentQuestionIndex < 9) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    },
    [currentQuestionIndex]
  );

  const value = useMemo(
    () => ({
      questions,
      currentQuestionIndex,
      userAnswers,
      gameOver,
      nextQuestion,
      restartGame: startNewGame,
      getQuestions,
      setQuestions,
    }),
    [
      questions,
      currentQuestionIndex,
      userAnswers,
      gameOver,
      nextQuestion,
      getQuestions,
      setQuestions,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
