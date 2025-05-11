'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { FaLock, FaUnlock, FaKey, FaRandom, FaDatabase, FaUser, FaFileAlt, FaCheckCircle, FaCog, FaCalculator, FaSkull, FaHourglass, FaShieldAlt, FaWifi, FaGlobe, FaEye, FaBolt, FaTerminal } from 'react-icons/fa';
import { BiFingerprint, BiScan } from 'react-icons/bi';
import { SiMatrix } from 'react-icons/si';
import { RiComputerLine, RiShieldKeyholeLine } from 'react-icons/ri';
import dynamic from 'next/dynamic';
import GlitchText from './GlitchText';
import TypewriterEffect from './TypewriterEffect';

// Dynamically import 3D components with no SSR to prevent hydration errors
const ProfileGlobe = dynamic(() => import('./ProfileGlobe'), { ssr: false, loading: () => <div className="w-full h-full bg-black rounded-full" /> });
const Globe3D = dynamic(() => import('./Globe3D'), { ssr: false, loading: () => <div className="w-full h-full bg-black rounded-md flex items-center justify-center"><SiMatrix className="text-green-500 animate-pulse text-2xl" /></div> });

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
    color: '#39ff14',
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

  // Effect for globe animation
  useEffect(() => {
    // Only trigger special effects when a password is found
    if (passwordFound) {
      // Trigger a glitch effect
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
      
      // Auto-show the globe for dramatic effect
      setShowGlobe(true);
    }
  }, [passwordFound]);

  // Matrix rain animation effect
  useEffect(() => {
    if (!canvasRef.current || animationMode !== 'matrix') return;
    
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
  }, [animationMode]);

  // Particle animation for password strength visualization
  useEffect(() => {
    if (!canvasRef.current || animationMode !== 'particles' || !particleConfig.active) return;
    
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
    
    // Create particles
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocity: { x: number; y: number };
      alpha: number;
      life: number;
      maxLife: number;
    }[] = [];
    
    // Generate particles based on password strength
    const generateParticles = () => {
      // Clear existing particles
      particles.length = 0;
      
      // Number of particles based on complexity
      const particleCount = complexity ? 
        Math.min(150, Math.floor(complexity.score * 30) + particleConfig.count) : 
        particleConfig.count;
      
      // Determine color based on password strength
      let particleColor = particleConfig.color;
      if (complexity) {
        if (complexity.score < 2) particleColor = '#ff3e3e'; // Weak - red
        else if (complexity.score < 3) particleColor = '#ff9d3e'; // Medium - orange
        else if (complexity.score < 4) particleColor = '#ffdf3e'; // Strong - yellow
        else particleColor = '#39ff14'; // Very strong - green
      }
      
      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const radius = (Math.random() * particleConfig.size) + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Velocity based on password strength
        const speedMultiplier = complexity ? 
          (complexity.score * 0.5) + particleConfig.speed : 
          particleConfig.speed;
        
        const velocity = {
          x: (Math.random() - 0.5) * speedMultiplier,
          y: (Math.random() - 0.5) * speedMultiplier
        };
        
        // Random life for each particle
        const maxLife = Math.random() * 100 + 50;
        
        particles.push({
          x,
          y,
          radius,
          color: particleColor,
          velocity,
          alpha: 1,
          life: 0,
          maxLife
        });
      }
    };
    
    generateParticles();
    
    // Add event to regenerate particles when complexity changes
    const complexityChangeHandler = () => {
      generateParticles();
    };
    
    // Start animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update position
        p.x += p.velocity.x;
        p.y += p.velocity.y;
        
        // Update life
        p.life++;
        if (p.life >= p.maxLife) {
          p.alpha = Math.max(0, p.alpha - 0.02);
          if (p.alpha <= 0) {
            // Reset particle
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            p.alpha = 1;
            p.life = 0;
          }
        }
        
        // Bounce off walls
        if (p.x <= p.radius || p.x >= canvas.width - p.radius) {
          p.velocity.x = -p.velocity.x;
        }
        if (p.y <= p.radius || p.y >= canvas.height - p.radius) {
          p.velocity.y = -p.velocity.y;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Draw connections between close particles
        if (complexity && complexity.score >= 3) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Draw line if particles are close
            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `${p.color}${Math.floor((1 - distance / 100) * p.alpha * 255).toString(16).padStart(2, '0')}`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [animationMode, particleConfig, complexity]);

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
    if (!soundEnabled) return;
    
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
    { value: 'football', category: 'Sports' },
    { value: 'shadow', category: 'Common' },
    { value: 'michael', category: 'Names' },
    { value: 'jennifer', category: 'Names' },
    { value: 'sunshine', category: 'Nature' },
    { value: 'iloveyou', category: 'Phrases' },
    { value: 'princess', category: 'Common' },
    { value: 'superman', category: 'Fiction' },
    { value: 'trustno1', category: 'Phrases' },
    { value: 'hello123', category: 'Common' },
    { value: 'welcome1', category: 'Common' }
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

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate a realistic looking password
  const generatePassword = (hasUpper: boolean, hasLower: boolean, hasNumbers: boolean, hasSymbols: boolean, length: number) => {
    let charset = '';
    if (hasLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (hasUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (hasNumbers) charset += '0123456789';
    if (hasSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  };

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
    
    // Calculate entropy (bits): log2(keyspace^length)
    const entropy = Math.log2(Math.pow(keyspace, length));
    
    // Calculate score (0-100)
    let score = Math.min(100, entropy / 0.6);
    
    // Calculate time to crack based on entropy
    // Assuming 100 billion guesses per second (modern cracking hardware)
    const guessesPerSecond = 100000000000;
    const possibleCombinations = Math.pow(2, entropy);
    const seconds = possibleCombinations / guessesPerSecond / 2; // Average case is half of total
    
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
    } else if (seconds < 315360000) {
      timeToCrack = `${Math.round(seconds / 31536000)} years`;
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

  // Handle password analysis
  const handleAnalyzePassword = () => {
    if (!passwordInput) {
      addLog('ERROR: No password provided for analysis');
      return;
    }
    
    setShowComplexityAnalyzer(true);
    const result = analyzePassword(passwordInput);
    setComplexity(result);
    
    // Generate data for visualizer
    const dataPoints = [];
    for (let i = 0; i < 30; i++) {
      if (i < passwordInput.length) {
        const charType = 
          /[A-Z]/.test(passwordInput[i]) ? 3 :
          /[a-z]/.test(passwordInput[i]) ? 2 :
          /[0-9]/.test(passwordInput[i]) ? 1 :
          /[^A-Za-z0-9]/.test(passwordInput[i]) ? 4 : 0;
        dataPoints.push(charType);
      } else {
        dataPoints.push(0);
      }
    }
    setVisualizerData(dataPoints);
    
    addLog(`Analyzed password with score: ${Math.round(result.score)}/100`);
    
    // Trigger glitch effect for visual feedback
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 200);
  };

  const generateRandomPassword = (strength: 'weak' | 'medium' | 'strong' = 'medium') => {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_-+={}[]|:;<>,.?/~';
    
    let chars = '';
    let length = 0;
    
    switch (strength) {
      case 'weak':
        chars = lowerChars + numberChars;
        length = Math.floor(Math.random() * 4) + 4; // 4-7 chars
        break;
      case 'medium':
        chars = lowerChars + upperChars + numberChars;
        length = Math.floor(Math.random() * 4) + 8; // 8-11 chars
        break;
      case 'strong':
        chars = lowerChars + upperChars + numberChars + specialChars;
        length = Math.floor(Math.random() * 6) + 12; // 12-17 chars
        break;
    }
    
    return Array(length).fill('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  // Analyze password complexity
  const analyzePasswordComplexity = (password: string): PasswordComplexity => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_\-+={}[\]|:;<>,.?/~]/.test(password);
    
    // Calculate base score
    let score = 0;
    if (password.length >= 12) score += 3;
    else if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;
    
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 2;
    
    // Check for common patterns
    if (/^[0-9]+$/.test(password)) score -= 2; // All numbers
    if (/^[a-zA-Z]+$/.test(password)) score -= 1; // All letters
    if (/^(qwerty|asdfgh|zxcvbn)/i.test(password)) score -= 2; // Keyboard patterns
    
    // Calculate entropy
    let charset = 0;
    if (hasLowercase) charset += 26;
    if (hasUppercase) charset += 26;
    if (hasNumbers) charset += 10;
    if (hasSymbols) charset += 32;
    
    const entropy = Math.log2(Math.pow(charset, password.length));
    
    // Estimate time to crack
    let timeToCrack = '';
    if (entropy < 40) timeToCrack = 'Seconds to Minutes';
    else if (entropy < 60) timeToCrack = 'Hours to Days';
    else if (entropy < 80) timeToCrack = 'Months to Years';
    else if (entropy < 100) timeToCrack = 'Decades';
    else timeToCrack = 'Centuries';
    
    return {
      length: password.length,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      numbers: hasNumbers,
      symbols: hasSymbols,
      score: Math.max(0, Math.min(10, score)),
      timeToCrack,
      entropy
    };
  };

  // Handle password input for analysis
  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setTarget(password);
    
    if (password.length > 0) {
      setComplexity(analyzePasswordComplexity(password));
      
      // Update password visualizer data
      const data = [];
      for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        data.push((char % 80) + 10); // Normalize to a reasonable range for visualization
      }
      setVisualizerData(data);
    } else {
      setComplexity(null);
      setVisualizerData([]);
    }
  };

  // Simulate cracking process
  const startCracking = () => {
    if (!target) return;
    
    setCracking(true);
    setAttempts([]);
    setProgress(0);
    setPasswordFound(null);
    setLogs([]);
    
    // Initialize cracking animation data
    setVisualizerData(Array(20).fill(0).map(() => Math.floor(Math.random() * 80) + 10));
    
    addLog(`Starting ${methods.find(m => m.id === method)?.name} attack on target`);
    
    // Different behavior based on method
    const methodDelay = method === 'rainbow' ? 150 : 
                        method === 'dictionary' ? 200 :
                        method === 'social' ? 250 : 300;
    
    const successProbability = method === 'rainbow' ? 0.92 : 
                              method === 'dictionary' ? 0.85 :
                              method === 'social' ? 0.75 : 0.6;
    
    let currentProgress = 0;
    let attemptsCount = 0;
    const maxAttempts = method === 'bruteforce' ? 50 : 
                       method === 'rainbow' ? 15 :
                       method === 'hybrid' ? 25 : 20;
    
    addLog(`Initializing ${method} attack parameters...`);
    addLog(`Estimated keyspace: ${getKeyspaceSize(method)}`);
    
    if (method === 'dictionary') {
      addLog(`Loaded dictionary with ${commonPasswords.length} entries`);
    } else if (method === 'rainbow') {
      addLog(`Loading rainbow tables for ${hashType}...`);
      addLog(`Table loaded with ${Math.floor(Math.random() * 5000) + 1000}K entries`);
    }
    
    const interval = setInterval(() => {
      if (currentProgress >= 100 || attemptsCount >= maxAttempts) {
        clearInterval(interval);
        setCracking(false);
        
        // If no success by end, add a final failed attempt
        if (!passwordFound && Math.random() > successProbability) {
          addLog("Attack finished without finding password");
        }
        
        return;
      }

      // Update progress
      const progressIncrement = method === 'bruteforce' ? 2 : 
                                method === 'rainbow' ? 7 :
                                method === 'hybrid' ? 4 : 5;
      currentProgress += progressIncrement;
      setProgress(Math.min(currentProgress, 100));
      
      // Glitch effect during cracking
      if (Math.random() > 0.8) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }
      
      // Update visualizer data
      setVisualizerData(prev => {
        const newData = [...prev];
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * newData.length);
          newData[idx] = Math.floor(Math.random() * 80) + 10;
        }
        return newData;
      });

      // Generate a new attempt
      if (attemptsCount < maxAttempts) {
        attemptsCount++;
        
        let attemptPassword: string;
        let keyspace: string;
        let entropy: number;
        
        // Generate attempt based on method
        if (method === 'dictionary') {
          const pwdObj = commonPasswords[Math.floor(Math.random() * commonPasswords.length)];
          attemptPassword = pwdObj.value;
          keyspace = `Category: ${pwdObj.category}`;
          entropy = analyzePasswordComplexity(attemptPassword).entropy;
          
          addLog(`Trying dictionary word: ${attemptPassword}`);
        } else if (method === 'bruteforce') {
          const strength = Math.random() > 0.7 ? 'medium' : 'weak';
          attemptPassword = generateRandomPassword(strength);
          keyspace = `Charset: a-zA-Z0-9${strength === 'medium' ? '+symbols' : ''}`;
          entropy = analyzePasswordComplexity(attemptPassword).entropy;
          
          addLog(`Brute forcing pattern: ${attemptPassword.replace(/./g, '*')}`);
        } else if (method === 'rainbow') {
          attemptPassword = generateHashString(hashType);
          keyspace = `Hash: ${hashType.toUpperCase()}`;
          entropy = 128; // Hash entropy
          
          addLog(`Lookup in rainbow table: ${attemptPassword.substring(0, 8)}...`);
        } else if (method === 'social') {
          // Smart wordlist uses patterns related to target name
          const patterns = ['birthday', 'pet', 'spouse', 'company', 'hobby'];
          const pattern = patterns[Math.floor(Math.random() * patterns.length)];
          attemptPassword = `${target.toLowerCase()}${Math.floor(Math.random() * 100)}`;
          keyspace = `Context: ${pattern}`;
          entropy = analyzePasswordComplexity(attemptPassword).entropy;
          
          addLog(`Trying personalized guess: [${pattern}] pattern`);
        } else if (method === 'hybrid') {
          // Hybrid combines dictionary with mutations
          const base = commonPasswords[Math.floor(Math.random() * commonPasswords.length)].value;
          const suffix = Math.floor(Math.random() * 1000);
          attemptPassword = `${base}${suffix}`;
          keyspace = `Base+Suffix`;
          entropy = analyzePasswordComplexity(attemptPassword).entropy;
          
          addLog(`Hybrid attack: ${base} + numeric suffix`);
        } else {
          attemptPassword = generateRandomPassword();
          keyspace = 'Generic';
          entropy = analyzePasswordComplexity(attemptPassword).entropy;
        }
        
        // Determine if this attempt is successful
        const isSuccessful = attemptsCount === maxAttempts - 1 && Math.random() < successProbability;
        
        const newAttempt: CrackAttempt = {
          method,
          password: attemptPassword,
          status: isSuccessful ? 'success' : attemptsCount === maxAttempts ? 'failed' : 'trying',
          time: new Date().toLocaleTimeString(),
          keyspace,
          entropy
        };

        setAttempts(prev => [...prev, newAttempt]);

        if (isSuccessful) {
          setPasswordFound(attemptPassword);
          addLog(`SUCCESS: Password found: ${attemptPassword}`);
          clearInterval(interval);
          setCracking(false);
          setProgress(100);
          
          // Trigger success glitch effect
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 300);
        }
      }
    }, methodDelay);
    
    return () => clearInterval(interval);
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
    <div className={`neo-panel p-4 ${isGlitching ? 'glitch' : ''} ${className}`}>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center">
          <div className="relative mr-3 group" 
               onMouseEnter={() => setProfilePicHover(true)}
               onMouseLeave={() => setProfilePicHover(false)}>
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 transition-all duration-300 ${profilePicHover ? 'border-cyan-400 scale-110' : ''}`}>
              {/* Profile picture with 3D globe overlay */}
              <div className="relative w-full h-full">
                <img
                  src="/profile-pic.jpg"
                  alt="Profile"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${profilePicHover ? 'opacity-40' : 'opacity-90'}`}
                />
                <div className={`absolute inset-0 transition-opacity duration-300 ${profilePicHover ? 'opacity-90' : 'opacity-0'}`}>
                  <ProfileGlobe />
                </div>
              </div>
            </div>
            <div className="absolute -inset-1 bg-green-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <GlitchText
            text="PASSWORD CRACKER"
            className="text-xl font-mono text-green-500 font-bold"
            intensity={3}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            className="bg-black text-green-400 border border-green-500/30 rounded px-2 py-1 text-sm font-mono"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            disabled={cracking}
          >
            {methods.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          
          {method === 'rainbow' && (
            <select
              className="bg-black text-green-400 border border-green-500/30 rounded px-2 py-1 text-sm font-mono"
              value={hashType}
              onChange={(e) => setHashType(e.target.value)}
              disabled={cracking}
            >
              {hashTypes.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          )}
          
          <button
            className={`flex items-center px-3 py-1 rounded text-sm font-mono ${cracking ? 'bg-gray-700 text-gray-400' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
            onClick={startCracking}
            disabled={cracking || !target}
          >
            {cracking ? (
              <>
                <FaHourglass className="mr-1 animate-pulse" /> 
                Cracking...
              </>
            ) : (
              <>
                <FaKey className="mr-1" /> 
                Start Attack
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Password input and analysis panel */}
        <div className="col-span-1 md:col-span-1 border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-sm mb-2 flex items-center">
            <FaLock className="mr-1" />
            <span>TARGET</span>
          </div>
          
          <input
            type="text"
            placeholder="Enter target password/hash"
            className="w-full p-2 mb-3 bg-black border border-green-500/30 text-green-400 font-mono text-sm"
            value={target}
            onChange={handlePasswordInput}
            disabled={cracking}
          />
          
          {target && target.length > 0 && complexity && (
            <div className="mt-2">
              <div className="font-mono text-xs mb-1 text-gray-500">PASSWORD STRENGTH</div>
              
              <div className="mb-2">
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      complexity.score <= 3 ? 'bg-red-500' : 
                      complexity.score <= 6 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`} 
                    style={{ width: `${(complexity.score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-mono mt-4">
                <div className="text-gray-500">Length:</div>
                <div className="text-green-400">{complexity.length}</div>
                
                <div className="text-gray-500">Entropy:</div>
                <div className="text-green-400">{complexity.entropy.toFixed(1)} bits</div>
                
                <div className="text-gray-500">Character Sets:</div>
                <div className="text-green-400">
                  {[
                    complexity.uppercase ? 'A-Z' : '',
                    complexity.lowercase ? 'a-z' : '',
                    complexity.numbers ? '0-9' : '',
                    complexity.symbols ? 'Symbols' : ''
                  ].filter(Boolean).join(', ')}
                </div>
                
                <div className="text-gray-500">Time to Crack:</div>
                <div className={`${
                  complexity.score <= 3 ? 'text-red-400' : 
                  complexity.score <= 6 ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>{complexity.timeToCrack}</div>
              </div>
              
              {/* Password visualizer */}
              <div className="mt-4 mb-2">
                <div className="font-mono text-xs mb-1 text-gray-500">PASSWORD PATTERN</div>
                <div className="flex h-10 items-end">
                  {visualizerData.map((height, i) => (
                    <div 
                      key={i} 
                      className={`w-1 mx-px ${
                        complexity.score <= 3 ? 'bg-red-500' : 
                        complexity.score <= 6 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`} 
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Method information */}
          <div className="mt-4">
            <div className="font-mono text-xs mb-1 text-gray-500">ATTACK METHOD</div>
            <div className="text-blue-400 text-xs mb-1 flex items-center">
              {methods.find(m => m.id === method)?.icon}
              <span className="ml-1">{methods.find(m => m.id === method)?.name}</span>
            </div>
            <div className="text-gray-500 text-xs mb-3">
              {methods.find(m => m.id === method)?.description}
            </div>
            
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="text-gray-500">Speed:</div>
              <div className="text-green-400">{methods.find(m => m.id === method)?.speed}</div>
              
              <div className="text-gray-500">Effectiveness:</div>
              <div className="text-green-400">{methods.find(m => m.id === method)?.effectiveness}</div>
              
              <div className="text-gray-500">Keyspace:</div>
              <div className="text-green-400">{getKeyspaceSize(method)}</div>
            </div>
          </div>
        </div>
        
        {/* Cracking progress and visualization */}
        <div className="col-span-1 md:col-span-2 border border-green-500/30 bg-black/50 rounded p-2">
          {/* Attempts table */}
          <div className="text-green-400 font-mono text-sm mb-2 flex items-center">
            <FaKey className="mr-1" />
            <span>CRACKING ATTEMPTS</span>
            
            {cracking && (
              <span className="ml-auto text-yellow-400 text-xs">
                <FaHourglass className="inline mr-1 animate-pulse" />
                Attack in progress...
              </span>
            )}
          </div>
          
          {cracking && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-400">{method.toUpperCase()} ATTACK PROGRESS</span>
                <span className="text-green-400">{Math.round(progress)}%</span>
              </div>
              <div 
                className="w-full h-2 bg-gray-800 rounded-full overflow-hidden" 
                ref={progressBarRef}
              >
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="overflow-y-auto max-h-64 custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-green-500/30 text-xs">
                  <th className="text-left py-1 px-2">TIME</th>
                  <th className="text-left py-1 px-2">METHOD</th>
                  <th className="text-left py-1 px-2 hidden md:table-cell">KEYSPACE</th>
                  <th className="text-left py-1 px-2">ATTEMPT</th>
                  <th className="text-left py-1 px-2 hidden md:table-cell">ENTROPY</th>
                  <th className="text-left py-1 px-2">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {attempts.length > 0 ? (
                  attempts.map((attempt, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-green-500/10 hover:bg-green-500/10 ${
                        attempt.status === 'success' ? 'bg-green-500/20' : ''
                      }`}
                    >
                      <td className="py-1 px-2 font-mono text-xs">{attempt.time}</td>
                      <td className="py-1 px-2 text-xs">
                        {methods.find(m => m.id === attempt.method)?.name}
                      </td>
                      <td className="py-1 px-2 text-xs hidden md:table-cell">
                        {attempt.keyspace}
                      </td>
                      <td className="py-1 px-2 font-mono">
                        {method === 'rainbow' 
                          ? <span className="text-purple-400">{attempt.password.substring(0, 8)}...</span>
                          : attempt.password
                        }
                      </td>
                      <td className="py-1 px-2 text-xs hidden md:table-cell">
                        {attempt.entropy?.toFixed(1)}
                      </td>
                      <td className="py-1 px-2">
                        <span className={`flex items-center text-xs ${
                          attempt.status === 'success' 
                            ? 'text-green-500' 
                            : attempt.status === 'trying'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}>
                          {attempt.status === 'success' 
                            ? <FaCheckCircle className="mr-1" /> 
                            : attempt.status === 'trying'
                            ? <FaCog className="mr-1 animate-spin" />
                            : <FaSkull className="mr-1" />}
                          {attempt.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No cracking attempts yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Console/Log Area */}
          <div className="mt-4">
            <div className="text-green-400 font-mono text-xs mb-1 flex items-center">
              <span>CONSOLE OUTPUT</span>
              <div className="ml-auto flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="bg-black border border-green-500/20 h-28 overflow-y-auto p-2 font-mono text-xs custom-scrollbar">
              {logs.length > 0 ? (
                logs.map((log, idx) => (
                  <div key={idx} className="mb-1">
                    {log.includes('SUCCESS') ? (
                      <span className="text-green-400">{log}</span>
                    ) : log.includes('ERROR') ? (
                      <span className="text-red-400">{log}</span>
                    ) : log.includes('WARNING') ? (
                      <span className="text-yellow-400">{log}</span>
                    ) : (
                      <span className="text-green-400">{log}</span>
                    )}
                  </div>
                ))
              ) : (
                <TypewriterEffect 
                  text="Password cracker initialized. Enter a target and select attack method..."
                  speed={30}
                  className="text-green-400"
                />
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
        {/* Results panel for successful crack */}
      {passwordFound && (
        <div className="border border-red-500/50 bg-red-500/10 rounded p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl text-red-500 flex items-center">
              <FaUnlock className="mr-2" />
              PASSWORD CRACKED
            </h3>
            <div className="text-xs text-red-400">
              Time elapsed: {Math.floor(Math.random() * 100) + 10}s
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-mono text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-xs text-gray-500">TARGET:</div>
                  <div className="col-span-2 text-red-400">{target}</div>
                  
                  <div className="text-xs text-gray-500">PASSWORD:</div>
                  <div className="col-span-2 text-red-400 font-bold">{passwordFound}</div>
                  
                  <div className="text-xs text-gray-500">METHOD:</div>
                  <div className="col-span-2 text-red-400">
                    {methods.find(m => m.id === method)?.name}
                  </div>
                  
                  <div className="text-xs text-gray-500">ATTEMPTS:</div>
                  <div className="col-span-2 text-red-400">{attempts.length}</div>
                </div>
              </div>
              
              {/* Interactive globe visualization */}
              <div className="mt-4">
                <button
                  className="text-xs border border-red-500/30 bg-red-500/10 rounded px-2 py-1 text-red-400 hover:bg-red-500/20 flex items-center"
                  onClick={toggleGlobe}
                >
                  <FaKey className="mr-1" />
                  {showGlobe ? 'Hide' : 'Show'} Global Breach Visualization
                </button>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">SECURITY ASSESSMENT:</div>
              <div className="text-xs text-red-400 mb-3">
                {complexity && complexity.score <= 3 && (
                  <>
                    This password is very weak and can be cracked in minutes.
                    Consider using longer passwords with mixed character types.
                  </>
                )}
                {complexity && complexity.score > 3 && complexity.score <= 6 && (
                  <>
                    This password offers moderate protection but could be
                    cracked with dedicated resources. Consider adding special characters.
                  </>
                )}
                {complexity && complexity.score > 6 && (
                  <>
                    This password is relatively strong but was still cracked.
                    Consider using a password manager with unique passwords.
                  </>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mb-1">RECOMMENDATIONS:</div>
              <div className="text-xs text-blue-400">
                <div className="mb-1">• Use random generation with high entropy</div>
                <div className="mb-1">• Combine multiple words with special characters</div>
                <div className="mb-1">• Use different passwords for each service</div>
                <div className="mb-1">• Consider using a password manager</div>
              </div>
            </div>
          </div>
          
          {/* 3D Globe visualization for cracked password */}
          {showGlobe && (
            <div className="mt-4 h-64 border border-red-500/30 rounded overflow-hidden relative">
              <div className="absolute inset-0">
                <Globe3D />
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-red-400 text-xs px-2 py-1 rounded">
                <span className="font-mono">Password breach visualization</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-red-400 text-xs px-2 py-1 rounded">
                <span className="font-mono">Click and drag to explore</span>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-red-400 text-xs px-2 py-1 rounded flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse"></span>
                <span className="font-mono">{Math.floor(Math.random() * 1000) + 500} similar breaches detected</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          <TypewriterEffect 
            text={[
              "Password analyzer active", 
              "System security monitoring", 
              "Waiting for user input"
            ]}
            speed={30}
            loop={true}
            deleteSpeed={10}
          />
        </div>
        <div>
          {attempts.length > 0 && (
            <span>Attempts: {attempts.length}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordCracker;