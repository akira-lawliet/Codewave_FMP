import { subtract, dot, norm } from "mathjs";

const POSES = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28
};

const referencePoses = [
  {
    name: "goddess",
    angles: {'left_elbow': 98.48282942495615, 'right_elbow': 109.00554781168067, 'left_knee': 97.82803220103622, 'right_knee': 94.19778120991516, 'left_shoulder': 91.6122676415941, 'right_shoulder': 102.84186864175068}
  },
  {
    name: "tree",
    angles: {'left_elbow': 35.74408394883494, 'right_elbow': 45.536756987728644, 'left_knee': 173.47988629075044, 'right_knee': 24.562023028529563, 'left_shoulder': 54.48837511755496, 'right_shoulder': 29.301382414367808}
  },
  {
    name: "warrior",
    angles: {'left_elbow': 168.51492121292586, 'right_elbow': 174.74558545919976, 'left_knee': 172.70587611990015, 'right_knee': 99.55932878634748, 'left_shoulder': 94.21142969506964, 'right_shoulder': 97.97855272572248}
  }
];

function calculateAngle(a, b, c) {  
  const ba = subtract(a, b);
  const bc = subtract(c, b);
  
  const cosineAngle = dot(ba, bc) / (norm(ba) * norm(bc));
  const clampedCosineAngle = Math.max(-1, Math.min(1, cosineAngle));
  
  const angle = Math.acos(clampedCosineAngle);
  return angle * (180 / Math.PI);
}

export function getJointAngles(landmarks) {
  if (!landmarks) return null;

  const angles = {};
  
  angles.left_elbow = calculateAngle(
      landmarks[POSES.LEFT_SHOULDER],
      landmarks[POSES.LEFT_ELBOW],
      landmarks[POSES.LEFT_WRIST]
  );

  angles.right_elbow = calculateAngle(
      landmarks[POSES.RIGHT_SHOULDER],
      landmarks[POSES.RIGHT_ELBOW],
      landmarks[POSES.RIGHT_WRIST]
  );

  angles.left_knee = calculateAngle(
      landmarks[POSES.LEFT_HIP],
      landmarks[POSES.LEFT_KNEE],
      landmarks[POSES.LEFT_ANKLE]
  );

  angles.right_knee = calculateAngle(
      landmarks[POSES.RIGHT_HIP],
      landmarks[POSES.RIGHT_KNEE],
      landmarks[POSES.RIGHT_ANKLE]
  );

  angles.left_shoulder = calculateAngle(
      landmarks[POSES.LEFT_HIP],
      landmarks[POSES.LEFT_SHOULDER],
      landmarks[POSES.LEFT_ELBOW]
  );

  angles.right_shoulder = calculateAngle(
      landmarks[POSES.RIGHT_HIP],
      landmarks[POSES.RIGHT_SHOULDER],
      landmarks[POSES.RIGHT_ELBOW]
  );

  return angles;
}

export function compareAngles(angles1, angles2) {
  if (!angles1 || !angles2) return Infinity;
  
  let totalDifference = 0;
  for (const key in angles1) {
      totalDifference += Math.abs(angles1[key] - angles2[key]);
  }
  
  return totalDifference;
}
