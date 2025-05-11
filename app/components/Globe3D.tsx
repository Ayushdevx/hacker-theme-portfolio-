"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Html } from "@react-three/drei";
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

// Animated Arc (network traffic)
const Arc = ({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) => {
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
  const points = useMemo(() => curve.getPoints(50), [curve]);
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
      <lineBasicMaterial attach="material" color={color} transparent opacity={0.7} linewidth={2} />
    </line>
  );
};

// Pulsing Node
const PulsingNode = ({ position, label }: { position: [number, number, number]; label: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + 0.3 * Math.sin(clock.getElapsedTime() * 3));
    }
  });
  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.018, 12, 12]} />
      <meshStandardMaterial emissive="#39ff14" color={hovered ? "#00ffff" : "#39ff14"} emissiveIntensity={hovered ? 3 : 2} />
      {hovered && (
        <Html distanceFactor={10} position={[0, 0.04, 0]} center>
          <div className="bg-black/90 border border-green-500 text-green-400 text-xs px-2 py-1 rounded shadow-lg animate-pulse-glow">
            <span className="font-mono">{label}</span>
          </div>
        </Html>
      )}
    </mesh>
  );
};

const Globe3D = () => {
  // Generate nodes and arcs
  const nodes = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => {
      const [lat, lon] = randomLatLon();
      return {
        pos: latLonToVec3(lat, lon, 1.01),
        label: `Node-${i + 1} | IP: 192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
      };
    }),
    []
  );
  const arcs = useMemo(() =>
    Array.from({ length: 10 }, () => {
      const a = nodes[Math.floor(Math.random() * nodes.length)].pos;
      const b = nodes[Math.floor(Math.random() * nodes.length)].pos;
      return { start: a, end: b, color: "#00ffff" };
    }),
    [nodes]
  );

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden bg-black/80 border border-green-500 relative">
      {/* Hacker HUD overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="w-full h-full animate-pulse-glow opacity-20 bg-gradient-to-br from-green-400/10 via-cyan-400/10 to-black" />
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30 animate-loading" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400/20 animate-loading" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-green-500/10" />
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-500/10" />
        {/* Matrix text */}
        <div className="absolute left-2 top-2 text-green-400/60 font-mono text-xs select-none animate-slide-down">SCANNING...</div>
        <div className="absolute right-2 bottom-2 text-cyan-400/60 font-mono text-xs select-none animate-slide-up">HACKER NETWORK</div>
      </div>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Stars radius={10} depth={50} count={500} factor={0.5} fade speed={2} />
        {/* Globe */}
        <Sphere args={[1, 64, 64]}>
          <meshStandardMaterial
            color="#0a0a0a"
            emissive="#39ff14"
            emissiveIntensity={0.08}
            metalness={0.2}
            roughness={0.7}
            wireframe
          />
        </Sphere>
        {/* Pulsing Nodes */}
        {nodes.map((node, i) => (
          <PulsingNode key={i} position={node.pos} label={node.label} />
        ))}
        {/* Animated Arcs */}
        {arcs.map((arc, i) => (
          <Arc key={i} start={arc.start} end={arc.end} color={arc.color} />
        ))}
        <OrbitControls enablePan enableZoom enableRotate autoRotate autoRotateSpeed={0.7} />
        <Html position={[0, -1.3, 0]} center>
          <div className="text-green-400 text-center text-xs bg-black/70 px-2 py-1 rounded shadow-lg border border-green-500 animate-pulse-glow">
            Interactive 3D Globe: Drag, Zoom, Explore
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default Globe3D; 