import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./Login";
import Registration from "./Registration";
import Landing from "./screens/Landing";
import ItemsList from "./screens/ItemsList";
import Info from "./screens/Info";
import PostAdScreen from "./screens/PostAdScreen";
import AdminPage from "./screens/AdminPage";
import ChatScreen from "./screens/ChatScreen";

function App() {
  // Toggle visibility of navbar links for mobile view
  const toggleNavLinks = () => {
    // Check if the hamburger menu is visible
    const menu = document.querySelector(".hamburger-menu");
    if (getComputedStyle(menu).display !== "none") {
      const links = document.querySelectorAll("nav a");
      links.forEach((link) => {
        if (link.style.display === "block" || link.style.display === "") {
          link.style.display = "none";
        } else {
          link.style.display = "block";
        }
      });
    }
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <div className="hamburger-menu" onClick={toggleNavLinks}>
            ☰
          </div>
          <Link to="/">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Home
            </div>
          </Link>
          <Link to="/auth/login">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Login
            </div>
          </Link>
          <Link to="/auth/registration">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Register
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
          <Link to="/chat">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Chat Room
            </div>
          </Link>
          <Link to="/adminPage/">
            <div className="cursor-pointer bg-[#fffee0] rounded-md p-2">
              Admin Page
            </div>
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/registration" element={<Registration />} />
          <Route path="/ads/:term" element={<ItemsList />} />
          <Route path="/adsInfo/:id/:term" element={<Info />} />
          <Route path="/postAd" element={<PostAdScreen />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/chat" element={<ChatScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
