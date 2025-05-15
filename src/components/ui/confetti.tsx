import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  numberOfPieces?: number;
  recycle?: boolean;
  duration?: number;
  fadeOutDuration?: number;
  tweenDuration?: number;
  initialVelocityY?: number;
  wind?: number;
}

export function Confetti({ 
  numberOfPieces = 150, 
  recycle = false,
  duration = 10000,
  fadeOutDuration = 5000,
  tweenDuration = 12000,
  initialVelocityY = 10,
  wind = 0.02
}: ConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);
  const [opacity, setOpacity] = useState(1);

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
      // Start fading out after (duration - fadeOutDuration)
      const fadeOutStart = Math.max(0, duration - fadeOutDuration);
      
      // Start fade out timer
      const fadeTimer = setTimeout(() => {
        // Gradually decrease opacity
        const fadeInterval = setInterval(() => {
          setOpacity((prevOpacity) => {
            const newOpacity = prevOpacity - 0.02;
            if (newOpacity <= 0) {
              clearInterval(fadeInterval);
              return 0;
            }
            return newOpacity;
          });
        }, 150);
        
        // Clean up fade interval after it completes
        setTimeout(() => {
          clearInterval(fadeInterval);
        }, fadeOutDuration + 200);
      }, fadeOutStart);
      
      // Set timer to fully hide component
      const hideTimer = setTimeout(() => {
        setShowConfetti(false);
      }, duration);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [recycle, duration, fadeOutDuration]);

  if (!showConfetti) return null;

  // Beautiful gradient-like colors for a more elegant effect
  const confettiColors = [
    // Elegant blues and purples (light theme)
    '#818cf8', // Indigo light
    '#a5b4fc', // Indigo lighter
    '#c4b5fd', // Violet light
    '#ddd6fe', // Violet lighter
    '#e9d5ff', // Purple light
    
    // Pink accents for contrast
    '#f9a8d4', // Pink light
    '#fbcfe8', // Pink lighter
    
    // Light blues
    '#93c5fd', // Blue light
    '#bfdbfe', // Blue lighter
    
    // Small touch of gold/yellow
    '#fcd34d', // Amber light
  ];

  return (
    <div style={{ opacity, transition: 'opacity 1.2s ease-out', position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }}>
      <ReactConfetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={numberOfPieces}
        recycle={recycle}
        colors={confettiColors}
        gravity={0.05}
        initialVelocityY={initialVelocityY}
        tweenDuration={tweenDuration}
        wind={wind}
        friction={0.97}
        confettiSource={{
          x: dimensions.width / 2,
          y: -20,
          w: dimensions.width / 1.8, 
          h: 5
        }}
        drawShape={ctx => {
          // Mix of different shapes for a more varied effect
          const random = Math.random();
          
          // Draw circles for 30% of particles (soft, rounded look)
          if (random < 0.3) {
            ctx.beginPath();
            ctx.arc(0, 0, 5 * Math.random() + 4, 0, 2 * Math.PI);
            ctx.fill();
            return;
          }
          
          // Draw stars for 20% of particles (festive, special)
          if (random < 0.5) {
            const spikes = 5;
            const outerRadius = 6 * Math.random() + 3;
            const innerRadius = outerRadius / 2;
            
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / spikes;
              ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
            ctx.closePath();
            ctx.fill();
            return;
          }
          
          // Draw hearts for 10% of particles (cute, celebratory)
          if (random < 0.6) {
            const size = 6 * Math.random() + 4;
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.bezierCurveTo(
              size / 2, -size, 
              size, -size / 2, 
              0, size / 2
            );
            ctx.bezierCurveTo(
              -size, -size / 2, 
              -size / 2, -size, 
              0, -size / 2
            );
            ctx.fill();
            return;
          }
          
          // Rectangle/diamond shapes for the rest (classic confetti)
          ctx.fillRect(-3, -3, 6 * Math.random() + 3, 6 * Math.random() + 3);
        }}
      />
    </div>
  );
} 