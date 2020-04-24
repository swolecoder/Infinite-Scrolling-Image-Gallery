import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const getPhotos = useCallback(() => {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${accessKey}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const imagesFromApi = data.results ?? data;

        // if page is 1, then we need a whole new array of images
        if (page === 1) setImages(imagesFromApi);

        // if page > 1, then we are adding for our infinite scroll
        setImages((images) => [...images, ...imagesFromApi]);
      });
  }, [page, query]);

  useEffect(() => {
    getPhotos();
  }, [page, getPhotos]);

  function searchPhotos(e) {
    e.preventDefault();
    setPage(1);
    getPhotos();
  }

  if (!accessKey) {
    return (
      <a className="error" href="">
        Required get an unsplash API key
      </a>
    );
  }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form onSubmit={searchPhotos}>
        <input
          type="text"
          placeholder="Search Unsplash..."
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
        />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={images.length} //This is important field to render the next data
        next={() => {
          setPage((page) => page + 1);
        }}
        hasMore={true}
      >
        <div className="image-grid">
          {images.map((image, index) => (
            <div className="image" key={index}>
              <img src={image.urls.regular} alt="Sample" />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
