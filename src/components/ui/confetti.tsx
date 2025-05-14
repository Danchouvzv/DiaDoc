import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  numberOfPieces?: number;
  recycle?: boolean;
  duration?: number;
}

export function Confetti({ 
  numberOfPieces = 150, 
  recycle = false,
  duration = 5000 
}: ConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Set dimensions for the confetti when component mounts
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Listen for window resize events to update confetti dimensions
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Auto hide the confetti after the duration
    if (!recycle) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, duration);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [recycle, duration]);

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={numberOfPieces}
      recycle={recycle}
      colors={[
        '#00A3FF', // Primary
        '#00DDFF', // Accent
        '#22C55E', // Success green
        '#F3F4F6', // Light gray
        '#FFFFFF', // White
      ]}
      gravity={0.15}
    />
  );
} 