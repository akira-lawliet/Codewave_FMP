"use client";

import VideoFeed from "@/components/VideoFeed";
import RefPhoto from "@/components/RefPhoto";
import { useState, useEffect } from "react";
import Timer from "@/components/Timer";

export default function Game() {
  const [overlayOff, setOverlayOff] = useState(false);
  const [count, setCount] = useState(3);
  const [timer, setTimer] = useState(false);

  const [reloadRef, setReloadRef] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);

  const [firstTime, setFirstTime] = useState(true);

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
    }
  }, [count, reloadRef]);

  return (
    <>
      {!overlayOff && (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-7xl">{count}</h1>
        </div>
      )}
      {overlayOff && (
        <div className="relative h-screen w-full">
          <VideoFeed />
          <RefPhoto
            startTimer={setTimer}
            src={`https://cdn.pixabay.com/photo/2024/08/24/05/02/woman-8993222_1280.jpg`}
            resetSignal={resetSignal}
            setResetSignal={setResetSignal}
          />
          <div className="absolute"></div>
        </div>
      )}
      {overlayOff && timer && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white bg-transparent p-6 rounded-lg w-40 h-40 flex items-center justify-center">
          <div className="text-4xl">
            <Timer reloadRef={setReloadRef} timerValue={firstTime ? 10 : 5} />
          </div>
        </div>
      )}
    </>
  );
}
