import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { Link, useParams } from "react-router-dom";
import { BiUserCheck } from "react-icons/bi";
import Verify from "~/assets/images/verify.svg";
import Tippy from "@tippyjs/react";
import Image from "./../../components/Image";
import Button from "~/components/Core/Button";
import Loader from "~/components/Core/Loader";
import WrapperAuth from "~/components/WrapperAuth";
import handleFollowFunc from "~/utils/handleFollow";
import { getFullName } from "~/utils/common";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { config } from "~/config";

import { useApolloProvider } from "~/context/ApolloContext";
import SuggestedList from "~/layouts/Sidebar/SuggestedList";

function Profile() {

  const params = useParams();
  const nickname = params.nickname;

  const { getProfile, getPublications, getCollectedPublications } = useApolloProvider();
  //combine user and loading state 
  const [profile, setProfile] = useState({ user: null, loading: true, myVideos:[], myCollections: [] });
  const [view, setView] = useState("videos");

  useEffect(() => {
    const fetchUser = async () => {
      // setProfile({ user:null, loading: true, myVideos:[] });
      const profiles = await getProfile(nickname);
      const user = profiles.data.profile;
      const publications = await getPublications(user.id);
      const myVideos = publications.data.publications.items;
      const collections = await getCollectedPublications(user.ownedBy);
      const myCollections = collections.data.publications.items;
      // console.log(profiles);
      // console.log(user);
      // console.log(publications);
      // console.log(myVideos);
      // console.log(myCollections);
      setProfile({ user, loading: false, myVideos, myCollections });
    }

    fetchUser();
  }, [nickname])


  const handleVideoPlay = (e) => {
    console.log("PLAY")
    e.target.play();
  };

  const handleVideoPause = (e) => {
    e.target.pause();
    e.target.currentTime = 0;
  };

  const handleFollow = async () => {
    // const isFollowed = await handleFollowFunc(user);
    // setUser((user) => ({ ...user, is_followed: isFollowed }));
  };

  if (profile.loading) {
    return <Loader />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.info}>
          <Image
            src={profile.user?.picture?.original?.url}
            width={116}
            height={116}
            className={styles.avatar}
          />
          <div className={styles.title_container}>
            <h2 className={styles.user_title}>
              {profile.user?.handle}
            </h2>
            <h4 className={styles.user_fullname}>{profile.user?.name}</h4>
            {/* {userRedux?.id !== profile.user?.id ? (
              <WrapperAuth>
                <div className={styles.button_container}>
                  {user.is_followed ? (
                    <div className={styles.followed_container}>
                      <Button outline large>
                        Messenges
                      </Button>
                      <Tippy content="Unfollow" placement="bottom">
                        <div className={styles.unfollow} onClick={handleFollow}>
                          <BiUserCheck />
                        </div>
                      </Tippy>
                    </div>
                  ) : (
                    <Button
                      large
                      className={styles.button_follow}
                      onClick={handleFollow}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              </WrapperAuth>
            ) : (
              <div className={styles.button_container}>
                <Button text leftIcon={<FaRegEdit />}>
                  Edit profile
                </Button>
              </div>
            )} */}
          </div>
        </div>
        <h2 className={styles.count_info}>
          <div className={styles.number_container}>
            <strong>{profile.user?.stats?.totalFollowing}</strong>
            <span>Followings</span>
          </div>
          <div className={styles.number_container}>
          <strong>{profile.user?.stats?.totalFollowers}</strong>
            <span>Followers</span>
          </div>
          <div className={styles.number_container}>
            <strong>{profile.user?.stats?.totalCollects}</strong>
            <span>Collects</span>
          </div>
        </h2>
        <h2 className={styles.bio}>{profile.user?.bio || "No bio yet."}</h2>
      </div>
      <div className={styles.list_video_wrapper}>
        <div className={styles.title_wrapper}>
          <p className={styles.title} style = {{textDecoration: view == "videos" ? "underline" : "none"}} onClick = {() => setView("videos")}>Videos</p>
          <p className={styles.title} style = {{textDecoration: view == "collected" ? "underline" : "none"}} onClick = {() => setView("collected")}>Collected</p>
          <p className={styles.title} style = {{textDecoration: view == "topFans" ? "underline" : "none"}} onClick = {() => setView("topFans")}> Top Fans</p>
          <p className={styles.title} style = {{textDecoration: view == "topArtists" ? "underline" : "none"}} onClick = {() => setView("topArtists")}> Top Artists</p>
        </div>
        <div className={styles.list_video_container}>
          <div className={styles.list_video}>
            { view == "videos" && (
            profile.myVideos && profile.myVideos.map((video) => (
                <div key={video.id} className={styles.video_container}>
                  <video
                    src= {video.metadata.media[0].original.url}
                    muted
                    loop
                    onMouseEnter={handleVideoPlay}
                    onMouseLeave={handleVideoPause}
                    poster = {video.metadata.media[0].original.url}
                  />
                  <div className={styles.video_desc}>
                    <p>{video.metadata.description}</p>
                  </div>
                </div>
            ))) }
            { view == "collected" && (
            profile.myCollections && profile.myCollections.map((video) => (
              <div key={video.id} className={styles.video_container}>
                <video
                  src= {video.metadata.media[0].original.url}
                  muted
                  loop
                  onMouseEnter={handleVideoPlay}
                  onMouseLeave={handleVideoPause}
                  poster = {video.metadata.media[0].original.url}
                />
                <div className={styles.video_desc}>
                  <p>{video.metadata.description}</p>
                </div>
              </div>
          )))
        }
        {
          view == "topFans" && (
            <SuggestedList/>
          )
        }
                {
          view == "topArtists " && (
            <SuggestedList/>
          )
        }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
