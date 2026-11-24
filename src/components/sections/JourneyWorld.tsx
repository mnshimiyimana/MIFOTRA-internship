import { useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  Line,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { WarmUp } from "@/components/ui/WarmUp";
import {
  CatmullRomCurve3,
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from "three";

/**
 * "Scroll world": a small 3D landscape with one station per step of the
 * internship journey. `journey` runs from 0 (Apply) to 2 (Start); the camera
 * glides between stations and a glowing traveller walks the path.
 */

const NAVY = "#122970";
const BLUE = "#2e4d84";
const SKY = "#8db7ef";
const PALE = "#dceaff";
const GOLD = "#f2c94c";
const GREEN = "#2b6450";

const STATIONS = [
  new Vector3(-3.2, 0, 0),
  new Vector3(0, 0.3, -1.4),
  new Vector3(3.2, 0, 0),
];

const PATH = new CatmullRomCurve3(
  [
    new Vector3(-4.6, -0.92, 0.6),
    ...STATIONS.map((s) => new Vector3(s.x, s.y - 0.92, s.z + 0.15)),
    new Vector3(4.6, -0.92, 0.6),
  ],
  false,
  "catmullrom",
  0.4,
);

/** Path parameter (0..1) at each station, so the traveller stops on them. */
const STATION_T = STATIONS.map((station) => {
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i <= 400; i++) {
    const t = i / 400;
    const d = PATH.getPointAt(t).distanceTo(
      new Vector3(station.x, station.y - 0.92, station.z + 0.15),
    );
    if (d < bestDistance) [best, bestDistance] = [t, d];
  }
  return best;
});

function pathTAt(journey: number) {
  const clamped = MathUtils.clamp(journey, 0, 2);
  const i = Math.min(Math.floor(clamped), 1);
  return MathUtils.lerp(STATION_T[i], STATION_T[i + 1], clamped - i);
}

function focusAt(journey: number, target: Vector3) {
  const clamped = MathUtils.clamp(journey, 0, 2);
  const i = Math.min(Math.floor(clamped), 1);
  return target.lerpVectors(STATIONS[i], STATIONS[i + 1], clamped - i);
}

/** 1 when the journey sits on this station, fading to 0 one step away. */
function weightOf(journey: number, index: number) {
  return 1 - MathUtils.clamp(Math.abs(journey - index), 0, 1);
}

function Station({
  index,
  journey,
  children,
}: {
  index: number;
  journey: MotionValue<number>;
  children: ReactNode;
}) {
  const group = useRef<Group>(null);
  const halo = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const weight = weightOf(journey.get(), index);
    if (group.current) {
      const scale = MathUtils.damp(
        group.current.scale.x,
        0.78 + weight * 0.22,
        6,
        delta,
      );
      group.current.scale.setScalar(scale);
    }
    if (halo.current) halo.current.emissiveIntensity = 0.15 + weight * 2.2;
  });

  return (
    <group position={STATIONS[index]}>
      <group ref={group}>
        <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.5}>
          {children}
        </Float>
      </group>
      {/* Pedestal with a halo that lights up on the active step */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <cylinderGeometry args={[1.05, 1.15, 0.14, 48]} />
        <meshStandardMaterial color="#f7fbff" roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.92, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.06, 0.022, 12, 64]} />
        <meshStandardMaterial
          ref={halo}
          color={BLUE}
          emissive={BLUE}
          emissiveIntensity={0.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ApplicationDocument({ journey }: { journey: MotionValue<number> }) {
  const badge = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!badge.current) return;
    const shown = weightOf(journey.get(), 0) > 0.6 ? 1 : 0.001;
    badge.current.scale.setScalar(
      MathUtils.damp(badge.current.scale.x, shown, 8, delta),
    );
  });

  return (
    <group rotation={[0, 0.35, 0]}>
      <RoundedBox
        args={[1.25, 1.6, 0.05]}
        radius={0.05}
        position={[-0.08, -0.02, -0.12]}
        rotation-z={-0.2}
      >
        <meshStandardMaterial color="#e8f1ff" />
      </RoundedBox>
      <group rotation-z={0.08}>
        <RoundedBox args={[1.2, 1.55, 0.08]} radius={0.05} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </RoundedBox>
        <RoundedBox
          args={[1.2, 0.28, 0.09]}
          radius={0.05}
          position={[0, 0.635, 0.01]}
        >
          <meshStandardMaterial color="#193873" />
        </RoundedBox>
        <mesh position={[-0.3, 0.22, 0.05]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
          <meshStandardMaterial color={PALE} />
        </mesh>
        {[
          { w: 0.46, y: 0.28, x: 0.17, c: "#315585" },
          { w: 0.32, y: 0.15, x: 0.1, c: "#aec6ea" },
          { w: 0.86, y: -0.12, x: 0, c: "#c6d7ef" },
          { w: 0.7, y: -0.28, x: -0.08, c: "#dce7f6" },
          { w: 0.56, y: -0.44, x: -0.15, c: "#dce7f6" },
        ].map(({ w, y, x, c }) => (
          <mesh key={y} position={[x, y, 0.05]}>
            <boxGeometry args={[w, 0.06, 0.01]} />
            <meshStandardMaterial color={c} />
          </mesh>
        ))}
        <group ref={badge} position={[0.52, -0.66, 0.1]}>
          <mesh rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.19, 0.19, 0.06, 32]} />
            <meshStandardMaterial color={GREEN} />
          </mesh>
          <mesh rotation-x={Math.PI / 2} position-z={0.035}>
            <torusGeometry args={[0.13, 0.018, 8, 32]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function MatchOrbs({ journey }: { journey: MotionValue<number> }) {
  const spin = useRef<Group>(null);
  const graduate = useRef<Mesh>(null);
  const employer = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const weight = weightOf(journey.get(), 1);
    const gap = MathUtils.lerp(0.78, 0.42, weight);
    if (spin.current) spin.current.rotation.y += delta * (0.4 + weight * 0.9);
    graduate.current?.position.setX(
      MathUtils.damp(graduate.current.position.x, -gap, 5, delta),
    );
    employer.current?.position.setX(
      MathUtils.damp(employer.current.position.x, gap, 5, delta),
    );
    if (spin.current)
      spin.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <group>
      <group ref={spin}>
        <mesh ref={graduate} position={[-0.6, 0, 0]} castShadow>
          <sphereGeometry args={[0.36, 48, 48]} />
          <meshStandardMaterial color={GOLD} roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh ref={employer} position={[0.6, 0, 0]} castShadow>
          <sphereGeometry args={[0.36, 48, 48]} />
          <meshStandardMaterial color={BLUE} roughness={0.25} metalness={0.1} />
        </mesh>
      </group>
      {/* Glass ring binding the match together */}
      <mesh rotation={[Math.PI / 2.4, 0, 0.3]}>
        <torusGeometry args={[0.95, 0.08, 32, 96]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          thickness={0.6}
          roughness={0.04}
          ior={1.35}
          clearcoat={1}
          attenuationColor={PALE}
          attenuationDistance={1.5}
        />
      </mesh>
    </group>
  );
}

function Workplace() {
  const windows = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => [
        -0.47 + (i % 2) * 0.24,
        -0.25 + Math.floor(i / 2) * 0.28,
      ]),
    [],
  );

  return (
    <group position={[0, -0.15, 0]} rotation-y={-0.4}>
      <RoundedBox
        args={[0.6, 1.6, 0.6]}
        radius={0.05}
        position={[-0.35, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={BLUE} roughness={0.4} />
      </RoundedBox>
      {windows.map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.305]}>
          <boxGeometry args={[0.12, 0.15, 0.01]} />
          <meshStandardMaterial
            color="#fff3c8"
            emissive={GOLD}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      <RoundedBox
        args={[0.5, 1.1, 0.5]}
        radius={0.05}
        position={[0.25, -0.25, 0.12]}
        castShadow
      >
        <meshStandardMaterial color={NAVY} roughness={0.4} />
      </RoundedBox>
      <RoundedBox
        args={[0.38, 0.7, 0.38]}
        radius={0.05}
        position={[0.68, -0.45, 0.25]}
        castShadow
      >
        <meshStandardMaterial color={SKY} roughness={0.4} />
      </RoundedBox>
      <mesh position={[-0.35, 0.95, 0]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Traveller({ journey }: { journey: MotionValue<number> }) {
  const body = useRef<Group>(null);
  const t = useRef(pathTAt(journey.get()));

  useFrame((state, delta) => {
    t.current = MathUtils.damp(t.current, pathTAt(journey.get()), 5, delta);
    const point = PATH.getPointAt(t.current);
    body.current?.position.set(
      point.x,
      point.y + 0.18 + Math.abs(Math.sin(state.clock.elapsedTime * 4)) * 0.06,
      point.z,
    );
  });

  return (
    <group ref={body}>
      <mesh>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={GOLD} intensity={2.5} distance={2.2} />
    </group>
  );
}

function CameraRig({ journey }: { journey: MotionValue<number> }) {
  const focus = useMemo(() => new Vector3(), []);
  const look = useMemo(() => focusAt(journey.get(), new Vector3()), [journey]);

  useFrame((state, delta) => {
    focusAt(journey.get(), focus);
    look.x = MathUtils.damp(look.x, focus.x, 4, delta);
    look.y = MathUtils.damp(look.y, focus.y, 4, delta);
    look.z = MathUtils.damp(look.z, focus.z, 4, delta);

    const { camera, pointer } = state;
    camera.position.x = MathUtils.damp(
      camera.position.x,
      look.x + pointer.x * 0.6,
      3,
      delta,
    );
    camera.position.y = MathUtils.damp(
      camera.position.y,
      look.y + 1.7 + pointer.y * 0.35,
      3,
      delta,
    );
    camera.position.z = MathUtils.damp(
      camera.position.z,
      look.z + 7.6,
      3,
      delta,
    );
    camera.lookAt(look.x, look.y - 0.1, look.z);
  });

  return null;
}

export default function JourneyWorld({
  journey,
  active,
}: {
  journey: MotionValue<number>;
  /** Pause rendering while the scene is off screen. */
  active: boolean;
}) {
  const pathPoints = useMemo(() => PATH.getPoints(120), []);

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [-3.2, 1.7, 7.6], fov: 35 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.6 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 6, 4]} intensity={1.6} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color={SKY} />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 3]} scale={[10, 3, 1]} />
        <Lightformer
          intensity={1.5}
          color="#bad1fc"
          position={[-5, 1, -2]}
          scale={[4, 4, 1]}
        />
        <Lightformer
          intensity={1}
          color="#fff3c8"
          position={[5, 1, 2]}
          scale={[3, 3, 1]}
        />
      </Environment>

      <WarmUp />
      <CameraRig journey={journey} />

      <Line
        points={pathPoints}
        color="#88a9d9"
        lineWidth={2}
        dashed
        dashSize={0.16}
        gapSize={0.11}
      />
      <Traveller journey={journey} />

      <Station index={0} journey={journey}>
        <ApplicationDocument journey={journey} />
      </Station>
      <Station index={1} journey={journey}>
        <MatchOrbs journey={journey} />
      </Station>
      <Station index={2} journey={journey}>
        <Workplace />
      </Station>

      <Sparkles
        count={45}
        scale={[12, 3.5, 5]}
        position={[0, 0.6, -0.6]}
        size={2.2}
        speed={0.3}
        opacity={0.7}
        color={SKY}
      />
    </Canvas>
  );
}
