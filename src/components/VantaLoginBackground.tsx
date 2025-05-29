
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Define Vanta type since it doesn't have TypeScript definitions
declare global {
  interface Window {
    VANTA: any;
  }
}

interface VantaLoginBackgroundProps {
  effect?: 'waves' | 'fog' | 'net' | 'clouds';
}

const VantaLoginBackground: React.FC<VantaLoginBackgroundProps> = ({ effect = 'waves' }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    // Load Vanta.js script dynamically
    const loadVanta = async () => {
      if (!window.VANTA) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js';
        script.onload = initVanta;
        document.head.appendChild(script);
      } else {
        initVanta();
      }
    };

    const initVanta = () => {
      if (vantaRef.current && window.VANTA) {
        vantaEffect.current = window.VANTA.WAVES({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x10b981,
          shininess: 30.00,
          waveHeight: 15.00,
          waveSpeed: 1.00,
          zoom: 0.75
        });
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [effect]);

  return (
    <div 
      ref={vantaRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ zIndex: -1 }}
    />
  );
};

export default VantaLoginBackground;
