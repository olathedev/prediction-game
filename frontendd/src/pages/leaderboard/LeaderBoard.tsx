import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMedal } from "react-icons/fa";
import Button from "../../components/Button";
import { useGuessGame } from "../../hooks/use-contract.hook";

const medals = ["gold", "silver", "bronze"];

const LeaderBoard = () => {
  const { gameLeaderboard } = useGuessGame() as {
    gameLeaderboard: { username: string; totalPoints: number }[];
    globalLeaderboard: { username: string; totalPoints: number }[];
  };

  console.log("==>", gameLeaderboard);
  return (
    <motion.section
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.7, type: "spring", ease: "backInOut" }}
      exit={{ scale: 0 }}
      className="flex h-svh items-center justify-center"
    >
      <div className="-mt-28 bg-custom-gradient relative flex h-[29.0625rem] w-[20.25rem] shrink-0 flex-col items-center justify-center gap-[1rem] rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] md:h-[31.25rem] md:w-[37rem] p-10">
        <h1 className="text-4xl font-bold text-center mb-4">Leaderboard</h1>

        {gameLeaderboard && gameLeaderboard.length > 0 ? (
          <div className="w-full flex flex-col gap-2">
            {gameLeaderboard.map(
              (
                player: { username: string; totalPoints: number },
                index: number
              ) => (
                <div
                  key={player.username + index}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/20 text-xl"
                >
                  <div className="flex items-center gap-3">
                    {index < 3 ? (
                      <FaMedal
                        className={`text-${medals[index]}-500 text-2xl`}
                      />
                    ) : (
                      <span className="text-gray-300 text-2xl">
                        {index + 1}
                      </span>
                    )}
                    <span>{player.username}</span>
                  </div>
                  <span className="text-yellow-500 font-bold">
                    {player.totalPoints}
                  </span>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-white text-xl">No leaderboard data available</p>
        )}

        <Link to="/">
          <Button name="Back to Home" className="uppercase" />
        </Link>
      </div>
    </motion.section>
  );
};

export default LeaderBoard;
