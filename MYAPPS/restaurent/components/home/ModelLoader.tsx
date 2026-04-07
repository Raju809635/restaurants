"use client";

import { Center } from "@react-three/drei";
import { type RefObject, useEffect, useMemo, useState } from "react";
import type { Group, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type ModelLoaderProps = {
  groupRef: RefObject<Group>;
};

function ProceduralBowl() {
  return (
    <group position={[0, -0.25, 0]}>
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.8, 1.45, 0.95, 48, 1, true]} />
        <meshStandardMaterial color="#40261d" metalness={0.25} roughness={0.35} />
      </mesh>
      <mesh receiveShadow position={[0, -0.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.45, 48]} />
        <meshStandardMaterial color="#26140e" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.08, 0]}>
        <sphereGeometry args={[1.18, 42, 42]} />
        <meshStandardMaterial color="#f2dcc3" roughness={0.92} />
      </mesh>
      <mesh castShadow position={[0.18, 0.38, 0.2]} rotation={[0.3, 0.4, 0.1]}>
        <sphereGeometry args={[0.94, 42, 42]} />
        <meshStandardMaterial color="#bf5b2a" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[-0.66, 0.56, 0.44]} rotation={[0.2, -0.12, 0.2]}>
        <boxGeometry args={[0.34, 0.08, 0.18]} />
        <meshStandardMaterial color="#f4b53f" roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0.68, 0.68, -0.12]} rotation={[0.16, 0.1, -0.3]}>
        <sphereGeometry args={[0.12, 18, 18]} />
        <meshStandardMaterial color="#6f9f46" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[-0.22, 0.86, -0.52]} rotation={[0.24, 0.1, 0.52]}>
        <sphereGeometry args={[0.11, 18, 18]} />
        <meshStandardMaterial color="#6f9f46" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0.1, 0.9, 0.58]} rotation={[0.12, 0.14, 0.18]}>
        <boxGeometry args={[0.26, 0.06, 0.1]} />
        <meshStandardMaterial color="#efdf72" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function ModelLoader({ groupRef }: ModelLoaderProps) {
  const [model, setModel] = useState<Object3D | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const loader = new GLTFLoader();

    loader.load(
      "/models/food-bowl.glb",
      (gltf) => {
        if (!alive) {
          return;
        }
        setModel(gltf.scene);
        setReady(true);
      },
      undefined,
      () => {
        if (!alive) {
          return;
        }
        setReady(true);
      }
    );

    return () => {
      alive = false;
    };
  }, []);

  const clonedModel = useMemo(() => {
    if (!model) {
      return null;
    }
    return model.clone(true);
  }, [model]);

  return (
    <group ref={groupRef}>
      {ready && clonedModel ? (
        <Center>
          <primitive object={clonedModel} scale={1.8} />
        </Center>
      ) : (
        <ProceduralBowl />
      )}
    </group>
  );
}
