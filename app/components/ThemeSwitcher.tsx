'use client';

import { useState, useEffect } from 'react';

type Theme = 'matrix' | 'cyberpunk' | 'retro' | 'neon';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const themes: Record<Theme, ThemeColors> = {
  matrix: {
    primary: '#39ff14',
    secondary: '#00ff00',
    accent: '#00ffff',
    background: '#000000',
    text: '#39ff14'
  },
  cyberpunk: {
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#ffff00',
    background: '#1a1a1a',
    text: '#ffffff'
  },
  retro: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#ffe66d',
    background: '#2c3e50',
    text: '#ffffff'
  },
  neon: {
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#ffff00',
    background: '#000000',
    text: '#ffffff'
  }
};

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('matrix');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    root.style.setProperty('--hacker-green', theme.primary);
    root.style.setProperty('--hacker-blue', theme.secondary);
    root.style.setProperty('--hacker-red', theme.accent);
    root.style.setProperty('--terminal-bg', theme.background);
    root.style.setProperty('--terminal-text', theme.text);
  }, [currentTheme]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="hacker-button p-4 rounded-full animate-pulse-slow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-black border border-green-500 rounded-lg p-4 w-48">
          <h3 className="text-green-400 mb-2">Theme Selector</h3>
          <div className="space-y-2">
            {Object.keys(themes).map((theme) => (
              <button
                key={theme}
                className={`w-full p-2 rounded text-left ${
                  currentTheme === theme
                    ? 'bg-green-500/20 border border-green-500'
                    : 'hover:bg-green-500/10'
                }`}
                onClick={() => {
                  setCurrentTheme(theme as Theme);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: themes[theme as Theme].primary }}
                  />
                  <span className="capitalize">{theme}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 