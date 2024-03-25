import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Landing from "./screens/Landing";
import ItemsList from "./screens/ItemsList";
import Info from "./screens/Info";
import PostAdScreen from "./screens/PostAdScreen";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">
            {" "}
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Home
            </div>
          </Link>
          <Link to="/postAd">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Post Ad
            </div>
          </Link>
          <Link to="/ads/bySale=">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Items for Sale
            </div>
          </Link>
          <Link to="/ads/byWanted=">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Items Wanted
            </div>
          </Link>
          <Link to="/ads/byService=">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Services Offered
            </div>
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/ads/:term" element={<ItemsList />} />
          <Route path="/adsInfo/:id/:term" element={<Info />} />
          <Route path="/postAd" element={<PostAdScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
