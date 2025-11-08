import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { welcomeConfig } from '../../config/welcomeConfig';
import './Welcome.css';

interface WelcomeProps {
  onEnter: () => void;
}

export function Welcome({ onEnter }: WelcomeProps) {
  const [daysTogether, setDaysTogether] = useState<number>(0);
  const [displayedDays, setDisplayedDays] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [heartClicks, setHeartClicks] = useState<number>(0);
  const [showEasterEgg, setShowEasterEgg] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Calcular días juntos
  // Usamos el mismo método que DaysWidget para consistencia
  const START_DATE_STRING = '2025-08-07'; // Fecha fija: 7 de agosto de 2025 (debe coincidir con useDashboardStorage)
  const [currentDate, setCurrentDate] = useState(new Date());

  // Función para calcular días (igual que DaysWidget)
  const calculateDays = (startDate: string, today: Date): number => {
    // Parsear la fecha correctamente para evitar problemas de zona horaria
    const [year, month, day] = startDate.split('-').map(Number);
    const start = new Date(year, month - 1, day); // month es 0-indexed en Date
    // Normalizar ambas fechas a medianoche para calcular días completos
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startNormalized = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const diffTime = Math.abs(todayNormalized.getTime() - startNormalized.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Actualizar la fecha actual periódicamente para detectar cambios de día
  useEffect(() => {
    // Calcular cuánto tiempo falta hasta la medianoche
    const updateDate = () => {
      setCurrentDate(new Date());
    };

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Actualizar inmediatamente
    updateDate();

    // Configurar timer para actualizar a medianoche
    const midnightTimer = setTimeout(() => {
      updateDate();
    }, msUntilMidnight);

    // Configurar intervalo para verificar cada hora (por si el usuario cambia la hora del sistema)
    const hourlyCheck = setInterval(() => {
      updateDate();
    }, 60 * 60 * 1000); // Cada hora

    return () => {
      clearTimeout(midnightTimer);
      clearInterval(hourlyCheck);
    };
  }, []);

  // Calcular días cuando cambia la fecha actual
  useEffect(() => {
    const totalDays = calculateDays(START_DATE_STRING, currentDate);
    setDaysTogether(totalDays);
  }, [currentDate]);

  // Animar contador de días
  useEffect(() => {
    if (daysTogether === 0) return;

    const duration = shouldReduceMotion ? 0 : 2000; // 2 segundos
    const steps = shouldReduceMotion ? 1 : 60;
    const increment = daysTogether / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= daysTogether) {
        setDisplayedDays(daysTogether);
        clearInterval(timer);
      } else {
        setDisplayedDays(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [daysTogether, shouldReduceMotion]);

  // Animación del fondo con gradientes radiales mejorados
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    if (prefersReducedMotion) {
      // Fondo estático con gradientes radiales sutiles (Monocromático Claro)
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Añadir gradientes radiales estáticos con paleta monocromática clara
      const grad1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, 300
      );
      grad1.addColorStop(0, 'rgba(232, 232, 232, 0.3)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const grad2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.7, 0,
        canvas.width * 0.8, canvas.height * 0.7, 400
      );
      grad2.addColorStop(0, 'rgba(216, 216, 216, 0.3)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationId: number | undefined;
    let time = 0;

    const animate = () => {
      time += 0.0015; // Más lento para mejor rendimiento
      
      // Limpiar canvas con fondo base (Monocromático Claro)
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Crear múltiples gradientes radiales en movimiento más suaves con paleta monocromática clara
      const gradients = [
        {
          x: canvas.width * 0.2 + Math.sin(time) * 60,
          y: canvas.height * 0.3 + Math.cos(time * 0.7) * 50,
          radius: 400 + Math.sin(time * 0.5) * 50,
          color: 'rgba(232, 232, 232, 0.15)',
        },
        {
          x: canvas.width * 0.8 + Math.cos(time * 0.8) * 80,
          y: canvas.height * 0.7 + Math.sin(time * 0.6) * 60,
          radius: 500 + Math.cos(time * 0.4) * 60,
          color: 'rgba(216, 216, 216, 0.12)',
        },
        {
          x: canvas.width * 0.5 + Math.sin(time * 1.2) * 50,
          y: canvas.height * 0.5 + Math.cos(time * 0.9) * 40,
          radius: 300 + Math.sin(time * 0.6) * 40,
          color: 'rgba(112, 112, 112, 0.08)',
        },
      ];

      gradients.forEach((grad) => {
        const gradient = ctx.createRadialGradient(
          grad.x,
          grad.y,
          0,
          grad.x,
          grad.y,
          grad.radius
        );
        gradient.addColorStop(0, grad.color);
        gradient.addColorStop(0.6, grad.color.replace('0.12', '0.06').replace('0.1', '0.05').replace('0.08', '0.04'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 500); // Esperar a que termine el fade-out
  };

  const handleHeartClick = () => {
    const newClicks = heartClicks + 1;
    setHeartClicks(newClicks);
    
    if (newClicks >= 5) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
      setHeartClicks(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      handleEnter();
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.3,
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const
      }
    },
    hover: {
      scale: shouldReduceMotion ? 1 : 1.02,
      y: shouldReduceMotion ? 0 : -2,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1] as const
      }
    },
    tap: {
      scale: 0.98
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  const heartVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: shouldReduceMotion ? 1 : 1.1,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.9,
      transition: { duration: 0.1 }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatDelay: 1.5
      }
    }
  };

  return (
    <div className="welcome-container" onKeyDown={handleKeyDown}>
      <canvas
        ref={canvasRef}
        className="welcome-background"
        aria-hidden="true"
      />
      
      <motion.header 
        className="welcome-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.2 }}
      >
        <motion.div 
          className="welcome-logo"
          onClick={handleHeartClick}
          style={{ cursor: 'pointer' }}
          variants={heartVariants}
          initial="rest"
          animate={showEasterEgg ? "pulse" : "rest"}
          whileHover="hover"
          whileTap="tap"
        >
          {welcomeConfig.logo}
        </motion.div>
        <AnimatePresence>
          {showEasterEgg && (
            <motion.div
              className="easter-egg-message"
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              Te amo mucho ❤️
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="welcome-main">
        <AnimatePresence mode="wait">
          {!isExiting && (
            <motion.div
              className="welcome-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h1 
                className="welcome-title"
                variants={itemVariants}
              >
                {welcomeConfig.title}
              </motion.h1>
              
              <motion.p 
                className="welcome-subtitle"
                variants={itemVariants}
              >
                {welcomeConfig.subtitle}
              </motion.p>
              
              <motion.div 
                className="welcome-letter"
                variants={itemVariants}
              >
                <p className="welcome-body">
                  {welcomeConfig.letter}
                </p>
                
                <div className="welcome-signature">
                  <p className="welcome-signature-text">{welcomeConfig.signature}</p>
                  <motion.p 
                    className="welcome-date"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.8 }}
                  >
                    {displayedDays > 0 ? `${displayedDays} días contigo` : 'Desde siempre'}
                  </motion.p>
                </div>
              </motion.div>

              <motion.div 
                className="welcome-actions"
                variants={itemVariants}
              >
                <motion.button
                  className="welcome-cta"
                  onClick={handleEnter}
                  aria-label="Entrar al dashboard"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  animate={isExiting ? "exit" : "visible"}
                >
                  Entrar al dashboard
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.footer 
        className="welcome-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.4 }}
      >
        <p>
          Hecho por Jonas — {new Date().getFullYear()} · Un espacio que crece con nosotros
        </p>
      </motion.footer>
    </div>
  );
}
