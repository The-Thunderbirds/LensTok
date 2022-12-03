import React from "react";
import styles from "./Menu.module.scss";
import { BsCameraVideo, BsPeople } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { config } from "~/config";
import WrapperAuth from "~/components/WrapperAuth";
import Tab from "./Tab";

import { useWalletProvider } from "~/context/WalletProvider"

function Menu() {
  const { isLoggedIn } = useWalletProvider();

  return (
    <nav className={styles.sidebar_tabs}>
      <Tab to={config.routes.home} Icon={FaHome}>
        For you
      </Tab>
      {
        isLoggedIn &&
        <Tab to={config.routes.following} Icon={BsPeople}>
          Following
        </Tab>
      }
      <Tab to={config.routes.live} Icon={BsCameraVideo}>
        Live
      </Tab>
    </nav>
  );
}

export default Menu;
