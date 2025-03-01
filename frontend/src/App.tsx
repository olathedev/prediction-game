// import Body from "./components/Body"

import { Route, Routes } from "react-router-dom"
import AdminPage from "./pages/admin"
import HomePage from "./pages/home"

function App() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto h-screen p-4">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </main>
  )
}

export default App
