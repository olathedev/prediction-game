import { Link } from "react-router-dom";

const GameOverModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Game Over</h2>
        <p className="text-gray-600 mt-2">You've completed 10 questions!</p>

        <Link to="/result">
          <button
            className="mt-4 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={onClose}
          >
            View Results
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GameOverModal;
