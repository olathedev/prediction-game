import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWriteContract } from "wagmi";
import rawAbi from "../../abi/Game.json";
import toast from "react-hot-toast";
import Button from "../../components/Button";

const abi = rawAbi.abi;

const Username = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const { data: hash, isPending, writeContract } = useWriteContract();

  const handleSubmit = () => {
    if (!username.trim()) {
      toast.error("Username is required!");
      return;
    }
    if (username.length < 4) {
      toast.error("Username must be at least 4 characters long!");
      return;
    }

    writeContract({
      address: "0x994AB27b19223257bA5CdEd057fD03a2C0650BAC",
      abi,
      functionName: "setUsername",
      args: [username],
    });

    // navigate("/game"); // Uncomment if you want to navigate after setting the username
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

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4"
        >
          <Button
            name={isPending ? "Loading..." : "Start Game"}
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
