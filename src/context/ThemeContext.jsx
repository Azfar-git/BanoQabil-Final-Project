import React, { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export function CustomThemeProvider({ children, value }) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within CustomThemeProvider");
  }
  return context;
}
