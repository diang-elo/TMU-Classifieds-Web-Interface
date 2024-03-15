import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./screens/Landing";
import ItemsList from "./screens/ItemsList";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/ads/:term" element={<ItemsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
