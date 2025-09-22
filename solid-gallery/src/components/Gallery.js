import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function Gallery() {
  const { token } = useContext(AuthContext);
  const [saved, setSaved] = useState([]);
  const [url, setUrl] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Fetch user’s gallery
  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}/gallery`, { headers: { Authorization: token } })
        .then((res) => setSaved(res.data.images));
    }
  }, [token]);

  const saveImage = (img) => {
    axios
      .post(`${API_URL}/gallery`, { image: img }, { headers: { Authorization: token } })
      .then((res) => setSaved(res.data.images));
  };

  const removeImage = (id) => {
    axios
      .delete(`${API_URL}/gallery/${id}`, { headers: { Authorization: token } })
      .then((res) => setSaved(res.data.images));
  };

  const addImageFromUrl = () => {
    if (!url) return;
    const newImg = { id: Date.now().toString(), src: url, title: "User Added" };
    saveImage(newImg);
    setUrl("");
  };

  return (
    <div>
      {/* Input Field */}
      <h2 className="text-2xl font-bold mb-4">Add Your Own Image</h2>
      <div className="flex gap-2 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addImageFromUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Saved Gallery */}
      <h2 className="text-2xl font-bold mt-8 mb-4">My Saved Gallery</h2>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {saved.map((img, i) => (
          <div key={img.id} className="relative cursor-pointer">
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-40 object-cover rounded-lg shadow hover:scale-105 transition-transform"
              onClick={() => setLightboxIndex(i)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage(img.id);
              }}
              className="absolute top-2 right-2 px-3 py-1 rounded bg-red-500 text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={saved.map((img) => ({ src: img.src }))}
        />
      )}
    </div>
  );
}
