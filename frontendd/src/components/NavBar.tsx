import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";

// @ts-ignore
import { IoMdMenu } from "react-icons/io5";

// @ts-ignore
import { IoCloseSharp } from "react-icons/io5";
import { useGuessGame } from "../hooks/use-contract.hook";
import { PlayerData } from "../interface";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { playerData } = useGuessGame() as { playerData: PlayerData | null };

  console.log(playerData);
  return (
    <div className="container flex items-center justify-between w-full md:mx-auto my-6 bg-[#2463FF]/40 py-2 px-2 rounded-full z-50 sticky top-0">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>

      {menuOpen && (
        <div className="absolute top-16 right-1 bg-[#2463FF] text-white rounded-lg p-4 shadow-md w-full z-50">
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
              <p className="text-lg">{playerData?.totalPoints}</p>
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
