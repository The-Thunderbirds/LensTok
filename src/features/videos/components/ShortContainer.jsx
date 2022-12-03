import React, { useState, useEffect, useRef } from "react";
import Short from "./Short";
import Loader from "~/components/Core/Loader";

import { useApolloProvider } from "~/context/ApolloContext";

function ShortContainer() {
  const shortContainerRef = useRef();

  const { explorePublications } = useApolloProvider();

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  async function fetchPublications() {
    setLoading(true);
    let response = await explorePublications();
    let items = response.data.explorePublications.items;
    setPublications(items);
    setLoading(false);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <section ref={shortContainerRef} className="short-container">
        {publications.length != 0 &&
          publications.map((short) => (
            <Short
              key={short.id}
              shortContainerRef={shortContainerRef}
              short={short}
            />
          ))
        }
      </section>

      <div className="navigation-container">
        <div
          onClick={() => {
            shortContainerRef.current.scrollTo(
              0,
              shortContainerRef.current.scrollTop - window.innerHeight
            );
          }}
          className="nav-up"
        >
          <ion-icon name="arrow-up-outline"></ion-icon>
        </div>
        <div
          onClick={() => {
            shortContainerRef.current.scrollTo(
              0,
              shortContainerRef.current.scrollTop + window.innerHeight
            );
          }}
          className="nav-down"
        >
          <ion-icon name="arrow-down-outline"></ion-icon>
        </div>
      </div>
    </>
  );
}

export default ShortContainer;
