import React, { useState, useEffect } from "react";
import MazeGame from "./components/MazeGame.tsx"
import { setAuthToken } from "./services/api";
// import { getLeaderboard, setAuthToken } from "./services/api";
// import { getLeaderboard, setAuthToken, saveScore } from "./services/api";
import { AuthModal } from "./components/AuthModal";
import './App.css'

import {
  saveAuthUser,
  getAuthUser,
  clearAuth,
} from "./services/auth.ts";
import type { AuthUser } from "./utils/dataTypes.ts";
// import type { AuthUser, LeaderboardEntry } from "./utils/dataTypes.ts";

import "./App.css";

type View = "home" | "game" | "leaderboard";

const HomeScreen = (
  props: {
    currentView: View;
    setCurrentView: React.Dispatch<React.SetStateAction<View>>;
  }
) => {

  const { currentView, setCurrentView } = props;

  return (
    <div className="game-container">
      <section className="mode-selection">
        <h2>Current view: {currentView}</h2>
        <h2>Select Game</h2>
          <button
            key={"altar"}
            className="btn btn-primary"
            onClick={() => setCurrentView("game")}
          >
            Go to the Altar
          </button>
       </section>

      <section className="leaderboard-section" style={{ marginTop: "25px" }}>
        <h2>Leaderboard</h2>
        <button
          key={"leaderboard"}
          className="btn btn-primary"
          onClick={() => setCurrentView("leaderboard")}
        >
          View Leaderboard
        </button>
      </section>
    </div>
  )

}

export const App: React.FC = () => {
  // const [boardSize, setBoardSize] = useState<number>(3);
  const [currentView, setCurrentView] = useState<View>("home");
  // const [leaderboardSize, setLeaderboardSize] = useState<number>(3);
  // const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Restore session on mount and after redirect back from auth provider
  useEffect(() => {
    const stored = getAuthUser();
    if (stored) {
      setAuthUser(stored);
      setAuthToken(stored.sessionJwt);
    }
  }, []);

  // Fetch leaderboard when target board size changes
  // useEffect(() => {
  //   getLeaderboard(leaderboardSize)
  //     .then(setLeaderboard)
  //     .catch((err) => console.error("Failed to fetch leaderboard:", err));
  // }, [leaderboardSize]);

  // const handleStartGame = (size: number) => {
  //   setBoardSize(size);
  //   setCurrentView("game");
  // };

  const handleAuthSuccess = (user: AuthUser) => {
    setAuthUser(user);
    saveAuthUser(user);
    setAuthToken(user.sessionJwt);
  };

  const handleLogout = () => {
    setAuthUser(null);
    clearAuth();
    setAuthToken(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Wedding Maze</h1>
        <p>Prepare for the big day and walk the aisle in these mazes!</p>

        {authUser ? (
          <div className="user-info">
            <span>Welcome, {authUser.name}!</span>
            <button
              className="btn btn-secondary btn-small"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="user-info">
            <button
              className="btn btn-primary btn-small"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {currentView === "home" ? (
          <div className="game-container">
            <HomeScreen
              currentView={currentView} 
              setCurrentView={setCurrentView}
            />
          </div>
        ) : (
          <MazeGame/>
        )}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        elapsedTime={0}
        // elapsedTime?: number; // Made optional
      />
    </div>
  );
};

export default App;