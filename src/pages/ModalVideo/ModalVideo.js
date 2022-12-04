import React, { memo } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./ModalVideo.module.scss";
import Lenstok from "~/assets/images/lenstok-green.png";
import { useLocation, useNavigate } from "react-router-dom";
import Image from "~/components/Image";
import VideoDetail from "~/features/videos/components/VideoDetail";
import CustomModal from "~/components/CustomModal";
import { redirectModal } from "~/utils/common";

function ModalVideo() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <CustomModal fullScreen>
      <VideoDetail data={location.state?.video} />
      <div
        className={styles.close_button}
        onClick={() => redirectModal(location, navigate)}
      >
        <IoClose />
      </div>
      <div
        className={styles.home_button}
        onClick={() => redirectModal(location, navigate)}
      >
        <Image src={Lenstok} />
      </div>
    </CustomModal>
  );
}

export default memo(ModalVideo);
