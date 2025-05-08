import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definir la interfaz para el contexto de idioma
interface LanguageContextProps {
  language: 'en' | 'es'; // Solo 'en' o 'es'
  toggleLanguage: () => void; // Función para cambiar entre los idiomas
}

// Crear el contexto con un valor predeterminado de undefined
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Componente LanguageProvider que envolverá a los componentes hijos para proporcionar el idioma
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado que maneja el idioma actual, por defecto es 'en'
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  // Función para alternar entre 'en' y 'es'
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'es' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado useLanguage para acceder al contexto del idioma
export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);

  // Si el contexto no está disponible, lanzamos un error
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
