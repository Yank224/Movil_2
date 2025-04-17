import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos permitidos para el idioma
type SupportedLanguage = 'es' | 'en';

// Estructura del contexto
type LanguageContextType = {
  language: SupportedLanguage;
  toggleLanguage: () => void;
};

// Crear contexto con tipo undefined por defecto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider que envolverá la app
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('es');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para acceder al contexto
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

