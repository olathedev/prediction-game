import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMedal } from "react-icons/fa";
import Button from "../../components/Button";

const medals = ["gold", "silver", "bronze"];
const leaderboardData = [
  { username: "Alice", score: 1500 },
  { username: "Bob", score: 1300 },
  { username: "Charlie", score: 1200 },
  { username: "Dave", score: 1100 },
  { username: "Eve", score: 1000 },
];

const LeaderBoard = () => {
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
        <div className="w-full flex flex-col gap-2">
          {leaderboardData.map((player, index) => (
            <div
              key={player.username}
              className="flex items-center justify-between p-3 rounded-xl bg-black/20 text-xl"
            >
              <div className="flex items-center gap-3">
                {index < 3 ? (
                  <FaMedal className={`text-${medals[index]}-500 text-2xl`} />
                ) : (
                  <span className="text-gray-300 text-2xl">{index + 1}</span>
                )}
                <span>{player.username}</span>
              </div>
              <span className="text-yellow-500 font-bold">{player.score}</span>
            </div>
          ))}
        </div>
        <Link to="/">
          <Button name="Back to Home" className="uppercase" />
        </Link>
      </div>
    </motion.section>
  );
};

export default LeaderBoard;
