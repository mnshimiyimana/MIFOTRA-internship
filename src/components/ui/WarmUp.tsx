import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * three.js compiles shaders on the first frame a scene renders. Scenes that
 * mount paused (off screen) would otherwise compile the moment they scroll
 * into view and stall the scroll. Render a few frames up front instead, while
 * the browser is idle.
 */
export function WarmUp() {
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    let frames = 0;
    let handle = 0;
    const step = (time: number) => {
      advance(time);
      if (++frames < 3) handle = requestAnimationFrame(step);
    };
    handle = requestAnimationFrame(step);
    return () => cancelAnimationFrame(handle);
  }, [advance]);

  return null;
}
