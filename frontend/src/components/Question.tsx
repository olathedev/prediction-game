const Question = () => {
  return (
    <div className="bg-[#080c14] bg-opacity-80 backdrop-blur-xl p-6 lg:w-3/5 rounded-xl flex flex-col space-y-5 text-white my-10">
      {/* <div className="bg-gradient-to-r text-sm from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">120d 9h 48m 37s</div> */}
      <h2 className="text-gray-300">
        Dogecoin (DOGE) market capitalization reaches or exceeds $100 billion on
        CoinGecko by July 1, 2025.
      </h2>

      <div className="flex text-sm text-gray-400">
        <div className="flex items-center gap-1 ">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>
          </span>
          {/* <p className="font-medium"></p> */}
        <p className="inline-flex gap-1 text-xs">
            Yes (<span className="">2%</span>)
        </p>
        -
        <p className="inline-flex gap-1 text-xs">
            No (<span className="">50%</span>)
        </p>

        ROI
        </div>

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
