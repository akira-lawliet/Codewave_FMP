import RefPhoto from "./RefPhoto";

export default function OverlayElements() {
  return (
    <>
      <div className="absolute w-full h-full top-0 left-0 items-center justify-end flex flex-row">
        <RefPhoto />
      </div>
    </>
  );
}
