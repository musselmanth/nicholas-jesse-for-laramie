'use client';

import { createContext, useContext, useState } from 'react';

const YardSignContext = createContext();

export function YardSignProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openYardSign = () => setIsOpen(true);
  const closeYardSign = () => setIsOpen(false);

  return (
    <YardSignContext.Provider value={{ isOpen, openYardSign, closeYardSign }}>
      {children}
    </YardSignContext.Provider>
  );
}

// Custom hook to use the context easily
export const useYardSign = () => {
  const context = useContext(YardSignContext);
  if (!context) {
    throw new Error('useYardSign must be used within a YardSignProvider');
  }
  return context;
};
