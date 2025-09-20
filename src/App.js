import React from "react";
import Gallery from "./components/Gallery";

function App() {
  return (
    <div>
      {/* Header */}
      <header className="p-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">My React Gallery</h1>
        <p className="text-sm opacity-90 mt-1">Built with React + Tailwind CSS</p>
      </header>

      {/* Gallery */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        <Gallery />
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} My Gallery
      </footer>
    </div>
  );
}

export default App;
