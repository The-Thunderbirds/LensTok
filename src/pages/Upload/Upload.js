import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "~/components/Core/Button";
import { UploadIcon } from "~/components/Icons";
import styles from "./Upload.module.scss";
import { v4 as uuidv4 } from "uuid";
import { Web3Storage } from 'web3.storage'
import axios from "axios";
import Loader from "~/components/Core/Loader";
import Livepeer from "~/assets/images/Livepeer.svg"
import IPFS from "~/assets/images/ipfs.png"
import lens from "~/assets/images/lens.svg"
import Push from "~/assets/images/Bell.svg"

import { useApolloProvider } from "~/context/ApolloContext";

import { sendNotificationToAll } from "~/utils/pushNotifications"

function Upload() {
  const { apolloContext, createPostTypedData, postWithSig } = useApolloProvider();
  const { profiles, currentProfile } = apolloContext;
  
  const [lpLoading, setLpLoading] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [name, setName] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [description, setDescription] = useState("");
  const { register, handleSubmit } = useForm();
  const [ipfsLoading, setIpfsLoading] = useState(false);
  const [lensLoading, setLensLoading] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  const handleFile = (e) => {
    setLpLoading(true);
    const src = URL.createObjectURL(e.target.files[0]);
    setFilePreview(src);
    setFile(e.target.files[0]);
    const video_file = e.target.files[0];
    
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(video_file);
    
    reader.onloadend = async () => {
      let videoData = Buffer.from(reader.result);
      let instance = axios.create({
				baseURL: "https://livepeer.com/api/",
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_LIVEPEER_API_KEY}`,
				},
			});
      
      let response = await instance.post("asset/request-upload", {
				name: video_file.name,
			});
      let taskResponse;
      let assetId = response.data.asset.id;
      let taskId = response.data.task.id;
      console.log("Done URL generation");
      console.log(response);

      let uploadResponse = await axios({
				method: "put",
				url: response.data.url,
				data: videoData,
				headers: { "Content-Type": "video/mp4" },
			});

      console.log("Done Video Upload");
      console.log(uploadResponse);

      while(true){
        let taskResponse = await instance.get(
          `https://livepeer.com/api/task/${taskId}`
        );
        if(taskResponse.data.status.phase == "completed") break;
      }

      let ipfsExportResponse = await instance.post(
        `/asset/${assetId}/export`,
        {
          ipfs: {},
        }
      );
      
      taskId = ipfsExportResponse.data.task.id;
      while(true){
        taskResponse = await instance.get(
          `https://livepeer.com/api/task/${taskId}`
        );
        if(taskResponse.data.status.phase == "completed") break;
      }
      
      let result = taskResponse.data.output.export.ipfs;
      console.log(result.videoFileGatewayUrl);
      setVideoURL(result.videoFileGatewayUrl);

      setLpLoading(false);
    }
  };

  const handleUploadVideo = async () => {
    await handlePost();    

    setPushLoading(true);
    const title = "New Video : " + name;
    const body = "Checkout the new video!"
    await sendNotificationToAll(title, body);
    setPushLoading(false);
    window.alert("Upload has been completed succesfully");
  };

  const submitForm = (data) => {
    handleUploadVideo();
  };

  const handlePost = async () => {
    
    setIpfsLoading(true);
    const files = makeFileObjects();
    const ipfsResult = await storeFiles(files);
    console.log(ipfsResult);
    setIpfsLoading(false);

    setLensLoading(true);
    const createPostRequest = {
      profileId: profiles[currentProfile].id,
      contentURI: `https://${ipfsResult}.ipfs.w3s.link/metadata.json`,
      // contentURI: `ipfs://${ipfsResult}`,
      collectModule: {
        freeCollectModule: {
          followerOnly: true,
        },
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };


    const result = await createPostTypedData(createPostRequest);

    console.log(result);

    await postWithSig(result.data.createPostTypedData.typedData);
    setLensLoading(false);
  }

  function makeFileObjects() {
    let pubMetadata = {
      version: "1.0.0",
      metadata_id: uuidv4(),
      description: description,
      external_url: videoURL,
      name: name,
      attributes: [
        {
          displayType: "string",
          traitType: "Title",
          value: name,
        },
      ],
      media: [
        {
          item: videoURL,
          type: "video/mp4",
        },
      ],
      animation_url: videoURL,
      appId: "lenstokV2",
    };

    const blob = new Blob([JSON.stringify(pubMetadata)], { type: 'application/json' })
  
    const files = [
      new File([blob], "metadata.json")
    ]
    console.log(files);
    return files
  }

  async function storeFiles (files) {
    const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE })
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return cid
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className={styles.upload_wrapper}>
      <div className={styles.upload_container}>
        <span className={styles.upload_title}>Upload video</span>
        <div className={styles.upload_sub_title}>
          <span>Post a video to your account</span>
        </div>
        <div className={styles.upload_content}>
          <div
            className={
              file ? `${styles.preview}` : `${styles.upload_content_left}`
            }
          >
            <label htmlFor="upload_file">
              <div className={styles.upload_state}>
                {file ? (
                  <div className={styles.preview_v2}>
                    <video
                      className={styles.video_preview}
                      src={filePreview}
                      autoPlay
                      preload="auto"
                      playsInline=""
                      crossOrigin="anonymous"
                      loop
                      type="video/*"
                      controls
                    ></video>
                    <div className={styles.phone_preview}></div>
                  </div>
                ) : (
                  <>
                    <UploadIcon />
                    <span className={styles.upload_state_title}>
                      Select video to upload
                    </span>
                    <span className={styles.upload_state_sub_title}>
                      Or drag and drop a file
                    </span>
                    <span className={styles.upload_state_notice}>
                      MP4 or WebM
                    </span>
                    <span className={styles.upload_state_notice}>
                      720x1280 resolution or higher
                    </span>
                    <span className={styles.upload_state_notice}>
                      Up to 1 minute
                    </span>
                    <span className={styles.upload_state_notice}>
                      Less than 2 GB
                    </span>
                    <Button primary noAction className={styles.select_file}>
                      Select File
                    </Button>
                  </>
                )}
              </div>
            </label>
            <input
              onChange={handleFile}
              name="upload_file"
              id="upload_file"
              required
              type="file"
              accept="video/*"
            />
          </div>
          <div className={styles.upload_content_right}>
            <div className={styles.form_item}>
              <div className={styles.form_header}>
                <span className={styles.form_label}>Name</span>
                <span className={styles.form_count}>
                  {name.length} / 20
                </span>
              </div>
              <div className={styles.form_footer}>
                <input
                  maxLength={20}
                  name="name"
                  id="description"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.form_input}
                />
              </div>
            </div>
            <div className={styles.form_item}>
              <div className={styles.form_header}>
                <span className={styles.form_label}>Description</span>
                <span className={styles.form_count}>
                  {description.length} / 150
                </span>
              </div>
              <div className={styles.form_footer}>
                <textarea
                  maxLength={150}
                  name="description"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.form_textarea}
                />
              </div>
            </div>
            <div className={styles.form_item}>
              <div className={styles.form_header}>
                <span className={styles.form_label}>
                  Who can watch this video
                </span>
              </div>
              <div className={styles.form_footer}>
                <select
                  className={styles.form_select}
                  name="viewable"
                  id="viewable"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
            <div className={styles.button_container}>
              <Button text className={styles.discard}>
                Discard
              </Button>
              <Button
                primary
                disabled={!file || lpLoading || ipfsLoading || lensLoading || pushLoading}
                className={styles.post}
                type="submit"
                rightIcon = 
                  {lpLoading ? 
                    <img src={Livepeer} style={{width:"32px", paddingLeft:"5px"}}/>
                    : 
                    ipfsLoading ?
                    <img src={IPFS} style={{width:"32px", paddingLeft:"5px"}}/>
                    :
                    lensLoading ?
                    <img src={lens} style={{width:"32px", paddingLeft:"5px"}}/>
                    :
                    pushLoading ?
                    <img src={Push} style={{width:"32px", paddingLeft:"5px"}}/>
                    : <></>
                  }>
                {lpLoading ? 
                <>
                Uploading on
                </>
                : 
                ipfsLoading ?
                <>
                Uploading on 
                </>
                :
                lensLoading ?
                <>
                Uploading on 
                </>
                :
                pushLoading ?
                <>
                Notifying via 
                </>
                :
                "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Upload;
