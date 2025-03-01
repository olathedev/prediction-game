const Admin = () => {
  return (
    <div>
      <div className="text-white">
        <form action="" className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="ROI for option yes"
            className="border border-[#00D4FF] rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="ROI for option yes"
            className="border border-[#00D4FF] rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Deadline for prediction"
            className="border border-[#00D4FF] rounded-lg p-2"
          />
          <input
            type="text"
            className="border border-[#00D4FF] rounded-lg p-2"
            placeholder="Question t be predicted"
          />
          <div className="flex justify-center">
            <button className="bg-[#00D4FF] rounded-lg px-3 py-2">Create Pool</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
