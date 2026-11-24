import { useLayoutEffect, useMemo, useRef } from "react";
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
import {
  CatmullRomCurve3,
  MathUtils,
  QuadraticBezierCurve3,
  Vector3,
  type Group,
} from "three";

/**
 * Hero scene: "from campus to career". A campus island and a workplace island
 * float side by side; a bridge assembles plank by plank between them and
 * graduates walk across it.
 */

const NAVY = "#122970";
const BLUE = "#33478e";
const SKY = "#8db7ef";
const PALE = "#dceaff";
const GOLD = "#f2c94c";
const GREEN = "#2f7a5b";
const ROCK = "#a9c4ec";

const CAMPUS = new Vector3(-2.25, -0.35, 0.7);
const WORK = new Vector3(2.25, -0.05, -0.7);
const ISLAND_TOP = 0.16;

const BRIDGE_START = new Vector3(-1.05, ISLAND_TOP - 0.35, 0.32);
const BRIDGE_END = new Vector3(1.05, ISLAND_TOP - 0.05, -0.32);
const BRIDGE = new QuadraticBezierCurve3(
  BRIDGE_START,
  new Vector3(0, 0.75, 0),
  BRIDGE_END,
);
const PLANKS = 17;

const WALK = new CatmullRomCurve3([
  new Vector3(CAMPUS.x + 0.15, CAMPUS.y + ISLAND_TOP, CAMPUS.z + 0.55),
  ...BRIDGE.getPoints(12),
  new Vector3(WORK.x - 0.2, WORK.y + ISLAND_TOP, WORK.z + 0.6),
]);

/** Seconds into the intro at which each beat starts. */
const INTRO = { islands: 0, bridge: 0.7, walkers: 2.1 };

const easeOutBack = (x: number) => {
  const c = 1.6;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
const progressAt = (time: number, start: number, length: number) =>
  MathUtils.clamp((time - start) / length, 0, 1);

function Island({
  position,
  delay,
  children,
}: {
  position: Vector3;
  delay: number;
  children: React.ReactNode;
}) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const rise = progressAt(state.clock.elapsedTime, delay, 1.1);
    const eased = 1 - Math.pow(1 - rise, 3);
    group.current.position.y = position.y - (1 - eased) * 2.4;
    group.current.scale.setScalar(0.6 + eased * 0.4);
  });

  return (
    <group ref={group} position={position}>
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.25}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.32, 1.24, 0.32, 10]} />
          <meshStandardMaterial color="#f8fbff" roughness={0.55} flatShading />
        </mesh>
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[1.25, 1.12, 0.18, 10]} />
          <meshStandardMaterial color={PALE} roughness={0.7} flatShading />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <cylinderGeometry args={[1.12, 0.12, 1.45, 10]} />
          <meshStandardMaterial color={ROCK} roughness={0.8} flatShading />
        </mesh>
        <group position={[0, ISLAND_TOP, 0]}>{children}</group>
      </Float>
    </group>
  );
}

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.24, 6]} />
        <meshStandardMaterial color="#8a6a46" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.2, 0.5, 7]} />
        <meshStandardMaterial color={GREEN} flatShading roughness={0.6} />
      </mesh>
    </group>
  );
}

function Campus() {
  const cap = useRef<Group>(null);

  useFrame((state) => {
    if (!cap.current) return;
    const t = state.clock.elapsedTime;
    cap.current.rotation.y = t * 0.6;
    cap.current.position.y = 1.32 + Math.sin(t * 1.6) * 0.06;
  });

  return (
    <group rotation-y={0.35}>
      {/* School hall: base, columns, pediment */}
      <RoundedBox
        args={[1.05, 0.1, 0.72]}
        radius={0.03}
        position={[0, 0.05, 0]}
      >
        <meshStandardMaterial color="#e9f1fd" />
      </RoundedBox>
      <RoundedBox
        args={[0.9, 0.5, 0.5]}
        radius={0.03}
        position={[0, 0.35, -0.08]}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.45} />
      </RoundedBox>
      {[-0.36, -0.12, 0.12, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.35, 0.24]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
          <meshStandardMaterial color="#f4f8ff" />
        </mesh>
      ))}
      <RoundedBox
        args={[1.02, 0.07, 0.66]}
        radius={0.02}
        position={[0, 0.63, 0]}
      >
        <meshStandardMaterial color={PALE} />
      </RoundedBox>
      <mesh
        position={[0, 0.75, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.7, 1, 0.55]}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.6, 3]} />
        <meshStandardMaterial color={NAVY} roughness={0.5} flatShading />
      </mesh>
      <mesh position={[0, 0.3, 0.17]}>
        <boxGeometry args={[0.16, 0.26, 0.02]} />
        <meshStandardMaterial color={BLUE} />
      </mesh>

      {/* Floating mortarboard */}
      <group ref={cap} position={[0, 1.32, 0]}>
        <mesh rotation-y={Math.PI / 4}>
          <boxGeometry args={[0.46, 0.035, 0.46]} />
          <meshStandardMaterial color={NAVY} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.13, 20]} />
          <meshStandardMaterial color={NAVY} />
        </mesh>
        <mesh position={[0.24, -0.1, 0.05]}>
          <cylinderGeometry args={[0.012, 0.012, 0.2, 6]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0.24, -0.22, 0.05]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Books */}
      {[
        { y: 0.04, c: BLUE, r: 0.1 },
        { y: 0.1, c: GOLD, r: -0.15 },
        { y: 0.16, c: GREEN, r: 0.25 },
      ].map(({ y, c, r }) => (
        <RoundedBox
          key={y}
          args={[0.28, 0.055, 0.2]}
          radius={0.015}
          position={[-0.82, y, 0.42]}
          rotation-y={r}
        >
          <meshStandardMaterial color={c} />
        </RoundedBox>
      ))}

      <Tree position={[0.78, 0, -0.42]} />
      <Tree position={[-0.75, 0, -0.45]} scale={0.8} />
    </group>
  );
}

function Workplace() {
  const windows = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => [
        -0.42 + (i % 2) * 0.2,
        0.3 + Math.floor(i / 2) * 0.27,
      ]),
    [],
  );
  const beacon = useRef<Group>(null);

  useFrame((state) => {
    if (beacon.current)
      beacon.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 3) * 0.18,
      );
  });

  return (
    <group rotation-y={-0.4}>
      <RoundedBox
        args={[0.55, 1.65, 0.55]}
        radius={0.05}
        position={[-0.32, 0.83, -0.1]}
      >
        <meshStandardMaterial color={BLUE} roughness={0.35} />
      </RoundedBox>
      {windows.map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.18]}>
          <boxGeometry args={[0.1, 0.13, 0.01]} />
          <meshStandardMaterial
            color="#fff3c8"
            emissive={GOLD}
            emissiveIntensity={0.55}
          />
        </mesh>
      ))}
      <RoundedBox
        args={[0.48, 1.12, 0.48]}
        radius={0.05}
        position={[0.25, 0.56, 0.05]}
      >
        <meshStandardMaterial color={NAVY} roughness={0.4} />
      </RoundedBox>
      {[0.3, 0.55, 0.8].map((y) => (
        <mesh key={y} position={[0.25, y, 0.295]}>
          <boxGeometry args={[0.34, 0.06, 0.01]} />
          <meshStandardMaterial
            color={SKY}
            emissive={SKY}
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}
      <RoundedBox
        args={[0.38, 0.7, 0.38]}
        radius={0.05}
        position={[0.68, 0.35, 0.3]}
      >
        <meshStandardMaterial color={SKY} roughness={0.4} />
      </RoundedBox>
      <group ref={beacon} position={[-0.32, 1.76, -0.1]}>
        <mesh>
          <sphereGeometry args={[0.07, 20, 20]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>
      <Tree position={[0.75, 0, -0.5]} scale={0.9} />
      <Tree position={[-0.85, 0, 0.45]} scale={0.75} />
    </group>
  );
}

function Bridge() {
  const planks = useRef<(Group | null)[]>([]);
  const frames = useMemo(
    () =>
      Array.from({ length: PLANKS }, (_, i) => {
        const t = (i + 0.5) / PLANKS;
        return { point: BRIDGE.getPointAt(t), tangent: BRIDGE.getTangentAt(t) };
      }),
    [],
  );
  const rails = useMemo(() => {
    const side = (offset: number) =>
      BRIDGE.getPoints(40).map((p, i, all) => {
        const next = all[Math.min(i + 1, all.length - 1)];
        const prev = all[Math.max(i - 1, 0)];
        const dir = next.clone().sub(prev).setY(0).normalize();
        const normal = new Vector3(-dir.z, 0, dir.x).multiplyScalar(offset);
        return p
          .clone()
          .add(normal)
          .add(new Vector3(0, 0.28, 0));
      });
    return [side(0.3), side(-0.3)];
  }, []);

  useLayoutEffect(() => {
    planks.current.forEach((plank, i) => {
      if (!plank) return;
      const { point, tangent } = frames[i];
      plank.position.copy(point);
      plank.lookAt(point.clone().add(tangent));
    });
  }, [frames]);

  const railsGroup = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    planks.current.forEach((plank, i) => {
      if (!plank) return;
      const p = progressAt(t, INTRO.bridge + i * 0.06, 0.4);
      plank.scale.setScalar(p === 0 ? 0.0001 : easeOutBack(p));
    });
    if (railsGroup.current)
      railsGroup.current.visible = t > INTRO.bridge + PLANKS * 0.06;
  });

  return (
    <group>
      {frames.map((_, i) => (
        <group key={i} ref={(el) => void (planks.current[i] = el)}>
          <RoundedBox args={[0.62, 0.05, 0.11]} radius={0.015}>
            <meshStandardMaterial
              color={i % 2 ? "#ffffff" : "#eef5ff"}
              roughness={0.5}
            />
          </RoundedBox>
          {i % 3 === 1 &&
            [-0.3, 0.3].map((x) => (
              <mesh key={x} position={[x, 0.14, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.28, 6]} />
                <meshStandardMaterial color={SKY} />
              </mesh>
            ))}
        </group>
      ))}
      <group ref={railsGroup} visible={false}>
        {rails.map((points, i) => (
          <Line key={i} points={points} color={BLUE} lineWidth={2.2} />
        ))}
      </group>
    </group>
  );
}

const WALK_SPEED = 0.065;

const WALKERS = [
  { offset: 0, color: GOLD },
  { offset: 0.33, color: BLUE },
  { offset: 0.66, color: GREEN },
];

function Walker({ offset, color }: { offset: number; color: string }) {
  const body = useRef<Group>(null);
  const cap = useRef<Group>(null);
  const bag = useRef<Group>(null);
  const ahead = useMemo(() => new Vector3(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!body.current) return;
    // Staggered departures so every walker sets off from the campus.
    const local = time - INTRO.walkers - offset / WALK_SPEED;
    const started = local > 0 ? 1 : 0;
    const u = (((Math.max(local, 0) * WALK_SPEED) % 1) + 1) % 1;
    const fade = Math.min(u / 0.05, (1 - u) / 0.05, 1);
    const point = WALK.getPointAt(u);
    WALK.getPointAt(Math.min(u + 0.01, 1), ahead);
    body.current.position.set(
      point.x,
      point.y + Math.abs(Math.sin(time * 7 + offset * 9)) * 0.04,
      point.z,
    );
    ahead.y = point.y;
    body.current.lookAt(ahead.x, body.current.position.y, ahead.z);
    body.current.scale.setScalar(Math.max(started * fade, 0.0001));
    // Graduate on the way out, professional on arrival.
    if (cap.current) cap.current.visible = u < 0.55;
    if (bag.current) bag.current.visible = u >= 0.55;
  });

  return (
    <group ref={body} scale={0.0001}>
      <mesh position={[0, 0.17, 0]}>
        <capsuleGeometry args={[0.065, 0.13, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#6b4a33" roughness={0.6} />
      </mesh>
      <group ref={cap} position={[0, 0.42, 0]}>
        <mesh rotation-y={Math.PI / 4}>
          <boxGeometry args={[0.15, 0.015, 0.15]} />
          <meshStandardMaterial color={NAVY} />
        </mesh>
      </group>
      <group ref={bag} position={[0.09, 0.12, 0]} visible={false}>
        <RoundedBox args={[0.05, 0.08, 0.1]} radius={0.01}>
          <meshStandardMaterial color={NAVY} />
        </RoundedBox>
      </group>
    </group>
  );
}

function Clouds() {
  const group = useRef<Group>(null);
  const clouds = useMemo(
    () => [
      { x: -3.6, y: 1.9, z: -2.4, s: 0.9 },
      { x: 0.6, y: 2.4, z: -3.2, s: 1.1 },
      { x: 3.8, y: 1.4, z: -2, s: 0.7 },
      { x: -1.6, y: -1.7, z: 1.4, s: 0.6 },
    ],
    [],
  );

  useFrame((_, delta) => {
    group.current?.children.forEach((cloud) => {
      cloud.position.x += delta * 0.12;
      if (cloud.position.x > 5.5) cloud.position.x = -5.5;
    });
  });

  return (
    <group ref={group}>
      {clouds.map(({ x, y, z, s }) => (
        <group key={`${x}-${y}`} position={[x, y, z]} scale={s}>
          {[
            [0, 0, 0, 0.36],
            [0.36, -0.06, 0.05, 0.28],
            [-0.34, -0.08, 0, 0.26],
            [0.1, 0.18, -0.05, 0.25],
          ].map(([cx, cy, cz, r]) => (
            <mesh key={`${cx}-${cy}`} position={[cx, cy, cz]}>
              <sphereGeometry args={[r, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.9}
                transparent
                opacity={0.92}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  useFrame((state, delta) => {
    const { camera, pointer, clock } = state;
    const scroll = progress.get();
    const intro = 1 - Math.pow(1 - progressAt(clock.elapsedTime, 0, 2.2), 3);
    const targetX = pointer.x * 0.9;
    const targetY = 2.1 + pointer.y * 0.45 + scroll * 1.6;
    const targetZ = 10.6 + (1 - intro) * 4 - scroll * 2.2;
    camera.position.x = MathUtils.damp(camera.position.x, targetX, 2.5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 2.5, delta);
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 2.5, delta);
    camera.lookAt(0, 0.15 - scroll * 0.4, 0);
  });
  return null;
}

export default function BridgeWorld({
  progress,
  active,
}: {
  /** Hero scroll progress, 0 at the top of the page. */
  progress: MotionValue<number>;
  active: boolean;
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 2.4, 14], fov: 34 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.6 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 7, 5]} intensity={1.7} />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color={SKY} />
      <hemisphereLight args={["#ffffff", ROCK, 0.5]} />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 3]} scale={[10, 3, 1]} />
        <Lightformer
          intensity={1.2}
          color="#bad1fc"
          position={[-5, 1, -2]}
          scale={[4, 4, 1]}
        />
        <Lightformer
          intensity={0.8}
          color="#fff3c8"
          position={[5, 1, 2]}
          scale={[3, 3, 1]}
        />
      </Environment>

      <CameraRig progress={progress} />
      <Clouds />

      <Island position={CAMPUS} delay={INTRO.islands}>
        <Campus />
      </Island>
      <Island position={WORK} delay={INTRO.islands + 0.2}>
        <Workplace />
      </Island>

      <Bridge />
      {WALKERS.map((walker) => (
        <Walker key={walker.offset} {...walker} />
      ))}

      <Sparkles
        count={40}
        scale={[11, 5, 5]}
        position={[0, 0.8, -1]}
        size={2.4}
        speed={0.3}
        opacity={0.75}
        color={SKY}
      />
    </Canvas>
  );
}
