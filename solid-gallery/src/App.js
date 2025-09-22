import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthForm from "./components/AuthForm";
import Gallery from "./components/Gallery";

function App() {
  const { token, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold">📸 My Gallery</h1>
        {token && (
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </header>

      <main className="p-6">
        {token ? <Gallery /> : <AuthForm />}
      </main>
    </div>
  );
}

export default App;
