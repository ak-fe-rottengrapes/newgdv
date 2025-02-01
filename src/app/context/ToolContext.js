'use client';
import { createContext, useContext, useState } from 'react';

const ToolContext = createContext();

export function ToolProvider({ children }) {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <ToolContext.Provider value={{ activeTool, setActiveTool }}>
      {children}
    </ToolContext.Provider>
  );
}

export const useTool = () => useContext(ToolContext); 