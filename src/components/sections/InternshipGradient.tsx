import "@/lib/shadergradient-compat";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import type { MotionValue } from "motion/react";
import type { Group } from "three";

function GradientScene({ progress }: { progress: MotionValue<number> }) {
  const scene = useRef<Group>(null);

  useFrame(() => {
    if (scene.current) {
      const position = progress.get();
      scene.current.rotation.z = position * 0.18;
      scene.current.scale.setScalar(1 + position * 0.22);
    }
  });

  return (
    <group ref={scene}>
      <ShaderGradient
        animate="on"
        type="waterPlane"
        color1="#f2f9ff"
        color2="#8db7ef"
        color3="#bad1fc"
        lightType="3d"
        brightness={1.05}
        cDistance={3.6}
        cPolarAngle={90}
        cAzimuthAngle={180}
        uSpeed={0.25}
        uStrength={1.6}
        uFrequency={5}
        grain="off"
      />
    </group>
  );
}

export default function InternshipGradient({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  return (
    <ShaderGradientCanvas
      className="internship-shader"
      style={{ position: "absolute", inset: 0 }}
      pixelDensity={1}
      powerPreference="low-power"
      preserveDrawingBuffer={false}
      pointerEvents="none"
    >
      <GradientScene progress={progress} />
    </ShaderGradientCanvas>
  );
}
