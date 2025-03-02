import Button from "./Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NavBar = () => {
  return (
    <div className="container flex items-center justify-between md:mx-auto my-6 bg-[#2463FF]/40 py-2 px-6 rounded-full">
      <div className="rounded-[2.5rem]  py-3 flex items-center gap-2 text-xl">
        <img src="/images/trophy-svgrepo-com.svg" className="h-5" />
        <p>LeaderBoard</p>
      </div>

      <div className="flex items-center text-lg gap-4">
        <div className="flex items-center space-x-6">
          <p className="text-xl">@Username</p>

          <div className="inline-flex items-center gap-2">
            <img src="/images/coin.png" className="h-5" />
            <span className="text-xl">20</span>
          </div>

          {/* <Button name="Connect" />
           */}
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
