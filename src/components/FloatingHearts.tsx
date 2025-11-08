import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Create initial hearts
    const initialHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // random horizontal position (0-100%)
      size: Math.random() * 20 + 10, // random size (10-30px)
      delay: Math.random() * 5, // random delay (0-5s)
      duration: Math.random() * 10 + 15, // random duration (15-25s)
    }));

    setHearts(initialHearts);

    // Add new hearts periodically
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 100,
          size: Math.random() * 20 + 10,
          delay: 0,
          duration: Math.random() * 10 + 15,
        },
      ]);
    }, 3000);

    // Clean up old hearts to prevent memory issues
    const cleanup = setInterval(() => {
      setHearts((prev) => {
        if (prev.length > 30) {
          return prev.slice(prev.length - 30);
        }
        return prev;
      });
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            fontSize: `${heart.size}px`,
            color: 'var(--text-muted)',
            opacity: 0.3,
          }}
          initial={{
            x: `${heart.x}vw`,
            y: '100vh',
            opacity: 0.3,
            rotate: -10,
          }}
          animate={{
            y: '-20vh',
            opacity: 0,
            rotate: 10,
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: 'linear',
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}

