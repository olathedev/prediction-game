import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUsername } from "../../hooks/use-contract.hook"; // Import the custom hook
import Button from "../../components/Button";

const Username = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { setUsernameOnChain, isPending, transactionStatus, errorMessage } =
    useUsername();

  useEffect(() => {
    if (transactionStatus) {
      setTimeout(() => {
        navigate("/game");
      }, 2000);
    }
  }, [transactionStatus, navigate]);

  const handleSubmit = () => {
    setUsernameOnChain(username);
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="-mt-20 flex h-svh items-center justify-center"
    >
      <div className="bg-custom-gradient relative flex h-[29rem] w-[22rem] md:h-[32rem] md:w-[40rem] flex-col items-center justify-center gap-[3rem] rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] mt-12">
        <h2 className="text-3xl font-bold text-white">Enter Your Username</h2>

        {/* Animated Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-[80%]"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Type your username..."
            className="w-full rounded-[2rem] bg-transparent p-4 text-center text-xl text-white border-2 border-[#2463FF] outline-none transition-all shadow-[inset_0px_-2px_0px_3px_#000000,inset_0px_1px_0px_6px_#3C74FF] backdrop-blur-md"
          />
        </motion.div>

        {/* Error Message */}
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm"
          >
            {errorMessage}
          </motion.p>
        )}

        {/* Transaction Status */}
        {transactionStatus && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 text-sm"
          >
            {transactionStatus}
          </motion.p>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4"
        >
          <Button
            name={isPending ? "Processing..." : "Start Game"}
            onClick={handleSubmit}
            className="uppercase"
          />
          <Button
            name="Go Back"
            onClick={() => navigate("/")}
            className="uppercase bg-opacity-20"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Username;
