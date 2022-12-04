import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaRegPaperPlane,
  FaRegCommentAlt,
  FaPlus,
  FaRegMoon,
  FaUserEdit,
  FaWallet,
  FaRegUser,
  FaRegBell
} from "react-icons/fa";
import { BsSun } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import Logo from "~/assets/images/lenstok-green.png";
import LogoDark from "~/assets/images/lenstok-green.png";
import Bell from "~/assets/images/Bell.svg";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import Avatar from "~/assets/images/Avatar.jpeg";
import Button from "~/components/Core/Button";
import Menu from "~/components/Popper/Menu";
import Image from "~/components/Image";
import Search from "~/components/Search";
import styles from "./Navbar.module.scss";
import { MENU_ITEMS_1, MENU_ITEMS_2 } from "~/data/dataMenu";
import { config } from "~/config";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "~/features/authentication/userAction";
import { useNavigate } from "react-router-dom";
import WrapperAuth from "~/components/WrapperAuth";
import { useWalletProvider } from '../../context/WalletProvider';
import { useApolloProvider } from "~/context/ApolloContext"

import { subscribe, unsubscribe, fetch_notifications } from "~/utils/pushNotifications";

function Navbar() {

  const { apolloContext } = useApolloProvider();
  const { profiles, currentProfile } = apolloContext;
  const { smartAccountAddress, connect, disconnect, isLoggedIn, loading, walletProvider, account } = useWalletProvider();
  
  const [user, setUser] = useState();
  // const { user } = useSelector((state) => state.user);
  const [currUser, setCurrUser] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  const [messages, setMessages] = useState([]);
  // const messages = [
  //   {title: "Hi, WASSUP", icon: <FaRegUser />, type: "notif" },
  //   { title: "Yo, Man", icon: <FaRegUser />, type: "notif" },
  //   {title: "EthIndia is coool", icon: <FaRegUser />, type: "notif"},
  //   {title: "Someone do my DV assignment", icon: <FaRegUser />, type: "notif"},
  // ];
  const isLoginPage = location.pathname.includes("/login");

  useEffect(() => {
    if(profiles !== undefined && profiles.length !== 0) {
      setUser(profiles[currentProfile]);
      fetchAllNotifications();
    }  
  }, [profiles, currentProfile]);

  useEffect(() => {
    const element = document.body;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.removeItem("theme", "dark");
    }
  });

  const handleMenuChange = (menuItem) => {
    switch (menuItem.type) {
      case "logout":
        dispatch(disconnect());
        break;
      case "toProfile":
        navigate(config.routes.profileLink(user.handle));
        break;
      case "optIn":
        dispatch(subscribe(walletProvider, account));
        break;
      case "optOut":
        dispatch(unsubscribe(walletProvider, account));
        break;
      case "notif":
        console.log(menuItem)
        break;
      default:
        break;
    }
  };

  const fetchAllNotifications = async () => {
    const notifs = await fetch_notifications(account);    
    const newNotifs = [];

    notifs.map((notif) => {
      let newNotif = {
        title: notif.title,
        icon: <FaRegUser />,
        // icon: notif.icon,
        type: "notif"
      }
      newNotifs.push(newNotif);
    })

    console.log(newNotifs)

    setMessages(newNotifs);
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.navbar_wrapper}>
        <Link to={config.routes.home} className={styles.logo}>
          <img src={theme === "dark" ? LogoDark : Logo} alt="Lenstok" width="150px" style={{marginTop:"15px"}} />
        </Link>

        <Search />

      <div className={styles.navbar_right}> 
        {
          profiles == undefined || profiles.length == 0 && (
          <WrapperAuth>
              <Button
                className={styles.upload_icon}
                text
                leftIcon={<FaUserEdit/>}
                to={config.routes.login}
              >
                Create Profile
              </Button>
            </WrapperAuth>
          )  
        }
        {
          isLoggedIn && (
            <WrapperAuth>
            <Button
              className={styles.upload_icon}
              text
              leftIcon={<FaPlus />}
              to={config.routes.upload}
            >
              Upload
            </Button>
          </WrapperAuth>
          )
        }
          {!isLoggedIn && (
                    <Button className={styles.upload_icon} leftIcon={<FaWallet />}  onClick={connect}>
                    {isLoggedIn && smartAccountAddress
                      ? `${smartAccountAddress?.slice(0, 6)}...${smartAccountAddress?.slice(
                          -6
                        )}`
                      : loading
                      ? "Setting up..."
                      : "Connect Wallet"}
                  </Button>
              )
              }
          {theme === "dark" ? (
            <div
              className={styles.menu_action}
              onClick={() => setTheme("default")}
            >
              <BsSun />
            </div>
          ) : (
            <div
              className={styles.menu_action}
              onClick={() => setTheme("dark")}
            >
              <FaRegMoon />
            </div>
          )}

          { isLoggedIn && user &&(
            <>
              <Tippy content="Messages" placement="bottom" theme="gradient">
                <div className={styles.menu_action}>
                  <FaRegPaperPlane />
                </div>
              </Tippy>


              <Menu items={messages} onChange={handleMenuChange}>
              <div className={styles.menu_action}>
                <img src={Bell} alt="Push" width="35"/>
              </div>
              </Menu>

              <Menu items={MENU_ITEMS_2} onChange={handleMenuChange}>
                <Image
                  className={styles.dropdown_avatar}
                  src={user.picture.original.url}
                  alt="Avatar"
                />
              </Menu>
            </>
          )}

            <Menu items={MENU_ITEMS_1} onChange={handleMenuChange}>
              <div>
                <IoEllipsisVertical className={styles.dropdown_icon} />
              </div>
            </Menu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
