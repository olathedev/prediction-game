import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home/Home";
import Username from "./pages/set-username/SetUsername";
import Game from "./pages/game/Game";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/username", element: <Username /> },
    { path: "/game", element: <Game /> },
    // { path: "*", element: <ErrorPage /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
