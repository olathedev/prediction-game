// import Body from "./components/Body"

import { Route, Routes } from "react-router-dom";
import AdminPage from "./pages/admin";
import HomePage from "./pages/home";
import Header from "./components/Header";

function App() {
  return (
    <main className="min-h-screen max-w-4xl mx-auto h-screen relative">
      <header className="fixed md:top-2 h-14 w-full right-0 z-50 flex items-center justify-center bottom-0">
        <Header />
      </header>
      <div className="p-2 md:pt-14">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
