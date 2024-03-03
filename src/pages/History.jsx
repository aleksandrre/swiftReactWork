import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useAppContext } from "../contexts/AppContext";
import useImageSearch from "../useImageSearch";
import Modal from "../components/Modal";

const History = () => {
  const { globalState } = useAppContext();
  const [selectedWord, setSelectedWord] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const {
    images,
    hasMore,
    loading,
    error,
    closeModal,
    openModal,
    selectedImage,
  } = useImageSearch(selectedWord, pageNumber);

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

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setPageNumber(1);
  };

  return (
    <div className="container">
      <Navbar />

      <div className="history-container">
        <h2>History Words:</h2>
        <ul>
          {globalState.map((word, index) => (
            <li key={word} onClick={() => handleWordClick(word)}>
              {word}
            </li>
          ))}
        </ul>
      </div>

      <h2>Search Results:</h2>
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
        <div>{loading && "Loading..."}</div>
        <div>{error && "Error"}</div>
      </div>
      {selectedImage && (
        <Modal image={selectedImage} onClose={() => closeModal()} />
      )}
    </div>
  );
};

export default History;
