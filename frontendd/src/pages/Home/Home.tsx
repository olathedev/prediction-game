import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/Button";

const Home = () => {
  return (
    <motion.section
      initial={{
        scale: 0,
      }}
      animate={{
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        type: "spring",
        ease: "backInOut",
      }}
      exit={{
        scale: 0,
      }}
      className="flex h-svh items-center justify-center"
    >
      <div className="-mt-24  bg-custom-gradient relative flex h-[29.0625rem] w-[20.25rem] shrink-0 flex-col items-center justify-center gap-[4rem] rounded-[3rem] shadow-[inset_0px_-8px_0px_4px_#140E66,inset_0px_6px_0px_8px_#2463FF] md:h-[31.25rem] md:w-[37rem]">
        <motion.img
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          duration: 1,
          type: "spring",
          ease: "backInOut",
          stiffness: 200,
          damping: 10,
          delay: 0.5,
        }}
        exit={{
          scale: 1,
        }}
        // src="/images/logo.svg"
        // alt="Logo"
        className="absolute top-[-3rem] h-[7.21rem] w-[23.344rem] md:top-[-6rem] md:h-[11.25331rem] md:w-[22.2485rem]"
      />

        <div className="flex translate-y-10 flex-col items-center justify-center gap-[2.5rem]">
          <div className="text-center">
            <h1 className="font text-5xl font-bold mb-2">Undead Unluck</h1>

            <h3 className="text-2xl text-gray-300">
              Hypervisual prediction game, built on{" "}
              <span className="text-yellow-500 font-bold">core</span>
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/username">
              <Button name="Get Started!" className="uppercase" />
            </Link>

            <Link to="">
              <Button name="Play Guides" className="uppercase bg-opacity-20" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Home;
