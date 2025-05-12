'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { FaLock, FaUnlock, FaKey, FaRandom, FaDatabase, FaUser, FaFileAlt, FaCheckCircle, FaCog, FaCalculator, FaSkull, FaHourglass, FaShieldAlt, FaWifi, FaGlobe, FaEye, FaBolt, FaTerminal } from 'react-icons/fa';
import { BiFingerprint, BiScan } from 'react-icons/bi';
import { SiMatrix } from 'react-icons/si';
import { RiComputerLine, RiShieldKeyholeLine } from 'react-icons/ri';
import dynamic from 'next/dynamic';
import GlitchText from './GlitchText';
import TypewriterEffect from './TypewriterEffect';
import { usePreventAutoScroll } from '../../lib/usePreventAutoScroll';
import { initScrollManager } from '../../lib/scrollManager';
import './passwordCracker.css';

// Dynamically import 3D components with no SSR to prevent hydration errors
const ProfileGlobe = dynamic(() => import('./ProfileGlobe'), { ssr: false, loading: () => <div className="w-full h-full bg-black rounded-full" /> });
const Globe3D = dynamic(() => import('./Globe3DWrapper'), { ssr: false, loading: () => <div className="w-full h-full bg-black rounded-md flex items-center justify-center"><SiMatrix className="text-green-500 animate-pulse text-2xl" /></div> });

// Interface for breach location data
interface BreachLocation {
  location: string;
  count: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

// Interface for particle effect configuration
interface ParticleConfig {
  count: number;
  color: string;
  speed: number;
  size: number;
  active: boolean;
}

interface CrackAttempt {
  method: string;
  password: string;
  status: 'trying' | 'success' | 'failed';
  time: string;
  keyspace?: string;
  entropy?: number;
}

interface PasswordComplexity {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  score: number;
  timeToCrack: string;
  entropy: number;
}

interface PasswordCrackerProps {
  className?: string;
}

const PasswordCracker = ({ className = "" }: PasswordCrackerProps) => {
  const [target, setTarget] = useState('');
  const [cracking, setCracking] = useState(false);
  const [attempts, setAttempts] = useState<CrackAttempt[]>([]);
  const [progress, setProgress] = useState(0);
  const [method, setMethod] = useState('bruteforce');
  const [passwordFound, setPasswordFound] = useState<string | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [hashType, setHashType] = useState('md5');
  const [complexity, setComplexity] = useState<PasswordComplexity | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  const [passwordInput, setPasswordInput] = useState('');
  const [showComplexityAnalyzer, setShowComplexityAnalyzer] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  const [profilePicHover, setProfilePicHover] = useState(false);
    // New enhanced states
  const [breachLocations, setBreachLocations] = useState<BreachLocation[]>([]);
  const [particleConfig, setParticleConfig] = useState<ParticleConfig>({
    count: 50,
    color: '#10B981', // Changed to match portfolio green color
    speed: 1,
    size: 2,
    active: false
  });
  const [animationMode, setAnimationMode] = useState<'matrix' | 'particles' | 'wave' | 'none'>('none');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState<'crack' | 'analyze' | 'history'>('crack');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Client-side flag to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  // Add state to defer rendering of heavy content
  const [isReady, setIsReady] = useState(false);

  // Prevent auto-scrolling to this component
  usePreventAutoScroll();

  // Initialize the scroll manager to prevent jumping
  useEffect(() => {
    // Returns cleanup function
    return initScrollManager();
  }, []);

  // Prevent touch events from capturing scroll
  useEffect(() => {
    // Direct event handling to stop scroll capturing
    const preventScrollCapture = (e: TouchEvent) => {
      // Check if we're in a scrollable element inside the component
      const target = e.target as HTMLElement;
      const isScrollable = target.closest('.overflow-y-auto') || target.closest('.overflow-auto');
      
      // Only prevent default if we're not in a scrollable element
      if (!isScrollable) {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    // Add the event listener with capture phase to intercept events early
    document.addEventListener('touchmove', preventScrollCapture, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScrollCapture);
    };
  }, []);

  // Set client-side flag on mount to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Delay rendering of complex content to prevent layout shifts
  useEffect(() => {
    // Save current scroll position before loading
    if (typeof window !== 'undefined') {
      const savedPosition = window.scrollY;
      
      const timer = setTimeout(() => {
        setIsReady(true);
        
        // Restore scroll position after component renders
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
        }, 50);
      }, 1000); // 1 second delay
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Delay any animations to prevent triggering scroll issues
  useEffect(() => {
    const timer = setTimeout(() => {
      // Now it's safe to enable animations and effects
      setAnimationMode(animationMode);
    }, 1500); // Increased delay to ensure component is fully rendered
    
    return () => clearTimeout(timer);
  }, []);

  // Effect for globe animation
  useEffect(() => {
    // Only trigger special effects when a password is found and we're on the client side
    if (passwordFound && isClient) {
      // Trigger a glitch effect
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
      
      // Auto-show the globe for dramatic effect
      setShowGlobe(true);
    }
  }, [passwordFound, isClient]);

  // Matrix rain animation effect
  useEffect(() => {
    if (!canvasRef.current || animationMode !== 'matrix' || !isClient) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix rain configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+{}:"<>?[];\',.'.split('');
    
    // Animation frame
    let animationId: number;
    
    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#39ff14';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Generate random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Reset position if it's at the bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move the drop down
        drops[i]++;
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [animationMode, isClient]);

  // Generate world map breach data for visualization
  const generateBreachData = () => {
    const locations = [
      'New York, USA', 'Tokyo, Japan', 'London, UK', 'Sydney, Australia',
      'Moscow, Russia', 'Beijing, China', 'São Paulo, Brazil', 'Mumbai, India',
      'Berlin, Germany', 'Toronto, Canada', 'Paris, France', 'Seoul, South Korea',
      'Cape Town, South Africa', 'Dubai, UAE', 'Mexico City, Mexico'
    ];
    
    const breaches: BreachLocation[] = [];
    const count = Math.floor(Math.random() * 8) + 5; // 5-12 breach locations
    
    for (let i = 0; i < count; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const breachCount = Math.floor(Math.random() * 1000) + 100;
      
      // Create timestamp in the last 24 hours
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));
      const timestamp = date.toISOString();
      
      // Determine severity based on breach count
      let severity: 'low' | 'medium' | 'high';
      if (breachCount < 250) severity = 'low';
      else if (breachCount < 700) severity = 'medium';
      else severity = 'high';
      
      breaches.push({
        location,
        count: breachCount,
        timestamp,
        severity
      });
    }
    
    return breaches;
  };

  // Handle sound effects
  const playSound = (soundType: 'success' | 'error' | 'typing' | 'click' | 'alert') => {
    if (!soundEnabled || !isClient) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    switch (soundType) {
      case 'success':
        audioRef.current.src = '/sounds/success.mp3';
        break;
      case 'error':
        audioRef.current.src = '/sounds/error.mp3';
        break;
      case 'typing':
        audioRef.current.src = '/sounds/typing.mp3';
        break;
      case 'click':
        audioRef.current.src = '/sounds/click.mp3';
        break;
      case 'alert':
        audioRef.current.src = '/sounds/alert.mp3';
        break;
    }
    
    audioRef.current.volume = 0.3;
    audioRef.current.play().catch(() => {
      // Ignore autoplay errors
    });
  };

  // Toggle animation mode
  const toggleAnimationMode = (mode: 'matrix' | 'particles' | 'wave' | 'none') => {
    if (animationMode === mode) {
      setAnimationMode('none');
    } else {
      setAnimationMode(mode);
      if (mode === 'matrix') {
        setParticleConfig(prev => ({ ...prev, active: false }));
        addLog("Initializing Matrix rain visualization...");
      } else if (mode === 'particles') {
        setParticleConfig(prev => ({ ...prev, active: true }));
        addLog("Initializing particle visualization...");
      }
    }
    playSound('click');
  };

  // Toggle globe visibility
  const toggleGlobe = () => {
    setShowGlobe(!showGlobe);
    
    // Add a log entry about the visualization
    if (!showGlobe) {
      addLog("Initializing global breach visualization...");
    } else {
      addLog("Closing breach visualization");
    }
  };

  // Method options with more details
  const methods = [
    { 
      id: 'bruteforce', 
      name: 'Brute Force', 
      description: 'Tries every possible combination of characters',
      icon: <FaRandom />,
      speed: 'Slow',
      effectiveness: 'Very High'
    },
    { 
      id: 'dictionary', 
      name: 'Dictionary Attack', 
      description: 'Uses a list of common passwords and words',
      icon: <FaFileAlt />,
      speed: 'Fast',
      effectiveness: 'Medium'
    },
    { 
      id: 'rainbow', 
      name: 'Rainbow Table', 
      description: 'Uses precomputed hash tables for quick lookup',
      icon: <FaDatabase />,
      speed: 'Very Fast',
      effectiveness: 'High (for unsalted hashes)'
    },
    { 
      id: 'social', 
      name: 'Smart Wordlist', 
      description: 'Generates targeted wordlist based on user information',
      icon: <FaUser />,
      speed: 'Medium',
      effectiveness: 'High (for poor password practices)'
    },
    {
      id: 'hybrid',
      name: 'Hybrid Attack',
      description: 'Combines dictionary words with patterns and mutations',
      icon: <FaKey />,
      speed: 'Medium',
      effectiveness: 'High'
    }
  ];

  // Hash type options
  const hashTypes = [
    { id: 'md5', name: 'MD5', length: 32 },
    { id: 'sha1', name: 'SHA-1', length: 40 },
    { id: 'sha256', name: 'SHA-256', length: 64 },
    { id: 'ntlm', name: 'NTLM', length: 32 },
    { id: 'bcrypt', name: 'bcrypt', length: 60 }
  ];

  // Common passwords with categories
  const commonPasswords = [
    { value: 'password123', category: 'Common' },
    { value: 'admin123', category: 'Common' },
    { value: 'qwerty', category: 'Common' },
    { value: '123456', category: 'Common' },
    { value: 'letmein', category: 'Common' },
    { value: 'welcome', category: 'Common' },
    { value: 'monkey123', category: 'Common' },
    { value: 'dragon', category: 'Common' },
    { value: 'baseball', category: 'Sports' },
    { value: 'football', category: 'Sports' }
  ];

  // Add a log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [...prev.slice(-50), `[${timestamp}] ${message}`]);
  };

  // Scroll logs to bottom when new logs are added
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Calculate password complexity
  const analyzePassword = (password: string): PasswordComplexity => {
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    let keyspace = 0;
    if (hasLowercase) keyspace += 26;
    if (hasUppercase) keyspace += 26;
    if (hasNumbers) keyspace += 10;
    if (hasSymbols) keyspace += 33;
    
    const entropy = Math.log2(Math.pow(keyspace, length));
    const score = Math.min(100, entropy / 0.6);
    
    // Calculate time to crack based on entropy
    const guessesPerSecond = 100000000000;
    const possibleCombinations = Math.pow(2, entropy);
    const seconds = possibleCombinations / guessesPerSecond / 2;
    
    let timeToCrack;
    if (seconds < 1) {
      timeToCrack = 'Instantly';
    } else if (seconds < 60) {
      timeToCrack = `${Math.round(seconds)} seconds`;
    } else if (seconds < 3600) {
      timeToCrack = `${Math.round(seconds / 60)} minutes`;
    } else if (seconds < 86400) {
      timeToCrack = `${Math.round(seconds / 3600)} hours`;
    } else if (seconds < 31536000) {
      timeToCrack = `${Math.round(seconds / 86400)} days`;
    } else {
      timeToCrack = 'Centuries';
    }
    
    return {
      length,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      numbers: hasNumbers,
      symbols: hasSymbols,
      score,
      timeToCrack,
      entropy
    };
  };

  // Simulate password cracking
  const simulateCracking = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (!cracking) {
        clearInterval(interval);
        return;
      }
      
      // Update progress
      currentProgress += Math.floor(Math.random() * 5) + 1;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);
      
      // Generate a random password attempt
      const passwordChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      let attemptedPassword = '';
      
      if (method === 'dictionary') {
        // Use a common password from our list
        const randomIndex = Math.floor(Math.random() * commonPasswords.length);
        attemptedPassword = commonPasswords[randomIndex].value;
      } else {
        // Generate a random password
        const length = Math.floor(Math.random() * 8) + 3;
        for (let i = 0; i < length; i++) {
          attemptedPassword += passwordChars.charAt(Math.floor(Math.random() * passwordChars.length));
        }
      }
      
      // Create a new attempt
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newAttempt: CrackAttempt = {
        method: methods.find(m => m.id === method)?.name || method,
        password: attemptedPassword,
        status: 'trying',
        time
      };
      
      setAttempts(prev => [newAttempt, ...prev.slice(0, 9)]);
      
      // Check if this attempt is successful (1% chance, or if it matches the target)
      const isSuccess = attemptedPassword === target || (currentProgress >= 100 && Math.random() < 0.5);
      
      if (isSuccess) {
        // Password found!
        setTimeout(() => {
          setAttempts(prev => [
            { ...prev[0], status: 'success' },
            ...prev.slice(1)
          ]);
          setPasswordFound(target || attemptedPassword);
          setCracking(false);
          setProgress(100);
          
          // Add a log entry
          addLog(`Password found: "${target || attemptedPassword}"`);
          
          // Play success sound
          playSound('success');
          
          // Analyze the cracked password
          setComplexity(analyzePassword(target || attemptedPassword));
          setShowComplexityAnalyzer(true);
        }, 500);
        
        clearInterval(interval);
      } else if (currentProgress === 100) {
        // Failed to find
        setTimeout(() => {
          setAttempts(prev => [
            { ...prev[0], status: 'failed' },
            ...prev.slice(1)
          ]);
          
          // Add a log entry
          addLog("Failed to crack password after exhausting keyspace");
          
          // Play error sound
          playSound('error');
          
          // Stop cracking
          setCracking(false);
        }, 500);
        
        clearInterval(interval);
      } else {
        // Update the current attempt as failed after a delay
        setTimeout(() => {
          setAttempts(prev => {
            if (prev.length === 0) return prev;
            return [
              { ...prev[0], status: 'failed' },
              ...prev.slice(1)
            ];
          });
        }, 300);
      }
    }, 300);
  };

  // Generate a hash-like string for rainbow table visualization
  const generateHashString = (type: string): string => {
    const chars = '0123456789abcdef';
    const length = hashTypes.find(h => h.id === type)?.length || 32;
    return Array(length).fill('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  // Get keyspace size description based on method
  const getKeyspaceSize = (methodId: string): string => {
    switch (methodId) {
      case 'bruteforce':
        return '95^8 (7e15) characters';
      case 'dictionary':
        return '100K-1M common passwords';
      case 'rainbow':
        return '10B+ pre-computed hashes';
      case 'social':
        return '1K-10K personalized guesses';
      case 'hybrid':
        return '100K base × 1K mutations';
      default:
        return 'Unknown';
    }
  };

  return (
    <div 
      className={`${className} w-full bg-[#030014] text-green-500 p-4 rounded-lg relative overflow-hidden shadow-2xl border border-green-500/30 prevent-scroll-jump neo-panel`}
      style={{ 
        touchAction: 'pan-y', 
        willChange: 'transform',
        scrollMarginTop: '100vh',
        scrollMarginBottom: '100vh',
        scrollSnapAlign: 'none',
        overscrollBehavior: 'none'
      }}
      onClick={(e) => {
        // Prevent clicks from causing scroll jumps
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        // Stop propagation to prevent container from hijacking scrolls
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        // Block touch movement to prevent scroll jumps
        e.stopPropagation();
        const target = e.target as HTMLElement;
        // Only allow scrolling in scrollable containers
        const isScrollable = target.closest('.overflow-y-auto') || target.closest('.overflow-auto');
        if (!isScrollable) {
          e.preventDefault();
        }
      }}
    >
      {!isReady ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin text-3xl mb-4">
              <SiMatrix />
            </div>
            <p className="text-green-400 text-sm">Initializing security tools...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Background canvas for effects */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none z-0" 
          />

          {/* Main content */}
          <div className="relative z-10">            {/* Header with title and controls */}
            <div className="flex flex-col xs:flex-row items-center justify-between mb-4 border-b border-green-500 border-opacity-30 pb-2">
              <div className="flex items-center mb-2 xs:mb-0 w-full xs:w-auto justify-center xs:justify-start">
                <FaLock className="mr-2 text-xl" />
                <h2 className={`text-lg sm:text-xl font-mono ${isGlitching ? 'animate-pulse' : ''}`}>
                  {isGlitching ? 
                    <GlitchText text="Password Cracker" /> : 
                    "Password Cracker"}
                </h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleAnimationMode('matrix')}
                  className={`p-1.5 rounded-md ${animationMode === 'matrix' ? 'bg-green-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}
                  aria-label="Toggle Matrix Effect"
                >
                  <SiMatrix className="text-base" />
                </button>
                <button
                  onClick={toggleGlobe}
                  className={`p-1.5 rounded-md ${showGlobe ? 'bg-green-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}
                  aria-label="Toggle Globe View"
                >
                  <FaGlobe className="text-base" />
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-md ${soundEnabled ? 'bg-green-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}
                  aria-label={soundEnabled ? "Disable Sound" : "Enable Sound"}
                >
                  {soundEnabled ? <FaWifi className="text-base" /> : <FaWifi className="text-base opacity-50" />}
                </button>
              </div>
            </div>{/* Tab navigation */}
            <div className="flex flex-wrap mb-4 border-b border-green-500 border-opacity-20">
              <button 
                onClick={() => setActiveTab('crack')}
                className={`py-2 px-3 font-mono text-xs sm:text-sm flex items-center ${activeTab === 'crack' ? 'border-b-2 border-green-500 text-green-400' : 'text-green-600 hover:text-green-400'}`}
                aria-label="Password Cracker Tab"
              >
                <FaKey className="inline mr-1" /> Crack
              </button>
              <button 
                onClick={() => setActiveTab('analyze')}
                className={`py-2 px-3 font-mono text-xs sm:text-sm flex items-center ${activeTab === 'analyze' ? 'border-b-2 border-green-500 text-green-400' : 'text-green-600 hover:text-green-400'}`}
                aria-label="Password Analyzer Tab"
              >
                <FaCalculator className="inline mr-1" /> Analyze
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`py-2 px-3 font-mono text-xs sm:text-sm flex items-center ${activeTab === 'history' ? 'border-b-2 border-green-500 text-green-400' : 'text-green-600 hover:text-green-400'}`}
                aria-label="History Tab"
              >
                <FaFileAlt className="inline mr-1" /> History
              </button>
            </div>            {/* Crack tab content */}
            {activeTab === 'crack' && (
              <div className="fade-in">
                <div className="grid grid-cols-1 gap-4">
                  {/* Configuration panel */}                  <div className="bg-[#030014]/80 p-3 rounded-lg shadow-[#2A0E61]/50">
                    <h3 className="font-mono text-sm mb-3 border-b border-green-500/20 pb-1">Target Selection</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="mb-4 sm:mb-0">
                        <label className="block text-xs mb-1 text-green-400">Password/Hash</label>
                        <div className="flex">
                          <input
                            type="text"
                            value={target}
                            onChange={(e) => {
                              setTarget(e.target.value);
                              playSound('typing');
                            }}
                            placeholder="Enter password or hash"
                            className="w-full bg-black text-green-400 px-2 py-1 rounded-l border border-green-500/30 focus:outline-none focus:ring-1 focus:ring-green-500/50"
                          />
                          <button
                            onClick={() => {
                              const randomPassword = commonPasswords[Math.floor(Math.random() * commonPasswords.length)].value;
                              setTarget(randomPassword);
                              addLog(`Selected random common password: ${randomPassword}`);
                              playSound('click');
                            }}
                            className="bg-[#2A0E61] text-green-400 px-2 py-1 rounded-r border border-green-500/30 border-l-0 hover:bg-[#4A1E91]"
                            aria-label="Use random password"
                          >
                            <FaRandom />
                          </button>
                        </div>
                      </div>
                        <div className="mb-4 sm:mb-0">
                        <label className="block text-xs mb-1 text-green-400">Attack Method</label>
                        <select
                          value={method}
                          onChange={(e) => {
                            setMethod(e.target.value);
                            addLog(`Changed attack method to ${e.target.value}`);
                            playSound('click');
                          }}
                          className="w-full bg-black text-green-400 px-2 py-1 rounded border border-green-500/30 focus:outline-none focus:ring-1 focus:ring-green-500/50"
                        >
                          {methods.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4 sm:mb-0">
                        <label className="block text-xs mb-1 text-green-400">Hash Type</label>                        <select
                          value={hashType}
                          onChange={(e) => {
                            setHashType(e.target.value);
                            addLog(`Changed hash type to ${e.target.value}`);
                            playSound('click');
                          }}
                          className="w-full bg-black text-green-400 px-2 py-1 rounded border border-green-500/30 focus:outline-none focus:ring-1 focus:ring-green-500/50"
                        >
                          {hashTypes.map(h => (
                            <option key={h.id} value={h.id}>{h.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => {
                            if (cracking) {
                              setCracking(false);
                              addLog("Password cracking stopped");
                              playSound('error');
                            } else {
                              if (!target) {
                                addLog("ERROR: No password or hash specified");
                                playSound('error');
                                return;
                              }
                              
                              setCracking(true);
                              setPasswordFound(null);
                              setProgress(0);
                              setAttempts([]);
                              
                              // Generate breach data
                              const breachData = generateBreachData();
                              setBreachLocations(breachData);
                              
                              addLog(`Starting password cracking with ${method} method...`);
                              playSound('click');
                              
                              // Start cracking simulation
                              simulateCracking();
                            }
                          }}
                          className={`${
                            cracking 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          } py-2 px-6 rounded-md font-mono flex items-center justify-center transition-all duration-300 w-full sm:w-auto`}
                          aria-label={cracking ? "Stop cracking" : "Start cracking"}
                        >
                          {cracking ? (
                            <>
                              <FaUnlock className="mr-2 animate-pulse" /> STOP
                            </>
                          ) : (
                            <>
                              <FaLock className="mr-2" /> CRACK
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                    {/* Visualization panel */}                  <div className="bg-[#030014]/80 p-3 rounded-lg shadow-[#2A0E61]/50">
                    <h3 className="font-mono text-sm mb-3 border-b border-green-500/20 pb-1">Cracking Progress</h3>
                    
                    {/* Password Found Alert */}
                    {passwordFound && (
                      <div className="mb-4 bg-green-900 bg-opacity-30 border border-green-500 rounded-md p-3 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <FaCheckCircle className="text-green-400 mr-2" />
                          <span className="text-green-300">Password Found!</span>
                        </div>
                        <div className="font-mono text-xl flex items-center justify-center">
                          <FaKey className="mr-2 text-green-400" />
                          <span className="text-green-300 break-all">{passwordFound}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex flex-col xs:flex-row xs:justify-between text-xs mb-1">
                        <span>Progress: {progress}%</span>
                        {cracking && (
                          <span className="text-green-300 animate-pulse mt-1 xs:mt-0">
                            <TypewriterEffect 
                              text={`Trying ${method === 'dictionary' ? 'dictionary words' : method === 'rainbow' ? 'hash lookups' : 'combinations'}...`} 
                              speed={100} 
                            />
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          ref={progressBarRef}
                          className="bg-green-500 h-2 transition-all duration-300 ease-in-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Globe visualization */}
                    {showGlobe && isClient && (
                      <div className="mb-4">
                        <div className="border border-green-500 border-opacity-30 bg-black bg-opacity-50 rounded-md overflow-hidden" style={{ height: '200px', maxHeight: '30vh' }}>
                          <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><SiMatrix className="text-green-500 animate-pulse text-3xl" /></div>}>
                            <Globe3D breachLocations={breachLocations} />
                          </Suspense>
                        </div>
                      </div>
                    )}
                    
                    {/* Attempt Log */}
                    <div className="max-h-40 overflow-y-auto bg-black/80 rounded p-2 border border-green-500/20 text-xs font-mono">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-green-400 border-b border-green-900">
                              <th className="text-left py-1 whitespace-nowrap px-1">Time</th>
                              <th className="text-left py-1 whitespace-nowrap px-1">Method</th>
                              <th className="text-left py-1 whitespace-nowrap px-1">Attempt</th>
                              <th className="text-left py-1 whitespace-nowrap px-1">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attempts.map((attempt, index) => (
                              <tr 
                                key={index}
                                className={`
                                  border-b border-green-900 border-opacity-50 last:border-0
                                  ${attempt.status === 'success' ? 'text-green-300' : attempt.status === 'failed' ? 'text-red-400' : 'text-yellow-300'}
                                `}
                              >
                                <td className="py-1 px-1">{attempt.time}</td>
                                <td className="py-1 px-1 whitespace-nowrap">{attempt.method}</td>
                                <td className="py-1 px-1 truncate max-w-[10ch]">{attempt.password}</td>
                                <td className="py-1 px-1 whitespace-nowrap">
                                  {attempt.status === 'trying' && <span className="animate-pulse">Trying...</span>}
                                  {attempt.status === 'success' && <span className="flex items-center"><FaCheckCircle className="mr-1" /> Match</span>}
                                  {attempt.status === 'failed' && <span>Failed</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* System Logs */}
                <div className="mt-4 bg-black bg-opacity-70 p-2 rounded-lg border border-green-500 border-opacity-20">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-mono text-xs text-green-400">System Logs</h3>
                    <button
                      onClick={() => setLogs([])}
                      className="text-xs text-green-500 hover:text-green-400"
                      aria-label="Clear logs"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="font-mono text-xs h-20 overflow-y-auto bg-black bg-opacity-70 rounded p-1">
                    {logs.map((log, index) => (
                      <div key={index} className="text-green-300 whitespace-nowrap">{log}</div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>
              </div>
            )}              {/* Analyze tab content */}
            {activeTab === 'analyze' && (
              <div className="fade-in">                <div className="bg-[#030014]/80 p-3 sm:p-4 rounded-lg shadow-[#2A0E61]/50">
                  <h3 className="font-mono text-base sm:text-lg mb-3 border-b border-green-500/20 pb-1">Password Analyzer</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-green-400">Enter Password to Analyze</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          if (e.target.value) {
                            setComplexity(analyzePassword(e.target.value));
                          } else {
                            setComplexity(null);
                          }
                          playSound('typing');
                        }}
                        placeholder="Enter a password"
                        className="w-full bg-gray-900 text-green-300 px-3 py-2 rounded border border-green-500 border-opacity-30 focus:outline-none focus:border-green-400"
                      />
                    </div>
                  </div>
                  
                  {complexity && (                      <div className="bg-black/80 p-3 sm:p-4 rounded-lg border border-green-500/20">
                      <h4 className="font-mono text-green-400 mb-3">Password Strength: {complexity.score.toFixed(0)}%</h4>
                        <div className="w-full bg-gray-900 rounded-full h-2 mb-4 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
                            complexity.score < 30 ? 'bg-red-500' : 
                            complexity.score < 60 ? 'bg-yellow-500' : 
                            complexity.score < 80 ? 'bg-purple-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${complexity.score}%` }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-xs sm:text-sm">
                        <div className="flex items-center">
                          {isClient && (
                            <span className={`mr-2 ${complexity.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                              {complexity.length >= 8 ? '✓' : '✗'}
                            </span>
                          )}
                          <span>Length ({complexity.length})</span>
                        </div>
                        
                        <div className="flex items-center">
                          {isClient && (
                            <span className={`mr-2 ${complexity.lowercase ? 'text-green-400' : 'text-red-400'}`}>
                              {complexity.lowercase ? '✓' : '✗'}
                            </span>
                          )}
                          <span>Lowercase letters</span>
                        </div>
                        
                        <div className="flex items-center">
                          {isClient && (
                            <span className={`mr-2 ${complexity.uppercase ? 'text-green-400' : 'text-red-400'}`}>
                              {complexity.uppercase ? '✓' : '✗'}
                            </span>
                          )}
                          <span>Uppercase letters</span>
                        </div>
                        
                        <div className="flex items-center">
                          {isClient && (
                            <span className={`mr-2 ${complexity.numbers ? 'text-green-400' : 'text-red-400'}`}>
                              {complexity.numbers ? '✓' : '✗'}
                            </span>
                          )}
                          <span>Numbers</span>
                        </div>
                        
                        <div className="flex items-center">
                          {isClient && (
                            <span className={`mr-2 ${complexity.symbols ? 'text-green-400' : 'text-red-400'}`}>
                              {complexity.symbols ? '✓' : '✗'}
                            </span>
                          )}
                          <span>Special characters</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-2 sm:p-3 bg-black bg-opacity-50 rounded border border-green-500 border-opacity-20">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-1">
                          <span className="text-green-400 text-xs sm:text-sm">Estimated time to crack:</span>
                          <span className={`font-mono text-xs sm:text-sm ${
                            complexity.entropy < 40 ? 'text-red-400' : 
                            complexity.entropy < 60 ? 'text-yellow-400' : 
                            complexity.entropy < 80 ? 'text-blue-400' : 'text-green-400'
                          }`}>{complexity.timeToCrack}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-green-400 text-xs sm:text-sm">Entropy:</span>
                          <span className="font-mono text-xs sm:text-sm">{complexity.entropy.toFixed(2)} bits</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}              {/* History tab content */}
            {activeTab === 'history' && (
              <div className="fade-in">                <div className="bg-[#030014]/80 p-3 sm:p-4 rounded-lg shadow-[#2A0E61]/50">
                  <h3 className="font-mono text-base sm:text-lg mb-3 border-b border-green-500/20 pb-1">Password Breach History</h3>
                  
                  {isClient ? (
                    <div className="grid grid-cols-1 gap-4">                      <div className="bg-black/80 rounded-lg p-3 border border-green-500/20">
                        <h4 className="font-mono text-xs sm:text-sm text-green-400 mb-2">Recent Breaches</h4>
                        <div className="max-h-40 sm:max-h-60 overflow-y-auto">
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-green-400 border-b border-green-900">
                                  <th className="text-left py-1 px-1 whitespace-nowrap">Location</th>
                                  <th className="text-right py-1 px-1 whitespace-nowrap">Records</th>
                                  <th className="text-right py-1 px-1 whitespace-nowrap">Time</th>
                                </tr>
                              </thead>
                              <tbody>
                                {breachLocations.map((breach, index) => (
                                  <tr key={index} className="border-b border-green-900 border-opacity-30 last:border-0">
                                    <td className="py-1 px-1">{breach.location}</td>
                                    <td className="py-1 px-1 text-right whitespace-nowrap">{breach.count.toLocaleString()}</td>
                                    <td className="py-1 px-1 text-right whitespace-nowrap text-xs opacity-70">
                                      {new Date(breach.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-3 border border-green-500 border-opacity-20">
                        <h4 className="font-mono text-xs sm:text-sm text-green-400 mb-2">Breach Statistics</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Total Breached Records</span>
                              <span className="font-mono">
                                {breachLocations.reduce((total, breach) => total + breach.count, 0).toLocaleString()}
                              </span>
                            </div>                            <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-red-500 h-1.5 w-full" />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>High Severity</span>
                              <span className="font-mono">
                                {breachLocations.filter(b => b.severity === 'high').length}
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-red-500 h-1.5" 
                                style={{ 
                                  width: `${(breachLocations.filter(b => b.severity === 'high').length / breachLocations.length) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Medium Severity</span>
                              <span className="font-mono">
                                {breachLocations.filter(b => b.severity === 'medium').length}
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-yellow-500 h-1.5" 
                                style={{ 
                                  width: `${(breachLocations.filter(b => b.severity === 'medium').length / breachLocations.length) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Low Severity</span>
                              <span className="font-mono">
                                {breachLocations.filter(b => b.severity === 'low').length}
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-blue-500 h-1.5" 
                                style={{ 
                                  width: `${(breachLocations.filter(b => b.severity === 'low').length / breachLocations.length) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="inline-block animate-spin text-3xl mb-4">
                        <SiMatrix />
                      </div>
                      <p className="text-green-400">Loading breach history...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordCracker;
