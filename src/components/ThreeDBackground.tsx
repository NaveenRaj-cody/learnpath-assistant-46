
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const GraduationCapWithDiploma = ({ position, rotationSpeed = 0.01 }) => {
  const group = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useFrame(() => {
    if (group.current) {
      // Full 360-degree rotation on all axes
      group.current.rotation.y += rotationSpeed;
      group.current.rotation.x += rotationSpeed * 0.3;
      group.current.rotation.z += rotationSpeed * 0.1;
      group.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.2;
    }
  });

  return (
    <group position={position} ref={group}>
      {/* Cap Base - Cylindrical part */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
        <meshStandardMaterial 
          color={isDark ? "#0f172a" : "#1e3a8a"} 
          transparent
          opacity={0.9}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Cap Top - Square part */}
      <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 1.8]} />
        <meshStandardMaterial 
          color={isDark ? "#0f172a" : "#1e3a8a"} 
          transparent
          opacity={0.9}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Tassel Button */}
      <mesh position={[0, 0.31, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color={isDark ? "#0f172a" : "#0d2b76"} />
      </mesh>
      
      {/* Tassel String */}
      <mesh position={[0.6, 0.1, 0.6]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <meshStandardMaterial color={isDark ? "#f59e0b" : "#fbbf24"} />
      </mesh>
      
      {/* Tassel End */}
      <mesh position={[0.6, -0.3, 0.6]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
        <meshStandardMaterial color={isDark ? "#1e3a8a" : "#1e40af"} />
      </mesh>
      
      {/* Diploma */}
      <group position={[1.5, 0, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        {/* Diploma Scroll */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.2, 1.2, 16, 1, true]} />
          <meshStandardMaterial 
            color={isDark ? "#fef3c7" : "#fef9c3"} 
            side={THREE.DoubleSide} 
            transparent
            opacity={0.95}
          />
        </mesh>
        
        {/* Diploma End Caps */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
          <meshStandardMaterial color={isDark ? "#fef3c7" : "#fef9c3"} />
        </mesh>
        
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
          <meshStandardMaterial color={isDark ? "#fef3c7" : "#fef9c3"} />
        </mesh>
        
        {/* Diploma Ribbon */}
        <mesh position={[0, 0, 0]} castShadow>
          <torusGeometry args={[0.25, 0.05, 16, 100, Math.PI * 0.5]} />
          <meshStandardMaterial color={isDark ? "#dc2626" : "#ef4444"} />
        </mesh>
      </group>
    </group>
  );
};

const FloatingGraduationItems = () => {
  // Reduce the number of items to improve performance and reduce text overlap
  const items = Array.from({ length: 10 }).map((_, i) => ({
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20 - 5 // Push items back a bit to reduce text overlap
    ],
    speed: Math.random() * 0.01 + 0.001
  }));

  return (
    <>
      {items.map((item, i) => (
        <GraduationCapWithDiploma 
          key={i} 
          position={item.position} 
          rotationSpeed={item.speed} 
        />
      ))}
    </>
  );
};

const ThreeDBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 60 }}
        shadows
        dpr={[1, 2]} // Optimize rendering for different device pixel ratios
        gl={{ 
          antialias: true,
          alpha: true, 
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true // Helps with z-fighting
        }}
      >
        <ambientLight intensity={isDark ? 0.3 : 0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={isDark ? 0.5 : 0.8}
          color={isDark ? "#8b5cf6" : "#ffffff"}
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={isDark ? 0.2 : 0.5} 
          color={isDark ? "#4c1d95" : "#c4b5fd"} 
        />
        
        {/* Add a subtle, semi-transparent plane that helps with depth perception */}
        <mesh position={[0, 0, -10]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color={isDark ? "#020617" : "#f1f5f9"} 
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <FloatingGraduationItems />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          rotateSpeed={0.5} // Slow down rotation for better text reading
        />
        <fog attach="fog" args={[isDark ? "#020617" : "#f8fafc", 5, 30]} />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;
