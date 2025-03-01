// import Body from "./components/Body"

import { Route, Routes } from "react-router-dom"
import Admin from "./components/Admin"
import Body from "./components/Body"

function App() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto h-screen p-4">

      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {/* <Body /> */}
      {/* <Admin /> */}
    </main>
  )
}

export default App
