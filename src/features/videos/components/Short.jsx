import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { useWalletProvider } from "~/context/WalletProvider";
import { useApolloProvider } from "~/context/ApolloContext";
import Button from "~/components/Core/Button";
import Modal from "~/components/Modal";
import {ModalBody, ModalFooter, ModalHeader} from '~/components/Modal/Modal';
import { WorldIDWidget } from "@worldcoin/id";
import styles from "./Short.module.scss";
import lens from "~/assets/images/lens.svg"

import { sendNotificationToOne } from "~/utils/pushNotifications"

function Short({ short, shortContainerRef }) {

  const { account, isLoggedIn } = useWalletProvider();
  const { 
    createFollowTypedData, 
    followWithSig, 
    doesFollow, 
    createCollectTypedData,
    collectWithSig,
    login
  } = useApolloProvider();

  const playPauseRef = useRef();
  const videoRef = useRef();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [followedByMe, setFollowedByMe] = useState(false);

  const [wcVerified, setWcVerified] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const video = short.metadata.media[0].original.url;
    setVideoUrl(video);

    shortContainerRef.current.addEventListener("scroll", handleVideo);
    if(videoRef.current !== null) {
    setIsPlaying(!videoRef.current.paused);
    setIsMuted(videoRef.current.muted);
    window.addEventListener("blur", () => {
      if (isActiveVideo(videoRef)) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    });

    window.addEventListener("focus", () => {
      if (isActiveVideo(videoRef)) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    });
  }
  }, [shortContainerRef]);

  useEffect(() => {
    async function fetchFollowingDetails () {
      await login();
      await checkIsFollowing();
    }
    fetchFollowingDetails();
  }, [isLoggedIn]);

  async function handleVideo() {
    if(videoRef.current !== null) {
    const videoTop = videoRef.current.getBoundingClientRect().top;

    if (videoTop > 0 && videoTop <= 150) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        setIsPlaying(false);
        videoRef.current.pause();
      }
    } else {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }
  }

  async function follow() {
    const isFollowing = await checkIsFollowing();
    if(isFollowing) return;

    let followRequestInfo = {
      follow: [{ profile: short.profile.id, followModule: null }],
    };

    let response = await createFollowTypedData(followRequestInfo);
    let typedData = response.data.createFollowTypedData.typedData;
    await followWithSig(typedData);    
    setFollowedByMe(true);
  }

  async function checkIsFollowing() {
    let followInfo = [
      {
        followerAddress: account,
        profileId: short.profile.id,
      },
    ];
    let response = await doesFollow(followInfo);
    const following = response.data.doesFollow[0].follows;
    setFollowedByMe(following);
    // console.log(following);
    return following
  }

	async function collect() {
		let collectTypedDataRequest = {
			publicationId: short.id,
		};
		let response = await createCollectTypedData(collectTypedDataRequest);
    console.log(response.data);
		let typedData = response.data.createCollectTypedData.typedData;
		await collectWithSig(typedData);

    const title = short.metadata.name + " collected by " + account;
    const body = "Your video has been collected by World Coin Verified address: " + account;
    const address = short.profile.ownedBy;
    await sendNotificationToOne(title, body, address);
    window.alert("Video has been collected successfully");    
    window.location.reload();
	}

  function handleCollect(){
    setShowModal(true);
  }
  return (
    <div className="reel">
      <div>
        <Modal
          show={showModal}
          setShow={setShowModal}
          // hideCloseButton
        >
          <ModalHeader style = {{ marginLeft: "80px"}}>
            <h2>Collect Video as NFT</h2>
          </ModalHeader>
          <ModalBody >
            
            <div style = {{ marginLeft: "80px"}}>
          <WorldIDWidget
            actionId="wid_staging_a34231487061ca5d0213e57051c87f77" // obtain this from developer.worldcoin.org
            signal="my_signal"
            enableTelemetry
            onSuccess={(verificationResponse) => {              
              setWcVerified(true);
            }} // you'll actually want to pass the proof to the API or your smart contract
            onError={(error) => console.error(error)}
          />
          </div>
          { wcVerified &&
            <Button
              primary
              className={styles.post}
              type="submit"
              rightIcon=<img src={lens} style={{width:"32px", paddingLeft:"5px"}}/>
              onClick={()=>collect()}
            >
              Collect
            </Button>
          }
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
      <div className="reel-video">
        <div className="video">
          {/* <div className="video-con"> */}
          <video
            ref={videoRef}
            onClick={function (e) {
              if (videoRef.current !== null) {
                if (!isPlaying) {
                  videoRef.current.play();
                  setIsPlaying(true);
                } else {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              }
            }}
            disableRemotePlayback
            playsInline
            loop
            src={videoUrl}
          ></video>
          {/* </div> */}
          <div className="controls">
            <span
              onClick={() => {
                if (videoRef.current !== null) {
                  if (!isPlaying) {
                    videoRef.current.play();
                    setIsPlaying(true);
                  } else {
                    videoRef.current.pause();
                    setIsPlaying(false);
                  }
                }
              }}
            >
              <ion-icon
                name={`${isPlaying ? "pause" : "play"}-outline`}
              ></ion-icon>
            </span>
            <span
              onClick={() => {
                if (videoRef.current !== null) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
            >
              <ion-icon
                name={`volume-${isMuted ? "mute" : "medium"}-outline`}
              ></ion-icon>
            </span>
          </div>
          <div
            ref={playPauseRef}
            onClick={() => {
              if (videoRef.current !== null) {
                videoRef.current.play();
                setIsPlaying(true);
              }
            }}
            className={`play-pause ${isPlaying ? "" : "show-play-pause"}`}
          >
            <ion-icon name="play-outline"></ion-icon>
          </div>
          <div className="foot">
            <div className="title">{short?.metadata?.name}</div>
            <div className="description">{short?.metadata?.description}</div>
            <div className="user-info">
              <div>
                <Link to={"@" + short.profile.handle}>
                  <img src={short?.profile?.picture?.original?.url} alt="" />
                </Link>
                <span>
                  <div>
                    <Link to={"@" + short.profile.handle} className="title">
                      {short?.profile?.handle}
                    </Link>
                  </div>
                  <div className="follower-count">
                    {short?.profile?.stats?.totalFollowers} followers
                  </div>
                </span>
              </div>
              {followedByMe ? (
                <button>Following</button>
              ) : (
                <button onClick={follow}>Follow</button>
              )}
            </div>
          </div>
        </div>
        <div className="reaction">
          <div
            className=""
            onClick={() => {
              setIsLiked(!isLiked);
            }}
          >
            {isLiked ? (
              <span className="like">
                <ion-icon name="heart"></ion-icon>
              </span>
            ) : (
              <span className="unlike">
                <ion-icon name="heart-outline"></ion-icon>
              </span>
            )}
            {/* <span className="value">{short?.reaction?.likes}</span> */}
          </div>
          <div>
            <ion-icon name="chatbubble-outline"></ion-icon>
          </div>
          <div>
            <ion-icon name="layers-outline" onClick={handleCollect}></ion-icon>
          </div>
          <div>
            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
          </div>
        </div>
      </div>
    </div>
  );
}

function isActiveVideo(videoRef) {
  if(videoRef.current !== null) {
  const videoTop = videoRef.current.getBoundingClientRect().top;
  return videoTop > 0 && videoTop <= 150;
  }
  return false;
}

export default Short;