import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";

import Landing from "./screens/Landing";
import ItemsList from "./screens/ItemsList";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <a href="/Login" className="Login">Login</a>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ads/:term" element={<ItemsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
