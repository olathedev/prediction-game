import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Username from "./pages/set-username/SetUsername";
import Game from "./pages/game/Game";
import NavBar from "./components/NavBar";
import LeaderBoard from "./pages/leaderboard/LeaderBoard";
import { Toaster } from "react-hot-toast";
import Results from "./pages/result/Result";
import PlayGuide from "./pages/play-guide/PlayGuide";

function App() {
  return (
    <div className="lg:px-0 px-5">
      <Toaster position="top-center" reverseOrder={false} />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/username" element={<Username />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/result" element={<Results />} />
        <Route path="/play-guide" element={<PlayGuide />} />


        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
