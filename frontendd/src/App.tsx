import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Username from "./pages/set-username/SetUsername";
import Game from "./pages/game/Game";
import NavBar from "./components/NavBar";
import LeaderBoard from "./pages/leaderboard/LeaderBoard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/username" element={<Username />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Routes>
    </>
  );
}

export default App;
