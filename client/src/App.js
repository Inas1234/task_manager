import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Board from "./Board";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/board" element={<Board></Board>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
