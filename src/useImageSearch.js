import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "./contexts/AppContext";

const apiUrl1 = "https://api.unsplash.com/photos/";
const apiUrl2 = "https://api.unsplash.com/search/photos/";
let cancel;

const apiKey = "euOpWhVsn6-tTtaxVyuQtBHKk2pNESr1xTLmYjQbO0I";
export default function useImageSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { updateGlobalState, cache, setCache } = useAppContext();

  // console.log(cache); //ვნახოთ ინახება თუ არა ქეში ისტროიაზე გადასვლისას
  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    console.log("useefect 1 ");
    setImages([]);
  }, [query]);

  useEffect(() => {
    console.log("useefect2");

    setLoading(true);
    setError(false);

    axios({
      method: "GET",
      url: apiUrl1,
      params: {
        page: pageNumber,
        per_page: 20,
        order_by: "popular",
        client_id: apiKey,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        // console.log(res.data);
        setImages((prevImages) => {
          return [
            ...new Set([
              ...prevImages,
              ...res.data.map((b) => ({
                url: b.urls.full,
                created_at: b.created_at,
                description: b.description,
                likes: b.likes,
              })),
            ]),
          ];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, []);

  useEffect(() => {
    console.log("useEffect 3");

    setLoading(true);
    setError(false);

    if (cache[`${query}-${pageNumber}`]) {
      console.log("info comes from cache");
      setImages(cache[`${query}-${pageNumber}`]);
      setHasMore(true);
      setLoading(false);
      return;
    }

    axios({
      method: "GET",
      url: apiUrl2,
      params: {
        query: query,
        page: pageNumber,
        per_page: 20,
        client_id: apiKey,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.total && !cancel()) {
          setCache((prevCache) => ({
            ...prevCache,
            [`${query}-${pageNumber}`]: [
              ...(prevCache[`${query}-${pageNumber}`] || []),
              ...res.data.results.map((b) => ({
                url: b.urls.full,
                created_at: b.created_at,
                description: b.description,
                likes: b.likes,
              })),
            ],
          }));

          setImages((prevImages) => [
            ...new Set([
              ...prevImages,
              ...res.data.results.map((b) => ({
                url: b.urls.full,
                created_at: b.created_at,
                description: b.description,
                likes: b.likes,
              })),
            ]),
          ]);

          updateGlobalState(query);
        }

        setHasMore(res.data.results.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        // console.log(e);
        if (axios.isCancel(e)) return;

        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return {
    loading,
    error,
    images,
    hasMore,
    openModal,
    closeModal,
    selectedImage,
  };
}
