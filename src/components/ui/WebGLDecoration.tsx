import {
  Component,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

class DecorationBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

let supportsWebGL2: boolean | undefined;

function detectWebGL2() {
  if (supportsWebGL2 === undefined) {
    const context = document.createElement("canvas").getContext("webgl2");
    supportsWebGL2 = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return supportsWebGL2;
}

/** True when the user allows motion and the browser supports WebGL2. */
export function useWebGLEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(preference.matches && detectWebGL2());

    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return enabled;
}

/**
 * True while the element is within `margin` of the viewport. Used to mount
 * WebGL canvases only when they are about to be seen, so the page never holds
 * more GPU contexts than it needs.
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  margin = "300px",
) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, margin]);

  return near;
}

/**
 * Becomes true once the page has loaded and the browser is idle. Heavy WebGL
 * scenes mount at that point (paused) so shader compilation never lands in
 * the middle of a scroll.
 */
export function useIdleMount(timeout = 2500) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setReady(true), { timeout });
      } else {
        fallback = globalThis.setTimeout(() => setReady(true), 1200);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idle) window.cancelIdleCallback(idle);
      globalThis.clearTimeout(fallback);
    };
  }, [timeout]);

  return ready;
}

export function WebGLDecoration({
  children,
  fallback = null,
}: {
  children: ReactNode;
  /** Rendered when WebGL is unavailable, motion is reduced, or the scene fails. */
  fallback?: ReactNode;
}) {
  const enabled = useWebGLEnabled();

  return enabled ? (
    <DecorationBoundary fallback={fallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </DecorationBoundary>
  ) : (
    fallback
  );
}
