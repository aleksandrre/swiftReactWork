import React, { useState, useRef, useCallback } from "react";
import useImageSearch from "../useImageSearch";
import "../App.css";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
export default function Home() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const {
    images,
    hasMore,
    loading,
    error,
    closeModal,
    openModal,
    selectedImage,
  } = useImageSearch(query, pageNumber);
  const observer = useRef();
  const lastImageElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className="container">
      <Navbar />

      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search image ..."
      ></input>
      <div className="image-container">
        {images?.map((image, index) => (
          <div
            key={index}
            ref={index === images.length - 1 ? lastImageElementRef : null}
          >
            <img
              src={image.url}
              alt={`Result ${index + 1}`}
              onClick={() => openModal(image)}
            />
          </div>
        ))}
      </div>
      <div className="loading">{loading && "Loading..."}</div>
      <div className="error">{error && "Error"}</div>
      {selectedImage && (
        <Modal image={selectedImage} onClose={() => closeModal()} />
      )}
    </div>
  );
}
