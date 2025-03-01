
interface Props {
  question: string;
  // options: string[];
}

const Question = ( { question } : Props ) => {
  return (
    <div className="bg-[#080c14] bg-opacity-80 backdrop-blur-xl p-6 lg:w-3/5 rounded-xl flex flex-col space-y-5 text-white">
      {/* <div className="bg-gradient-to-r text-sm from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">120d 9h 48m 37s</div> */}
      <h2 className="text-gray-300">
        { question }
      </h2>

      <div className="flex text-sm text-gray-400">
     
      </div>

      <div className="w-full flex gap-4">
        <button className="bg-purple-400/60 py-2 w-1/2 rounded-lg text-sm">
          Yes
        </button>
        <button className="bg-purple-400/60  py-2 w-1/2 rounded-lg text-sm ">
          No
        </button>
      </div>
    </div>
  );
};

export default Question;
