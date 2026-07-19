import { createContext, useState, useContext, useEffect } from "react";

/**
 * React context instance for managing the global UI theme configuration state.
 * @type {React.Context<Object|undefined>}
 */
export const ThemeContext = createContext();

/**
 * Context provider component that wraps the application to handle dark and light mode themes.
 * It initializes the theme state from `localStorage`, dynamically updates the `data-theme` 
 * attribute on the HTML document element whenever the state changes, and persists the setting.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Component child elements to be granted access to the theme context.
 * @returns {JSX.Element} A context provider wrapper injecting the theme state and toggle controller.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /** Toggles the application UI theme state back and forth between 'light' and 'dark' mode. */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};