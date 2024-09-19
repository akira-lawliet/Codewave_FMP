import React, { useState, useEffect, useCallback } from "react";

export default function RefPhoto({
  startTimer,
  src,
  resetSignal,
  setResetSignal,
}) {
  const [isCenter, setIsCenter] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  const startAnimation = useCallback(() => {
    const timer = setTimeout(() => {
      setIsCenter(false);
      startTimer(true);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [startTimer]);

  // Effect for handling resets
  useEffect(() => {
    if (resetSignal) {
      setIsCenter(true);
      setCurrentSrc(src);
      startTimer(false);
      setResetSignal(false);
    }
  }, [resetSignal, src, startTimer]);

  // Effect for handling animation
  useEffect(() => {
    if (isCenter) {
      return startAnimation();
    }
  }, [isCenter, startAnimation]);

  return (
    <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center overflow-hidden">
      <div
        className="transition-all duration-1000 ease-in-out"
        style={{
          transform: isCenter
            ? "translateX(0) scale(1.5)"
            : "translateX(calc(50vw - 50%)) scale(1)",
          width: isCenter ? "350px" : "250px",
        }}
      >
        <img src={currentSrc} alt="placeholder" className="w-full h-auto" />
      </div>
    </div>
  );
}
