import { useWriteContract } from "wagmi";
import rawAbi from "../abi/Game.json";
import { FormEvent } from "react";

const Admin = () => {
  const abi = rawAbi.abi;

  const {
    data: hash,
    isError,
    error,
    isPending,
    writeContract,
  } = useWriteContract();

  if (isError) {
    console.log(error);
  }

  const handleCreatePlayer = async (e: FormEvent) => {
    e.preventDefault();
    writeContract({
      address: "0x45d3B4E6D50BFFb87CF5b1129aFc2955927EBf49",
      abi,
      functionName: "createPlayer",
      args: ["Johndoe"],
    });
  };

  return (
    <div>
      <div className="text-white">
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleCreatePlayer}
        >
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
            <button className="bg-[#00D4FF] rounded-lg px-3 py-2">
              {isPending ? "loading..." : "register"}
            </button>
          </div>
          <p>Trx hash: {hash}</p>
        </form>
      </div>
    </div>
  );
};

export default Admin;
