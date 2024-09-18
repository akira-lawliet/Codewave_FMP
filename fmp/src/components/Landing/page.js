import Link from "next/link";

export default function Landing() {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Posture Maniac</h1>
            <p className="py-6">
              Try matching the posture shown in the upcoming slide to test your
              fitness !!!
            </p>
            <Link href="/game">
              <button className="btn btn-primary">Play</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
