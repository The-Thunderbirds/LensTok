import React, { useEffect, useState } from "react";
import { huddleIframeApp, HuddleIframe } from "@huddle01/huddle01-iframe";

function Register() {
  let roomId = "harsha-room";
  const iframeConfig = {
    roomUrl: `https://iframe.huddle01.com/${roomId}`,
    height: "800px",
    width: "100%",
    noBorder: true
  };

  useEffect(() => {
    // huddleIframeApp.methods.connectWallet(walletAddress)
    huddleIframeApp.on("peer-join", (data) =>
      console.log({ iframeData: data })
    );
    huddleIframeApp.on("peer-left", (data) =>
      console.log({ iframeData: data })
    );
  }, []);
  
  return (    
    <div>
      <HuddleIframe config={iframeConfig} />
    </div>
  );
}

export default Register;