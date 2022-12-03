import {
  FaAutoprefixer,
  FaQuestion,
  FaRegKeyboard,
  FaRegUser,
  FaBitcoin,
  FaRegSun,
  FaSignOutAlt,
  FaCode,
  FaRegPaperPlane,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaBell,
  FaBellSlash,
} from "react-icons/fa";
import React from "react";
import languages from "./languages";

export const MENU_ITEMS_1 = [
  {
    title: "English",
    icon: <FaAutoprefixer />,
    children: {
      title: "Language",
      data: languages,
    },
  },
  { title: "Feedback and help", icon: <FaQuestion /> },
  { title: "Keyboard shortcuts", icon: <FaRegKeyboard /> },
];

export const MENU_ITEMS_2 = [
  { title: "View profile", icon: <FaRegUser />, type: "toProfile" },
  { title: "Disconnect Wallet", icon: <FaSignOutAlt />, type: "logout" },
  {title: "Opt in for Notifications", icon: <FaBell />, type: "optIn"},
  {title: "Opt out of Notifications", icon: <FaBellSlash />, type: "optOut"},
];

export const MENU_ITEMS_SHARE = [
  { title: "Embed", icon: <FaCode /> },
  { title: "Send to friends", icon: <FaRegPaperPlane /> },
  { title: "Share to Facebook", icon: <FaFacebook /> },
  { title: "Share to Instagram", icon: <FaInstagram /> },
  { title: "Copy link", icon: <FaLink /> },
];
