import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Landing from "./screens/Landing";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
