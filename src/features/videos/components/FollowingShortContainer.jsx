import React, { useState, useEffect, useRef } from "react";
import Short from "./Short";

import { useApolloProvider } from "~/context/ApolloContext";

function FollowingShortContainer() {
  const shortContainerRef = useRef();

  const { getFeed, apolloContext } = useApolloProvider();
  const { profiles, currentProfile } = apolloContext;

  const [publications, setPublications] = useState([]);

  useEffect(() => {
    fetchPublications();
  }, []);

  async function fetchPublications() {
    let response = await getFeed(profiles[currentProfile].id);
    setPublications(response.items);
  }

  return (
    <>
      <section ref={shortContainerRef} className="short-container">
        {publications.length != 0 &&
          publications.map((short) => (
            <Short
              key={short.root.id}
              shortContainerRef={shortContainerRef}
              short={short.root}
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

export default FollowingShortContainer;
