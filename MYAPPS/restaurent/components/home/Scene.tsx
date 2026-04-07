"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { type MutableRefObject, useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { Color, MathUtils, Vector3 } from "three";

import { ModelLoader } from "@/components/home/ModelLoader";

type SceneProps = {
  progressRef: MutableRefObject<number>;
};

type IngredientConfig = {
  color: string;
  radius: number;
  angle: number;
  lift: number;
  speed: number;
};

function IngredientField({
  progressRef
}: {
  progressRef: MutableRefObject<number>;
}) {
  const ingredientRefs = useRef<Array<Mesh | null>>([]);
  const particles = useMemo<IngredientConfig[]>(
    () => [
      { color: "#f4b942", radius: 0.08, angle: 0.2, lift: 0.4, speed: 0.8 },
      { color: "#7bb661", radius: 0.1, angle: 1.2, lift: 0.6, speed: 1.1 },
      { color: "#ef6c3f", radius: 0.09, angle: 2.1, lift: 0.8, speed: 0.9 },
      { color: "#f2df9f", radius: 0.07, angle: 2.9, lift: 0.55, speed: 1.2 },
      { color: "#d4a83d", radius: 0.08, angle: 4.0, lift: 0.72, speed: 0.95 },
      { color: "#72a658", radius: 0.09, angle: 5.2, lift: 0.48, speed: 1.18 }
    ],
    []
  );

  useFrame((state) => {
    const progress = progressRef.current;
    const burst = MathUtils.smoothstep(progress, 0.16, 0.84);
    const elapsed = state.clock.elapsedTime;

    particles.forEach((particle, index) => {
      const mesh = ingredientRefs.current[index];
      if (!mesh) {
        return;
      }

      const radius = MathUtils.lerp(0.7, 2.45, burst);
      const angle = particle.angle + elapsed * particle.speed * 0.16 + burst * 1.4;
      const wobble = Math.sin(elapsed * particle.speed + index) * 0.18;

      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.position.y = particle.lift + burst * 0.65 + wobble;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.013;
    });
  });

  return (
    <group>
      {particles.map((particle, index) => (
        <mesh
          key={`${particle.color}-${index}`}
          ref={(node) => {
            ingredientRefs.current[index] = node;
          }}
          castShadow
        >
          <sphereGeometry args={[particle.radius, 18, 18]} />
          <meshStandardMaterial color={particle.color} roughness={0.5} metalness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function DishExperience({ progressRef }: SceneProps) {
  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const focus = useMemo(() => new Vector3(0, 0.18, 0), []);
  const scaleTarget = useMemo(() => new Vector3(1, 1, 1), []);

  useFrame((state, delta) => {
    const progress = progressRef.current;
    const burst = MathUtils.smoothstep(progress, 0.08, 0.88);

    if (groupRef.current) {
      const idle = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.y = MathUtils.damp(
        groupRef.current.rotation.y,
        idle + burst * Math.PI * 1.1,
        4,
        delta
      );
      groupRef.current.rotation.x = MathUtils.damp(
        groupRef.current.rotation.x,
        hovered ? -0.22 : -0.08 - burst * 0.16,
        4,
        delta
      );
      groupRef.current.rotation.z = MathUtils.damp(
        groupRef.current.rotation.z,
        hovered ? 0.08 : 0,
        4,
        delta
      );
    }

    if (modelRef.current) {
      const scale = hovered ? 1.08 : 1 + burst * 0.06;
      scaleTarget.setScalar(scale);
      modelRef.current.scale.lerp(scaleTarget, 0.08);
    }

    camera.position.x = MathUtils.damp(camera.position.x, hovered ? 0.24 : 0, 3.4, delta);
    camera.position.y = MathUtils.damp(camera.position.y, 0.68 + burst * 0.32, 3.4, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 7.3 - burst * 1.75, 3.4, delta);
    camera.lookAt(focus);
  });

  return (
    <>
      <color attach="background" args={["#080507"]} />
      <fog attach="fog" args={["#080507", 8.5, 14]} />
      <ambientLight intensity={1.15} />
      <directionalLight
        castShadow
        intensity={2.7}
        position={[4.2, 6.5, 4.6]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight color={new Color("#ff8a4c")} intensity={18} distance={12} position={[-3, 2, 2]} />
      <spotLight
        color={new Color("#ffd298")}
        intensity={28}
        angle={0.36}
        penumbra={0.5}
        position={[0, 7, 2]}
      />

      <group ref={groupRef}>
        <group
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onPointerMissed={() => setHovered(false)}
        >
          <ModelLoader groupRef={modelRef} />
        </group>
        <IngredientField progressRef={progressRef} />
      </group>

      <ContactShadows
        opacity={0.55}
        scale={8}
        blur={1.8}
        far={4.5}
        resolution={512}
        color="#000000"
        position={[0, -1.45, 0]}
      />
    </>
  );
}

export function Scene({ progressRef }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.7, 7.3], fov: 28 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <DishExperience progressRef={progressRef} />
    </Canvas>
  );
}
