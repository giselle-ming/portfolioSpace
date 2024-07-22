'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const randomChar = () => {
  return Math.random() > 0.5 ? '0' : '1';
};

const createRandomChain = (length) => {
  const chain = [];
  for (let i = 0; i < length; i++) {
    chain.push(randomChar());
  }
  return chain;
};

const MatrixRainBackground = (props) => {
  const groupRef = useRef();
  const [chains, setChains] = useState(() => {
    const chainArray = [];
    for (let i = 0; i < 100; i++) {
      chainArray.push({
        chain: createRandomChain(20), // Chains of length 20
        position: [Math.random() * 10 - 5, Math.random() * 20 - 10, Math.random() * 10 - 5],
        speed: Math.random() * 0.05 + 0.02,
      });
    }
    return chainArray;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setChains((chains) =>
        chains.map((chain) => ({
          ...chain,
          chain: createRandomChain(chain.chain.length),
        }))
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    setChains((chains) =>
      chains.map((chain) => {
        const newY = chain.position[1] - chain.speed;
        return {
          ...chain,
          position: [chain.position[0], newY < -10 ? 10 : newY, chain.position[2]],
        };
      })
    );
    if (groupRef.current) {
      groupRef.current.rotation.x -= 0.001;
      groupRef.current.rotation.y -= 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {chains.map((chainData, i) => (
        <group key={i} position={chainData.position}>
          {chainData.chain.map((char, j) => (
            <Text
              key={j}
              position={[0, -j * 0.2, 0]}
              fontSize={0.1}
              color={'#0f0'}
              anchorX={'center'}
              anchorY={'middle'}
              frustumCulled
              opacity={1 - j / chainData.chain.length} // Gradient opacity
              {...props}
            >
              {char}
            </Text>
          ))}
        </group>
      ))}
    </group>
  );
};

const MatrixCanvas = () => (
  <div className="w-full h-auto fixed inset-0 z-[20]">
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <MatrixRainBackground />
      </Suspense>
    </Canvas>
  </div>
);

export default MatrixCanvas;
