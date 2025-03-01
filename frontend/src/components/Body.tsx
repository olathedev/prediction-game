const Body = () => {
  return (
    <div className="text-center">
      <div>
        <div className="text-white border border-[#00D4FF] rounded-lg p-5 lg:w-3/5 m-auto">
          <h1 className="text-lg font-semibold">Chelsea vs Man U</h1>
          <p className="text-gray-400 font-light">Man U must fail.</p>
          <div className="flex justify-between">
            <div className="flex gap-3 justify-center mt-5">
              <button className="px-4 py-1 rounded-lg bg-[#00D4FF]">
                Yes <span className="bg-[#00D4FF]">2.0x</span>
              </button>
              <button className="px-4 py-1 rounded-lg bg-[#00D4FF]">
                No <span className="bg-[#00D4FF]">1.8x</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 self-end">
              Dealine:{" "}
              <span>
                25<sup>th</sup> March
              </span>{" "}
              <span>10:30pm</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
