import { motion } from "framer-motion";
import PlayButton from "./Playbutton";

interface Props {
  onClose: () => void;
}

const InfoScreen = ({ onClose }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: "spring", ease: "backInOut" }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-custom-gradient p-8 relative flex md:h-[26rem] w-[22rem] md:w-[38rem] flex-col items-center justify-center gap-8 rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] mt-12">
        <h2 className="text-3xl font-bold text-white">Get Ready! Please read!</h2>
        <p className="text-[22px] text-gray-300 text-center">
          Hey there, Player! in this challanege
          you'll need to answer 10 predictive questions, and would be required to stake <span className="text-yellow-500">0.2 core tokens</span> you'll get back double of your stake if you get 8 predicitons right.  You've got just 60
          seconds to showcase your skills and beat the clock or loose your stake, Remember, time
          waits for no one, so stay sharp and have fun! Good luck!
        </p>
        <div className="mt-4" onClick={onClose}>
          <PlayButton />
        </div>
      </div>
    </motion.div>
  );
};

export default InfoScreen;
