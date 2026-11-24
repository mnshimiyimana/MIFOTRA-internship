import { LiquidMetal } from "@paper-design/shaders-react";
import logo from "@/assets/logo-removebg-preview.png";
import logoWhite from "@/assets/logo-white.png";

/** Hover shimmer over the brand: the white logo on blue, the original on white. */
export default function LiquidBrand({ onBlue = false }: { onBlue?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <LiquidMetal
        image={onBlue ? logoWhite : logo}
        colorBack={onBlue ? "#33478e00" : "#ffffff00"}
        colorTint={onBlue ? "#f7d117" : "#7fa6ef"}
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
        style={{ width: "100%", height: "100%", opacity: onBlue ? 0.35 : 0.52 }}
      />
    </span>
  );
}
