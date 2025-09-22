import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function AuthForm() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        await axios.post(`${API_URL}/signup`, { username, password });
        setIsSignup(false);
      } else {
        const res = await axios.post(`${API_URL}/login`, { username, password });
        login(res.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 border rounded-lg shadow mt-8">
      <h2 className="text-xl font-bold mb-4">{isSignup ? "Sign Up" : "Login"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="w-full mb-2 px-3 py-2 border rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 px-3 py-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded mb-2"
      >
        {isSignup ? "Sign Up" : "Login"}
      </button>
      <button
        className="w-full text-gray-600 underline"
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? "Already have an account? Login" : "Don’t have an account? Sign up"}
      </button>
    </div>
  );
}
