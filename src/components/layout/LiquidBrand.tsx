import { LiquidMetal } from "@paper-design/shaders-react";
import logo from "@/assets/logo-removebg-preview.png";

export default function LiquidBrand() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <LiquidMetal
        image={logo}
        colorBack="#ffffff00"
        colorTint="#88b2f5"
        repetition={3}
        softness={0.55}
        shiftRed={0}
        shiftBlue={0.14}
        distortion={0.13}
        contour={0.12}
        angle={40}
        speed={0.55}
        scale={1}
        fit="contain"
        minPixelRatio={1}
        maxPixelCount={90000}
        style={{ width: "100%", height: "100%", opacity: 0.52 }}
      />
    </span>
  );
}
