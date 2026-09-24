// src/services/api.ts
 
import type { UserStats, LeaderboardEntry} from "../utils/dataTypes";
// import { UserStats,  } from "../types";
import { getAuthUser } from "./auth";

// Ensure no trailing slash on base URL
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Local state to keep track of the JWT
let authToken: string | null = null;

// Sets or removes the auth token globally for this service
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Define getAuthToken using your existing auth module
export const getAuthToken = (): string | null => {
  const user = getAuthUser();
  return user ? user.sessionJwt : null;
};

// Internal helper to handle boilerplate fetch requests
const request = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers);

  // Dynamically inject the token if it exists
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  // Set Content-Type if we are sending a JSON payload
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// API Endpoints

// CHQ: Gemini AI added boardSize parameter
export const saveScore = async (
  result: "win" | "loss" | "draw",
  timeSeconds: number,
  boardSize: number = 3,
) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ result, timeSeconds, boardSize }),
  });

  if (!response.ok) throw new Error("Failed to save score");
  return response.json();
};

// CHQ: Gemini AI added boardSize to leaderboard 
export const getLeaderboard = async (boardSize: number = 3): Promise<LeaderboardEntry[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/leaderboard?boardSize=${boardSize}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return response.json();
};
export const getUserStats = async (userId: string): Promise<UserStats> => {
  return request(`/api/scores/user/${userId}`, { method: "GET" });
};

export const verifyAuth = async (sessionJwt: string): Promise<any> => {
  return request("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ sessionJwt }),
  });
};