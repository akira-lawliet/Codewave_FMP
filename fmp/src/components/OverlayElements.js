import RefPhoto from "./RefPhoto";

export default function OverlayElements() {
  return (
    <>
      <div className="absolute w-[300px] h-full top-0 -left-0 items-center">
        <RefPhoto />
      </div>
    </>
  );
}
