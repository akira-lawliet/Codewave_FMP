"use client";

import React from "react";
import { CircularProgress } from "@nextui-org/react";

export default function App() {
  const [value, setValue] = React.useState(30);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v <= 0 ? 0 : v - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progressColor =
    value > 10 ? "success" : value <= 5 ? "danger" : "warning";

  return (
    <CircularProgress
      aria-label="Loading..."
      size="lg"
      value={(value / 30) * 100}
      color={progressColor}
      showValueLabel={true}
      valueLabel={`${value}s`}
    />
  );
}
