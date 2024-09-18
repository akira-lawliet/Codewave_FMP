"use client";

import VideoFeed from "@/components/VideoFeed";
import OverlayElements from "@/components/OverlayElements";
import { useState } from "react";

export default function Game() {
  const [overlayOff, setOverlayOff] = useState(false);

  return (
    <>
      {!overlayOff && <div className="flex justify-center">center</div>}
      {overlayOff && (
        <div className="relative h-screen w-full">
          <VideoFeed />
          <OverlayElements />
          <div className="absolute"></div>
        </div>
      )}
    </>
  );
}
