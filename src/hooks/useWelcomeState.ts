import { useState, useEffect } from 'react';

const WELCOME_DISMISSED_KEY = 'welcome_dismissed';
const WELCOME_SKIP_KEY = 'welcome_skip';

export function useWelcomeState() {
  const [shouldShowWelcome, setShouldShowWelcome] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Siempre mostrar la bienvenida primero al entrar
    // Solo verificar si el usuario marcó "No volver a mostrar" (skip)
    const skipWelcome = localStorage.getItem(WELCOME_SKIP_KEY) === 'true';
    
    // Si skip está activo, no mostrar bienvenida
    // De lo contrario, siempre mostrar la bienvenida primero
    setShouldShowWelcome(!skipWelcome);
    setIsLoading(false);
  }, []);

  const dismissWelcome = (skip: boolean = false) => {
    localStorage.setItem(WELCOME_DISMISSED_KEY, 'true');
    if (skip) {
      localStorage.setItem(WELCOME_SKIP_KEY, 'true');
    }
    setShouldShowWelcome(false);
  };

  const resetWelcome = () => {
    localStorage.removeItem(WELCOME_DISMISSED_KEY);
    localStorage.removeItem(WELCOME_SKIP_KEY);
    setShouldShowWelcome(true);
  };

  return {
    shouldShowWelcome,
    dismissWelcome,
    resetWelcome,
    isLoading,
  };
}

