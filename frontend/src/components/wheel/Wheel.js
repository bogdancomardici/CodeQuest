import React from "react";
import WheelComponent from "./WheelComponent";

function Wheel({ segments, segColors, onFinished }) {
  return (
    <div id="wheelCircle">
      <WheelComponent
        segments={segments}
        segColors={segColors}
        winningSegment=""
        onFinished={onFinished}
        primaryColor="black"
        primaryColoraround="#ffffffb4"
        contrastColor="white"
        buttonText="Spin"
        isOnlyOnce={false}
        size={190}
        upDuration={50}
        downDuration={2000}
      />
    </div>
  );
}

export default Wheel;
