import VideoFeed from "@/components/VideoFeed";
import OverlayElements from "@/components/OverlayElements";

export default function Game() {
  return (
    <>
      <div className="relative h-screen w-full">
        <VideoFeed />
        <OverlayElements />
        <div className="absolute"></div>
      </div>
    </>
  );
}
