import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';

interface DaysWidgetProps {
  storage: ReturnType<typeof useDashboardStorage>;
}

// Mapa de datos curiosos por número de días
const curiousFacts: Record<number, string> = {
  92: '92 días: un trimestre entero que muchas empresas usan para planear su año, pero nosotros sólo planeamos seguirnos queriendo',
  93: '93 días es aproximadamente el tiempo que tarda una planta de café en pasar de floración a verde-maduro.',
  94: '94 días es lo que duran los monumentos megalíticos de Stonehenge durante su alineación especial en verano.',
  95: '95 días es casi 3 meses completos: el promedio de tiempo que tarda un ave migratoria en recorrer una ruta intercontinental.',
  96: '96 días: aproximadamente lo que tarda la luz de una supernova en viajar 94 millones de kilómetros.',
  97: '97 días: el promedio de juego de temporada que un equipo de béisbol profesional usa en algunos campeonatos.',
  98: '98 días: el ciclo lunar completo más 8 días extra, un recordatorio de que nuestro vínculo es más que un mes lunar.',
  99: '99 días: casi un siglo de días juntos, como un símbolo de casi-centenario de recuerdos.',
  100: '100 días: un hito clásico. Hoy marcamos 100 días de historias, risas y momentos que valen cada segundo.',
};

const FALLBACK_MESSAGE = 'Gracias por cada momento juntos.';

export function DaysWidget({ storage }: DaysWidgetProps) {
  const [displayedDays, setDisplayedDays] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const shouldReduceMotion = useReducedMotion();

  // Calcular días basado en la fecha actual
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
    if (!storage.startDate) return;

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
  }, [storage.startDate]);

  // Calcular y animar los días cuando cambia la fecha actual o startDate
  useEffect(() => {
    if (!storage.startDate) return;

    const totalDays = calculateDays(storage.startDate, currentDate);

    if (shouldReduceMotion) {
      setDisplayedDays(totalDays);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const increment = totalDays / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalDays) {
        setDisplayedDays(totalDays);
        clearInterval(timer);
      } else {
        setDisplayedDays(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [storage.startDate, currentDate, shouldReduceMotion]);

  const formatDate = (dateString: string) => {
    // Parsear la fecha correctamente para evitar problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month es 0-indexed en Date
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getCuriousFact = (days: number): string => {
    return curiousFacts[days] || FALLBACK_MESSAGE;
  };

  const cardClass = "bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] h-full flex flex-col p-6 md:p-7";

  if (!storage.startDate) {
    return (
      <div className={cardClass}>
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays className="w-6 h-6 text-primary flex-shrink-0" />
          <h3 className="text-lg font-semibold text-text">Dias Juntos</h3>
        </div>
        <div className="flex-1 flex items-center">
          <p className="text-text-muted text-sm">
            Configura la fecha de inicio para comenzar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="w-6 h-6 text-primary flex-shrink-0" />
        <h3 className="text-lg font-semibold text-text">Días juntos</h3>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-primary mb-3"
        >
          {displayedDays}
        </motion.div>
        <p className="text-text-muted text-base md:text-lg mb-3">
          Desde {formatDate(storage.startDate)}
        </p>
        <p className="text-text-muted text-sm md:text-base leading-relaxed">
          {getCuriousFact(displayedDays)}
        </p>
      </div>
    </div>
  );
}

