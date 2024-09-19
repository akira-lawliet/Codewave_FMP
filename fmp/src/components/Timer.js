"use client";

import React from "react";
import { CircularProgress } from "@nextui-org/react";

export default function Timer({ reloadRef, timerValue }) {
  const [value, setValue] = React.useState(timerValue);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => {
        if (v <= 0) {
          console.log("resetting value");
          reloadRef(true);
          return 0;
        }

        return v - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progressColor =
    value > 10 ? "success" : value <= 5 ? "danger" : "warning";

  return (
    <CircularProgress
      classNames={{
        svg: "w-36 h-36 drop-shadow-md",
        indicator: { progressColor },
        track: "stroke-white/10",
        value: "text-3xl font-semibold text-white",
      }}
      value={(value / timerValue) * 100}
      color={progressColor}
      strokeWidth={4}
      showValueLabel={true}
      valueLabel={`${value}s`}
    />
  );
}
