import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner.tsx";
import { TasksProvider } from "./contexts/TasksContext.tsx";
import { AppDataProvider } from "./contexts/AppDataContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <TasksProvider>
          <AppDataProvider>
            <App />
            <Toaster />
          </AppDataProvider>
        </TasksProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
