import "@/lib/shadergradient-compat";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { LiquidMetal } from "@paper-design/shaders-react";
import programMark from "@/assets/program-mark.svg";
import { WarmUp } from "@/components/ui/WarmUp";

function PauseWhenHidden({ active }: { active: boolean }) {
  const setFrameloop = useThree((state) => state.setFrameloop);
  useEffect(
    () => setFrameloop(active ? "always" : "never"),
    [active, setFrameloop],
  );
  return null;
}

/** Slow navy water-plane gradient behind the call-to-action band. */
export function CtaGradient({ active }: { active: boolean }) {
  return (
    <ShaderGradientCanvas
      // Its built-in lazy loading destroys and rebuilds the canvas (and
      // recompiles shaders) every time it scrolls into view.
      lazyLoad={false}
      style={{ position: "absolute", inset: 0 }}
      pixelDensity={1}
      powerPreference="low-power"
      preserveDrawingBuffer={false}
      pointerEvents="none"
    >
      <ShaderGradient
        animate="on"
        type="waterPlane"
        color1="#2f5fc4"
        color2="#122970"
        color3="#081440"
        lightType="3d"
        brightness={0.95}
        cDistance={3.4}
        cPolarAngle={95}
        cAzimuthAngle={180}
        positionX={0}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
        uSpeed={0.18}
        uStrength={2.6}
        uDensity={1.3}
        uFrequency={5.5}
        grain="off"
      />
      <WarmUp />
      <PauseWhenHidden active={active} />
    </ShaderGradientCanvas>
  );
}

/** The program mark rendered as liquid metal. */
export function ProgramMarkMetal({ active }: { active: boolean }) {
  return (
    <LiquidMetal
      image={programMark}
      colorBack="#00000000"
      colorTint="#c9dcff"
      repetition={2.4}
      softness={0.4}
      shiftRed={0.25}
      shiftBlue={0.3}
      distortion={0.09}
      contour={0.45}
      angle={70}
      speed={active ? 0.7 : 0}
      scale={0.82}
      fit="contain"
      maxPixelCount={360000}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
