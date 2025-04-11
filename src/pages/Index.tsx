
import { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Check for system theme preference on load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');

    // Listen for changes in system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-4 px-6 border-b bg-gradient-to-r from-background to-muted">
        <h1 className="text-2xl font-bold font-playfair">Asistente IA</h1>
      </header>
      
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        <ChatContainer />
      </main>
    </div>
  );
};

export default Index;
