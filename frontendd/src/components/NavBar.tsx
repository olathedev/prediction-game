import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { useGuessGame } from "../hooks/use-contract.hook";
import { PlayerData } from "../interface";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { playerData } = useGuessGame() as { playerData: PlayerData | null };

  console.log(playerData);
  return (
    <div className="container flex items-center justify-between w-full md:mx-auto my-6 bg-[#2463FF]/40 py-2 sm:px-4 px-2 rounded-full">
      <div>
        <Link to="/" className="text-white flex">
          <img src="/images/lmm.png" className="max-w-12" alt="Logo" />
          <span className="self-center">LuckyMe</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <div className="flex gap-2 items-center text-xl">
          <img
            src="/images/trophy-svgrepo-com.svg"
            className="h-5"
            alt="Trophy"
          />
          <Link to="/leaderboard" className="text-white">
            Leaderboard
          </Link>
        </div>
        {playerData && <p className="text-xl">@{playerData?.username}</p>}
        <div className="flex items-center gap-2">
          <img src="/images/coin.png" className="h-5" alt="Coin" />
          {playerData && <p className="text-lg">{playerData?.totalPoints}</p>}
        </div>
        <ConnectButton />
      </div>

      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? (
          <IoCloseSharp className="h-6 w-6 text-white" />
        ) : (
          <IoMdMenu className="h-6 w-6 text-white" />
        )}
      </button>

      {menuOpen && (
        <div className="absolute top-16 right-4 bg-[#2463FF] text-white rounded-lg p-4 shadow-md w-48">
          {playerData && <p className="text-lg">@{playerData?.username}</p>}
          <div className="flex gap-2 items-center text-xl">
            <img
              src="/images/trophy-svgrepo-com.svg"
              className="h-5"
              alt="Trophy"
            />
            <Link to="/leaderboard" className="text-white">
              Leaderboard
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <img src="/images/coin.png" className="h-5" alt="Coin" />
            {playerData && (
              <p className="text-lg">@{playerData?.totalPoints}</p>
            )}
            {/* <span className="text-lg">20</span> */}
          </div>
          <div className="mt-4">
            <ConnectButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
