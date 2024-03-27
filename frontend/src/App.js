import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Protected from "./protected";
import Registration from "./Registration";

import Landing from "./screens/Landing";
import ItemsList from "./screens/ItemsList";

function App() {
  console.log("I am starting");
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <a href="/auth/login" className="Login">Login</a>
            </li>
            <li>
              <a href="/auth/registration" className="Login">Register</a>
            </li>
            <li>
              <a href="/auth/protected" className="Login">Protected</a>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/registration" element={<Registration />} />
          <Route path="/auth/protected" element={<Protected />} />
          <Route path="/ads/:term" element={<ItemsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
