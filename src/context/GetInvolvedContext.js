'use client';

import { createContext, useContext, useState } from 'react';

const GetInvolvedContext = createContext();

export function GetInvolvedProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openGetInvolved = () => setIsOpen(true);
  const closeGetInvolved = () => setIsOpen(false);

  return (
    <GetInvolvedContext.Provider value={{ isOpen, openGetInvolved, closeGetInvolved }}>
      {children}
    </GetInvolvedContext.Provider>
  );
}

// Custom hook to use the context easily
export const useGetInvolved = () => {
  const context = useContext(GetInvolvedContext);
  if (!context) {
    throw new Error('useGetInvolved must be used within a GetInvolvedProvider');
  }
  return context;
};