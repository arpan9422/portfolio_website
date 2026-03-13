"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function SpaceshipModel() {
  // Load the model
  const { scene } = useGLTF("/spaceship.glb");
  const ref = useRef<THREE.Group>(null);

  // Clone the scene so it doesn't mutate globally if reused
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const t = state.clock.getElapsedTime();
    // Adjust size of the elliptical orbit here
    const radiusX = 14; 
    const radiusZ = 10;
    const speed = 0.4;

    // Current position
    const x = Math.sin(t * speed) * radiusX;
    const z = Math.cos(t * speed) * radiusZ;
    const y = Math.sin(t * speed * 1.5) * 2; // subtle bobbing up and down

    ref.current.position.set(x, y, z);

    // To figure out where the ship should face, we look slightly "ahead" in time
    const nextX = Math.sin((t + 0.05) * speed) * radiusX;
    const nextZ = Math.cos((t + 0.05) * speed) * radiusZ;
    const nextY = Math.sin((t + 0.05) * speed * 1.5) * 2;

    ref.current.lookAt(nextX, nextY, nextZ);

    // Depending on the model's actual axes, you might need to adjust default rotations.
    clonedScene.rotation.y = 0; // Removing the Math.PI rotation should flip it 180 degrees to face forward
    
    // Add cool tilting (roll/pitch) to the ship body itself based on its curve
    clonedScene.rotation.z = Math.sin(t * speed) * 0.3; // roll into turns
    clonedScene.rotation.x = Math.cos(t * speed) * 0.1; // slight pitch correction
  });

  return (
    <group ref={ref}>
      <primitive object={clonedScene} scale={0.02} />
    </group>
  );
}

useGLTF.preload("/spaceship.glb");

export default function SpaceshipCanvas() {
  return (
    <div className="absolute inset-0 top-0 w-full h-[600px] z-20 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 5, 25], fov: 50 }}>
        {/* Lights to make the model visible and shiny */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 20, 10]} intensity={3} />
        <directionalLight position={[-10, -20, -10]} intensity={1} />
        <Environment preset="city" />
        
        <SpaceshipModel />
      </Canvas>
    </div>
  );
}
