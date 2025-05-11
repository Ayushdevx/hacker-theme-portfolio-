'use client';

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

// Helper to generate random lat/lon points
function randomLatLon() {
  const lat = Math.acos(2 * Math.random() - 1) - Math.PI / 2;
  const lon = Math.random() * 2 * Math.PI;
  return [lat, lon];
}

// Convert lat/lon to 3D position on sphere
function latLonToVec3(lat, lon, r = 1.01) {
  return [
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.sin(lat),
    r * Math.cos(lat) * Math.sin(lon),
  ];
}

// Pulsing Node
const PulsingNode = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + 0.3 * Math.sin(clock.getElapsedTime() * 3));
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial emissive="#39ff14" color="#39ff14" emissiveIntensity={2} />
    </mesh>
  );
};

// Animated Arc
const Arc = ({ start, end }: { start: [number, number, number]; end: [number, number, number] }) => {
  const ref = useRef<THREE.Line>(null);
  const [phase] = useState(Math.random() * Math.PI * 2);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (Math.sin(clock.getElapsedTime() * 1.5 + phase) + 1) / 2;
      ref.current.material.opacity = 0.3 + 0.7 * t;
    }
  });
  
  // Create a curve between start and end
  const curve = useMemo(() => {
    const mid = [
      (start[0] + end[0]) / 2 + 0.2 * (Math.random() - 0.5),
      (start[1] + end[1]) / 2 + 0.2 * (Math.random() - 0.5),
      (start[2] + end[2]) / 2 + 0.2 * (Math.random() - 0.5),
    ];
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
  }, [start, end]);
  
  const points = useMemo(() => curve.getPoints(30), [curve]);
  
  return (
    <line ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#39ff14" transparent opacity={0.7} />
    </line>
  );
};

const ProfileGlobe = () => {
  // Generate fewer nodes and arcs for profile version
  const nodes = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const [lat, lon] = randomLatLon();
      return {
        pos: latLonToVec3(lat, lon, 1.01),
      };
    }),
    []
  );
  
  const arcs = useMemo(() =>
    Array.from({ length: 5 }, () => {
      const a = nodes[Math.floor(Math.random() * nodes.length)].pos;
      const b = nodes[Math.floor(Math.random() * nodes.length)].pos;
      return { start: a, end: b };
    }),
    [nodes]
  );

  return (
    <div className="w-full h-full rounded-full overflow-hidden">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Stars radius={10} depth={50} count={200} factor={0.5} fade speed={1} />
        
        {/* Globe */}
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color="#0a0a0a"
            emissive="#39ff14"
            emissiveIntensity={0.1}
            metalness={0.2}
            roughness={0.7}
            wireframe
            transparent
            opacity={0.8}
          />
        </Sphere>
        
        {/* Nodes */}
        {nodes.map((node, i) => (
          <PulsingNode key={i} position={node.pos} />
        ))}
        
        {/* Arcs */}
        {arcs.map((arc, i) => (
          <Arc key={i} start={arc.start} end={arc.end} />
        ))}
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
};

export default ProfileGlobe;
