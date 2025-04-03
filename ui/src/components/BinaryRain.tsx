import React, { useEffect, useRef } from 'react';

interface BinaryRainProps {
  active: boolean;
}

/**
 * Binary rain animation component that renders on a canvas
 * Only runs when active prop is true
 */
const BinaryRain: React.FC<BinaryRainProps> = ({ active }) => {
  // Canvas reference
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Animation frame reference for cleanup
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Full screen canvas
    const resizeCanvas = () => {
      const headerContainer = canvas.parentElement;
      if (headerContainer) {
        canvas.width = headerContainer.offsetWidth;
        canvas.height = headerContainer.offsetHeight;
      }
    };

    // Initial resize and setup resize listener
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Binary rain configuration
    const fontSize = 10;
    const columns = Math.floor(canvas.width / fontSize);

    // Create an array for the Y positions of each column
    const drops: number[] = Array(columns).fill(1);

    // Characters to use (binary characters - 0s and 1s)
    const chars = '01';

    // Drawing function
    const draw = () => {
      // Semi-transparent black to create the fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lemon color text for the Binary effect
      ctx.fillStyle = '#F4E878'; // Lemon color
      ctx.font = `${fontSize}px monospace`;

      // Loop through drops array
      for (let i = 0; i < drops.length; i++) {
        // Get a random binary character
        const text = chars.charAt(Math.floor(Math.random() * chars.length));

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset position when off screen or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drops down
        drops[i]++;
      }

      // Request next animation frame if still active
      if (active) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(draw);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 0.3s ease' }}
    />
  );
};

export default BinaryRain;