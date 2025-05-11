'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

interface ProfileSphereProps {
  imageUrl: string;
  glitching: boolean;
  onInteract: () => void;
}

function ProfileSphere({ imageUrl, glitching, onInteract }: ProfileSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
  
  // Handle texture loading with error handling
  const texture = useTexture(imageUrl);
  
  // Set texture loaded state when texture is available
  useEffect(() => {
    if (texture) {
      setTextureLoaded(true);
    }
  }, [texture]);
  
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { viewport } = useThree();
  
  // Handle click event
  const handleClick = () => {
    setClicked(!clicked);
    onInteract();
  };
  
  // Create custom shader for the holographic effect
  const shader = {
    uniforms: {
      time: { value: 0 },
      texture: { value: texture },
      glitchIntensity: { value: 0 },
      hoverIntensity: { value: 0 },
      clickIntensity: { value: 0 },
      textureLoaded: { value: textureLoaded ? 1.0 : 0.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      uniform float glitchIntensity;
      uniform float hoverIntensity;
      uniform float clickIntensity;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Add subtle wave animation
        vec3 pos = position;
        float glitchOffset = glitchIntensity * sin(position.x * 10.0 + time) * 0.02;
        float hoverOffset = hoverIntensity * sin(position.y * 5.0 + time * 2.0) * 0.03;
        float clickOffset = clickIntensity * sin(position.z * 8.0 + time * 3.0) * 0.05;
        
        pos.z += sin(position.x * 3.0 + time) * 0.02 + glitchOffset + hoverOffset + clickOffset;
        pos.x += cos(position.y * 4.0 + time * 0.5) * 0.02;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform sampler2D texture;
      uniform float time;
      uniform float glitchIntensity;
      uniform float hoverIntensity;
      uniform float clickIntensity;
      
      void main() {
        // Base color from texture
        vec2 uv = vUv;
        
        // Add glitch effect when triggered
        if (glitchIntensity > 0.0) {
          if (fract(time * 10.0) > 0.8) {
            uv.x += sin(uv.y * 20.0) * 0.01 * glitchIntensity;
            uv.y += cos(uv.x * 15.0) * 0.01 * glitchIntensity;
          }
        }
        
        // Add hover distortion
        if (hoverIntensity > 0.0) {
          float distort = sin(uv.y * 20.0 + time * 3.0) * 0.01 * hoverIntensity;
          uv.x += distort;
        }
        
        // Add click effect - pixelation
        if (clickIntensity > 0.0) {
          float pixelSize = 0.02 * clickIntensity;
          uv = floor(uv / pixelSize) * pixelSize;
        }
        
        vec4 color = texture2D(texture, uv);
        
        // Add holographic scan line
        float scanLine = sin(vUv.y * 30.0 - time * 5.0) * 0.5 + 0.5;
        scanLine = pow(scanLine, 8.0) * 0.5;
        
        // Add edge glow
        float edge = length(vPosition.xy);
        float edgeGlow = smoothstep(0.4, 0.5, edge) * 0.5;
        
        // Add hover glow
        float hoverGlow = hoverIntensity * 0.2;
        
        // Add click pulse
        float clickPulse = clickIntensity * sin(time * 10.0) * 0.2;
        
        // Combine effects
        color.rgb += vec3(0.2, 1.0, 0.4) * scanLine * 0.3;
        color.rgb += vec3(0.1, 0.7, 0.3) * edgeGlow;
        color.rgb += vec3(0.5, 1.0, 0.5) * hoverGlow;
        color.rgb += vec3(0.0, 1.0, 0.2) * clickPulse;
        
        // Add subtle hexagonal pattern
        float hexPattern = 0.0;
        for (float i = 0.0; i < 6.0; i++) {
          float angle = i * 3.14159 / 3.0;
          vec2 dir = vec2(cos(angle), sin(angle));
          hexPattern += sin(dot(vUv * 20.0, dir) + time * 0.5) * 0.1;
        }
        color.rgb += vec3(0.0, hexPattern, hexPattern * 0.5) * 0.1;
        
        gl_FragColor = color;
      }
    `,
  };

  // Create material with the custom shader
  const material = useRef(
    new THREE.ShaderMaterial({
      uniforms: shader.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    })
  );

  // Update shader time uniform
  useFrame((state) => {
    if (meshRef.current) {
      // Basic rotation
      meshRef.current.rotation.y += 0.005;
      
      // Update shader uniforms
      material.current.uniforms.time.value = state.clock.getElapsedTime();
      material.current.uniforms.glitchIntensity.value = glitching ? 1.0 : 0.0;
      material.current.uniforms.hoverIntensity.value = hovered ? 1.0 : 0.0;
      material.current.uniforms.clickIntensity.value = clicked ? 1.0 : 0.0;
      
      // Add pulsing animation if hovered
      if (hovered) {
        meshRef.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
        meshRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
        meshRef.current.scale.z = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
      } else {
        meshRef.current.scale.x = 1;
        meshRef.current.scale.y = 1;
        meshRef.current.scale.z = 1;
      }
      
      // Add more dynamic rotation on click
      if (clicked) {
        meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
        meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.1;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={material.current} attach="material" />
    </mesh>
  );
}

function ScannerEffect({ radius = 1.2 }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      // Move the scanner effect up and down
      const scannerPos = Math.sin(clock.getElapsedTime() * 0.5) * 0.8;
      ref.current.position.y = scannerPos;
      
      // Make the scanner effect fade in and out
      const opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
      if (ref.current.material instanceof THREE.Material) {
        ref.current.material.opacity = opacity;
      }
    }
  });
  
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius, 64]} />
      <meshBasicMaterial 
        color={new THREE.Color(0x39ff14)} 
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function HolographicParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const count = 100;
  
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 0.3;
      
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    
    setPositions(positions);
  }, []);
  
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    particlesRef.current.rotation.y += 0.001;
    
    // Pulse particles
    const time = clock.getElapsedTime();
    if (particlesRef.current.material instanceof THREE.Material) {
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.size = 0.03 + Math.sin(time * 3) * 0.01;
    }
  });
  
  if (!positions) return null;
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          array={positions} 
          count={positions.length / 3} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        color={new THREE.Color(0x39ff14)} 
        size={0.03} 
        transparent
        opacity={0.8}
      />
    </points>
  );
}

interface ProfilePic3DProps {
  imageUrl: string;
  glitching?: boolean;
  className?: string;
}

const ProfilePic3D = ({ imageUrl, glitching = false, className = "" }: ProfilePic3DProps) => {
  const [statusText, setStatusText] = useState<string | null>(null);
  const [fallbackActive, setFallbackActive] = useState(false);
  
  const handleInteraction = () => {
    // Generate random hacking/security related status messages
    const messages = [
      "SCAN COMPLETE",
      "IDENTITY VERIFIED",
      "SECURITY LEVEL: HIGH",
      "ANALYZING BIOMETRICS",
      "ACCESS GRANTED",
      "ENCRYPTION ACTIVE",
      "QUANTUM SCANNING",
      "NEURAL MAPPING"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setStatusText(randomMessage);
    
    // Clear status text after 2 seconds
    setTimeout(() => {
      setStatusText(null);
    }, 2000);
  };

  // Handle potential errors with 3D rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if Canvas might be causing issues and set fallback
      try {
        const element = document.querySelector('.profile-3d-canvas');
        const computed = element && window.getComputedStyle(element);
        if (!element || !computed || computed.height === '0px' || computed.visibility === 'hidden') {
          setFallbackActive(true);
        }
      } catch (e) {
        console.error('Error checking 3D profile rendering:', e);
        setFallbackActive(true);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // If 3D fails, show a fallback 2D image with effects
  if (fallbackActive) {
    return (
      <div className={`w-full h-full ${className} relative overflow-hidden`}>
        <img 
          src={imageUrl} 
          alt="Profile" 
          className={`w-full h-full object-cover ${glitching ? 'glitch-effect' : ''}`}
          onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
        />
        <div className="absolute inset-0 border-2 border-green-500 rounded-full pointer-events-none"></div>
        <div 
          className="absolute left-0 w-full h-1 bg-green-500 opacity-70"
          style={{ 
            top: `${(Math.sin(Date.now() / 1000) + 1) * 50}%`,
            animation: 'scanline 3s linear infinite',
            boxShadow: '0 0 10px rgba(57, 255, 20, 0.7)'
          }}
        ></div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className} relative profile-3d-container`}>
      <Canvas className="profile-3d-canvas" camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ProfileSphere imageUrl={imageUrl} glitching={glitching} onInteract={handleInteraction} />
        <ScannerEffect />
        <HolographicParticles />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
        <Environment preset="city" />
          {/* Status text displayed as HTML overlay instead of 3D text */}
        {statusText && (
          <group position={[0, -1.5, 0]}>
            <mesh>
              <planeGeometry args={[2, 0.3]} />
              <meshBasicMaterial color="black" transparent opacity={0.7} />
            </mesh>
          </group>
        )}
      </Canvas>
        {/* Status text overlay */}
      {statusText && (
        <div className="absolute top-1/2 left-0 right-0 text-center font-mono text-sm text-green-500 font-bold bg-black bg-opacity-70 py-1 transform -translate-y-1/2">
          {statusText}
        </div>
      )}
      
      {/* Overlay instructions */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-green-400 opacity-0 hover:opacity-70 transition-opacity bg-black bg-opacity-50 py-1">
        Click to interact • Drag to rotate
      </div>
    </div>
  );
};

export default ProfilePic3D;
