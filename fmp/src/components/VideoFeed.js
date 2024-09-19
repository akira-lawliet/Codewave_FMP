"use client";

import React, { useRef, useEffect, useState } from "react";
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import { getJointAngles, compareAngles, referencePoses } from "@/utils/angles";

const VideoFeed = ({setPoseState, targetIndex}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  let targetIndexLocal = 0;

  useEffect(() => {
    targetIndexLocal = targetIndex;
  }, [targetIndex]);

  useEffect(() => {
    let poseLandmarker;

    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam)
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    }
    setupWebcam();

    async function createPoseLandmarker() {
      const vision = await FilesetResolver.forVisionTasks("/wasm");
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `pose_landmarker_full.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
      });
    };
    createPoseLandmarker();

    /**
     * @type CanvasRenderingContext2D
     */
    const canvasCtx = canvasRef.current.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);

    let lastVideoTime = -1;
    async function predictWebcam() {
      // Now let's start detecting the stream.
      let startTimeMs = performance.now();
      if (lastVideoTime !== videoRef.current.currentTime && poseLandmarker) {
        lastVideoTime = videoRef.current.currentTime;
        poseLandmarker.detectForVideo(videoRef.current, startTimeMs, (result) => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          if (result.landmarks[0]) {
            const landmarks2DArray = result.landmarks[0].map(lm => [lm.x, lm.y]);
            const angles = getJointAngles(landmarks2DArray);

            // Tree pose
            // const target = {'left_elbow': 35.74408394883494, 'right_elbow': 45.536756987728644, 'left_knee': 173.47988629075044, 'right_knee': 24.562023028529563, 'left_shoulder': 54.48837511755496, 'right_shoulder': 29.301382414367808}

            const score = compareAngles(angles, referencePoses[targetIndexLocal.current].angles);

            if (score <= 95) {
              // console.log("Milyo");
              setPoseState("correct");
            } else {
              // console.log("Milena - " + score)
              setPoseState("incorrect");
            }
          }
          else {
            // console.log("Milena - khai manche");
            setPoseState("missing");
          }

          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
          }
          canvasCtx.restore();
        });
      } else {
        if (!poseLandmarker) {
          canvasCtx.fillText("loading", 0, 100);
        }
      }

      window.requestAnimationFrame(predictWebcam);
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      <canvas ref={canvasRef} width="1280" height="720" className="absolute w-full h-full left-0 top-0"></canvas>
    </div>
  );
};

export default VideoFeed;
