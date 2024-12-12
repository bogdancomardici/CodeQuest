import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./components/user/UsersPage";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/dashboard/Dashboard.js";
import Challenges from "./components/challenges/Challenges";
import SoloChallenge from "./components/solochallenge/SoloChallenge";
import Resources from "./components/resources/Resources.js";
import SoloResource from "./components/solosresource/SoloResource";
import Leaderboard from "./components/leaderboard/Leaderboard";
import LandingPage from "./components/landingpage/LandingPage";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/soloChallenge/:id" element={<SoloChallenge />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resource/:id" element={<SoloResource />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
