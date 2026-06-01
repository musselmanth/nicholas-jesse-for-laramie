'use client';
import { createContext, useContext, useState } from 'react';

const DonateContext = createContext();

export function DonateProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openDonate = () => setIsOpen(true);
  const closeDonate = () => setIsOpen(false);

  return (
    <DonateContext.Provider value={{ isOpen, openDonate, closeDonate }}>
      {children}
    </DonateContext.Provider>
  );
}

export const useDonate = () => useContext(DonateContext);