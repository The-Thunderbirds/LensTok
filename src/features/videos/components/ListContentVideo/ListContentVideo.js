import React, { memo, useEffect, useState } from "react";
import ShortContainer from "../ShortContainer";
import '../Short.css';
import FollowingShortContainer from "../FollowingShortContainer";

function ListContentVideo({ type }) {

  if(type === "for-you") {
    return (
      <div className="main">
        <ShortContainer/>
      </div>
    );  
  }
  else {
    return (
      <div className="main">
        <FollowingShortContainer/>
      </div>
    )
  }
}

export default ListContentVideo;
