"use client";

import VideoFeed from "@/components/VideoFeed";
import RefPhoto from "@/components/RefPhoto";
import { useState, useEffect, useRef } from "react";
import Timer from "@/components/Timer";
import { referencePoses } from "@/utils/angles";
import { randomInt } from "mathjs";

export default function Game() {
  const [overlayOff, setOverlayOff] = useState(false);
  const [count, setCount] = useState(3);
  const [timer, setTimer] = useState(false);

  const [reloadRef, setReloadRef] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);

  const [firstTime, setFirstTime] = useState(true);

  // loading, correct, incorrect, missing
  const [poseState, setPoseState] = useState("loading");
  const previousPoseIndex = useRef(0);
  const targetPoseIndex = useRef(0);
  
  const [score, setScore] = useState(0);
  const scoreTimer = useRef(undefined);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setOverlayOff(true);
    }

    if (reloadRef) {
      console.log("Resetting ref");
      setResetSignal(true);
      setFirstTime(false);
      setReloadRef(false);

      targetPoseIndex.current = (previousPoseIndex.current + randomInt(1, referencePoses.length - 1)) % referencePoses.length;
      previousPoseIndex.current = targetPoseIndex.current;

      clearInterval(scoreTimer.current);
      setPoseState("incorrect");
    }
  }, [count, reloadRef]);

  useEffect(() => {
    if (poseState === "correct") {
      scoreTimer.current = setInterval(() => {
        setScore((score) => score + 1);
      }, 1000);
    } else {
      clearInterval(scoreTimer.current);
    }
  }, [poseState])

  return (
    <>
      {!overlayOff && (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-7xl">{count}</h1>
        </div>
      )}
      {overlayOff && (
        <div className="relative h-screen w-full">
          <VideoFeed setPoseState={setPoseState} targetIndex={targetPoseIndex} />
          <RefPhoto
            startTimer={setTimer}
            src={`/poses/${referencePoses[targetPoseIndex.current].name}.jpg`}
            resetSignal={resetSignal}
            setResetSignal={setResetSignal}
          />
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white text-2xl bg-black p-2 rounded">
            Score: {score}
          </div>
          <div className="absolute"></div>
        </div>
      )}
      {overlayOff && timer && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white bg-transparent p-6 rounded-lg w-40 h-40 flex items-center justify-center">
          <div className="text-4xl">
            <Timer reloadRef={setReloadRef} timerValue={firstTime ? 20 : 15} correctPose={poseState === "correct"} />
          </div>
        </div>
      )}
    </>
  );
}
