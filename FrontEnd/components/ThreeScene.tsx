import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ------------------ Folded Fabric ------------------ */
const FoldedFabric = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      {/* Looks like folded cloth */}
      <boxGeometry args={[2.4, 0.3, 1.6, 64, 16, 64]} />
      <MeshWobbleMaterial
        color="#e5e7eb"       // neutral fabric tone
        factor={0.15}        // very subtle wave
        speed={0.6}
        roughness={0.8}
        metalness={0.05}
      />
    </mesh>
  );
};

/* ------------------ MAIN HERO ------------------ */
interface ClothHeroProps {
  className?: string;
}

export const ClothHero: React.FC<ClothHeroProps> = ({ className }) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 1.2, 4], fov: 35 }}>
        {/* Soft studio lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[2, 4, 3]}
          intensity={0.8}
        />

        {/* Scene */}
        <Environment preset="studio" />

        <FoldedFabric />
      </Canvas>
    </div>
  );
};
