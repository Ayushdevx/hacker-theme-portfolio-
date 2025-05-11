"use client";

import { useState, useEffect, useRef } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaBatteryFull, FaWifi, FaBars, FaLock, FaServer, FaShieldAlt, FaTerminal } from "react-icons/fa";
import { MdMemory, MdCpu, MdNetworkWifi } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";

const NAV_ITEMS = [
  { label: "About", command: "cd about", href: "#about" },
  { label: "Skills", command: "ls skills", href: "#skills" },
  { label: "Certificates", command: "ls certificates", href: "#certificates" },
  { label: "Projects", command: "ls projects", href: "#projects" },
  { label: "Contact", command: "cat contact.txt", href: "#contact" },
];

const SOCIALS = [
  { 
    icon: <FaGithub />, 
    href: "https://github.com/", 
    name: "GitHub", 
    command: "ssh git@github.com"
  },
  { 
    icon: <FaLinkedin />, 
    href: "https://linkedin.com/", 
    name: "LinkedIn",
    command: "curl -X GET api.linkedin.com/profile"
  },
  { 
    icon: <FaInstagram />, 
    href: "https://instagram.com/", 
    name: "Instagram",
    command: "curl -X GET api.instagram.com/feed"
  },
];

export default function HackerNavbar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showLock, setShowLock] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const [battery, setBattery] = useState(100);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [networkStatus, setNetworkStatus] = useState("Connected");
  const [securityStatus, setSecurityStatus] = useState("Secure");
  const [securityLevel, setSecurityLevel] = useState(4);
  const [pingTime, setPingTime] = useState(0);

  const terminalRef = useRef<HTMLDivElement>(null);

  // Handle time display and system stats
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
      setCpu(Math.floor(Math.random() * 40) + 10);
      setRam(Math.floor(Math.random() * 60) + 30);
      setBattery((b) => (b > 10 ? b - 1 : 100));
      setPingTime(Math.floor(Math.random() * 15) + 5);
      
      // Random glitch effect
      if (Math.random() > 0.95) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
      }
      
      // Random text glitch
      if (Math.random() > 0.98) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 300);
      }
      
      // Simulate network status changes
      if (Math.random() > 0.95) {
        const states = ["Connected", "Encrypted", "VPN Active", "Firewall Enabled"];
        setNetworkStatus(states[Math.floor(Math.random() * states.length)]);
      }
      
      // Simulate security status changes
      if (Math.random() > 0.98) {
        const states = ["Secure", "Warning: Port Scan Detected", "Secure", "Monitoring", "Secure"];
        const newStatus = states[Math.floor(Math.random() * states.length)];
        setSecurityStatus(newStatus);
        setSecurityLevel(newStatus === "Warning: Port Scan Detected" ? 2 : 4);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const simulateTyping = (command: string, href: string) => {
    if (isTyping) return;
    
    setIsTyping(true);
    setTypedCommand("");
    setActiveNav(href);
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= command.length) {
        setTypedCommand(command.substring(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
        setCommandHistory(prev => [...prev, `> ${command}`]);
        setTypedCommand("");
        
        setTimeout(() => {
          setCommandHistory(prev => [...prev, "Executing command..."]);
          
          setTimeout(() => {
            window.location.href = href;
            setIsTyping(false);
          }, 800);
        }, 300);
      }
    }, 50);
  };

  const simulateSocialCommand = (command: string, href: string) => {
    if (isTyping) return;
    
    setIsTyping(true);
    setTypedCommand("");
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= command.length) {
        setTypedCommand(command.substring(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
        setCommandHistory(prev => [...prev, `> ${command}`]);
        setTypedCommand("");
        
        setTimeout(() => {
          setCommandHistory(prev => [...prev, "Establishing connection..."]);
          
          setTimeout(() => {
            setCommandHistory(prev => [...prev, "Connection successful. Redirecting..."]);
            
            setTimeout(() => {
              window.open(href, "_blank");
              setIsTyping(false);
              setCommandHistory([]);
            }, 1000);
          }, 800);
        }, 500);
      }
    }, 50);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 font-mono text-xs md:text-sm ${glitch ? 'animate-glitch' : ''}`}>
      {/* Top Bar */}
      <div className="neo-panel bg-black bg-opacity-80 text-green-500 px-2 py-1 flex justify-between items-center border-b border-green-500">
        <div className="flex items-center space-x-2">
          <div 
            className="relative group cursor-pointer"
            onClick={() => setShowLock(!showLock)}
          >
            <FaLock className={`text-${securityLevel === 4 ? 'green' : 'yellow'}-500`} />
            {showLock && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-green-500 p-2 text-xs z-10">
                <p className={`text-${securityLevel === 4 ? 'green' : 'yellow'}-500 flex items-center`}>
                  <FaShieldAlt className="mr-1" /> 
                  Status: {securityStatus}
                </p>
                <div className="mt-1 h-1 w-full bg-gray-800">
                  <div 
                    className={`h-full bg-${securityLevel === 4 ? 'green' : 'yellow'}-500`} 
                    style={{ width: `${securityLevel * 25}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <span 
            data-text="YK_TERM v1.3.7" 
            className={`${glitchText ? 'glitch' : ''}`}
          >
            YK_TERM v1.3.7
          </span>
          
          {securityStatus.includes("Warning") && (
            <span className="text-yellow-500 flex items-center animate-pulse">
              <IoIosWarning className="mr-1" /> Alert
            </span>
          )}
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`hover:text-green-400 transition-colors ${activeNav === item.href ? 'text-green-300 font-bold' : ''}`}
              onMouseEnter={() => simulateTyping(item.command, item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center">
              <MdCpu className="mr-1" />
              <span>{cpu}%</span>
            </div>
            <div className="flex items-center">
              <MdMemory className="mr-1" />
              <span>{ram}%</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <MdNetworkWifi className="mr-1" />
            <span className="hidden md:inline">{networkStatus} ({pingTime}ms)</span>
          </div>
          
          <div className="flex items-center">
            <FaBatteryFull className="mr-1" />
            <span>{battery}%</span>
          </div>
          
          <div className="flex items-center border-l border-green-500 pl-2">
            <span>{time}</span>
          </div>
          
          <button 
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden bg-transparent border border-green-500 p-1"
          >
            <FaBars />
          </button>
        </div>
      </div>
      
      {/* Command Line Interface */}
      <div 
        ref={terminalRef}
        className="bg-black bg-opacity-95 text-green-500 px-2 py-1 border-b border-green-500 hidden md:block"
      >
        <div className="flex items-center">
          <span className="mr-2 text-green-400">$</span>
          <span>{typedCommand}</span>
          <span className="terminal-cursor">▌</span>
        </div>
        {commandHistory.map((cmd, i) => (
          <div key={i} className="text-xs">{cmd}</div>
        ))}
      </div>
      
      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-black bg-opacity-95 border-b border-green-500">
          <div className="p-2 space-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block hover:text-green-400 py-1 transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                <span className="text-green-700 mr-2">&gt;</span>
                {item.command}
              </a>
            ))}
            
            <div className="border-t border-green-500 mt-2 pt-2 flex justify-between">
              {SOCIALS.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg hover:text-green-400 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Social Icons (Desktop) */}
      <div className="hidden md:block fixed bottom-0 left-0 neo-panel bg-black bg-opacity-80 p-2 m-4 rounded-md">
        <div className="flex flex-col space-y-3">
          {SOCIALS.map((social, i) => (
            <a 
              key={i} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg hover:text-green-400 transition-transform hover:scale-110 transform"
              onMouseEnter={() => simulateSocialCommand(social.command, social.href)}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

  // Handle time display and system stats
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
      setCpu(Math.floor(Math.random() * 40) + 10);
      setRam(Math.floor(Math.random() * 60) + 30);
      setBattery((b) => (b > 10 ? b - 1 : 100));
      setPingTime(Math.floor(Math.random() * 15) + 5);
      
      // Random glitch effect
      if (Math.random() > 0.95) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
      }
      
      // Random text glitch
      if (Math.random() > 0.98) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 300);
      }
      
      // Simulate network status changes
      if (Math.random() > 0.95) {
        const states = ["Connected", "Encrypted", "VPN Active", "Firewall Enabled"];
        setNetworkStatus(states[Math.floor(Math.random() * states.length)]);
      }
      
      // Simulate security status changes
      if (Math.random() > 0.98) {
        const states = ["Secure", "Warning: Port Scan Detected", "Secure", "Monitoring", "Secure"];
        const newStatus = states[Math.floor(Math.random() * states.length)];
        setSecurityStatus(newStatus);
        setSecurityLevel(newStatus === "Warning: Port Scan Detected" ? 2 : 4);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const simulateTyping = (command: string, href: string) => {
    if (isTyping) return;
    
    setIsTyping(true);
    setTypedCommand("");
    setActiveNav(href);
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= command.length) {
        setTypedCommand(command.substring(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
        setCommandHistory(prev => [...prev, `> ${command}`]);
        setTypedCommand("");
        
        setTimeout(() => {
          setCommandHistory(prev => [...prev, "Executing command..."]);
          
          setTimeout(() => {
            window.location.href = href;
            setIsTyping(false);
          }, 800);
        }, 300);
      }
    }, 50);
  };

  const simulateSocialCommand = (command: string, href: string) => {
    if (isTyping) return;
    
    setIsTyping(true);
    setTypedCommand("");
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= command.length) {
        setTypedCommand(command.substring(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
        setCommandHistory(prev => [...prev, `> ${command}`]);
        setTypedCommand("");
        
        setTimeout(() => {
          setCommandHistory(prev => [...prev, "Establishing connection..."]);
          
          setTimeout(() => {
            setCommandHistory(prev => [...prev, "Connection successful. Redirecting..."]);
            
            setTimeout(() => {
              window.open(href, "_blank");
              setIsTyping(false);
              setCommandHistory([]);
            }, 1000);
          }, 800);
        }, 500);
      }
    }, 50);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 font-mono text-xs md:text-sm ${glitch ? 'animate-glitch' : ''}`}>
      {/* Top Bar */}
      <div className="neo-panel bg-black bg-opacity-80 text-green-500 px-2 py-1 flex justify-between items-center border-b border-green-500">
        <div className="flex items-center space-x-2">
          <div 
            className="relative group cursor-pointer"
            onClick={() => setShowLock(!showLock)}
          >
            <FaLock className={`text-${securityLevel === 4 ? 'green' : 'yellow'}-500`} />
            {showLock && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-green-500 p-2 text-xs z-10">
                <p className={`text-${securityLevel === 4 ? 'green' : 'yellow'}-500 flex items-center`}>
                  <FaShieldAlt className="mr-1" /> 
                  Status: {securityStatus}
                </p>
                <div className="mt-1 h-1 w-full bg-gray-800">
                  <div 
                    className={`h-full bg-${securityLevel === 4 ? 'green' : 'yellow'}-500`} 
                    style={{ width: `${securityLevel * 25}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <span 
            data-text="YK_TERM v1.3.7" 
            className={`${glitchText ? 'glitch' : ''}`}
          >
            YK_TERM v1.3.7
          </span>
          
          {securityStatus.includes("Warning") && (
            <span className="text-yellow-500 flex items-center animate-pulse">
              <IoIosWarning className="mr-1" /> Alert
            </span>
          )}
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`hover:text-green-400 transition-colors ${activeNav === item.href ? 'text-green-300 font-bold' : ''}`}
              onMouseEnter={() => simulateTyping(item.command, item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center">
              <MdCpu className="mr-1" />
              <span>{cpu}%</span>
            </div>
            <div className="flex items-center">
              <MdMemory className="mr-1" />
              <span>{ram}%</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <MdNetworkWifi className="mr-1" />
            <span className="hidden md:inline">{networkStatus} ({pingTime}ms)</span>
          </div>
          
          <div className="flex items-center">
            <FaBatteryFull className="mr-1" />
            <span>{battery}%</span>
          </div>
          
          <div className="flex items-center border-l border-green-500 pl-2">
            <span>{time}</span>
          </div>
          
          <button 
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden bg-transparent border border-green-500 p-1"
          >
            <FaBars />
          </button>
        </div>
      </div>
      
      {/* Command Line Interface */}
      <div 
        ref={terminalRef}
        className="bg-black bg-opacity-95 text-green-500 px-2 py-1 border-b border-green-500 hidden md:block"
      >
        <div className="flex items-center">
          <span className="mr-2 text-green-400">$</span>
          <span>{typedCommand}</span>
          <span className="terminal-cursor">▌</span>
        </div>
        {commandHistory.map((cmd, i) => (
          <div key={i} className="text-xs">{cmd}</div>
        ))}
      </div>
      
      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-black bg-opacity-95 border-b border-green-500">
          <div className="p-2 space-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block hover:text-green-400 py-1 transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                <span className="text-green-700 mr-2">&gt;</span>
                {item.command}
              </a>
            ))}
            
            <div className="border-t border-green-500 mt-2 pt-2 flex justify-between">
              {SOCIALS.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg hover:text-green-400 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Social Icons (Desktop) */}
      <div className="hidden md:block fixed bottom-0 left-0 neo-panel bg-black bg-opacity-80 p-2 m-4 rounded-md">
        <div className="flex flex-col space-y-3">
          {SOCIALS.map((social, i) => (
            <a 
              key={i} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg hover:text-green-400 transition-transform hover:scale-110 transform"
              onMouseEnter={() => simulateSocialCommand(social.command, social.href)}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      setCpu(Math.floor(Math.random() * 40) + 10);
      setRam(Math.floor(Math.random() * 60) + 30);
      setBattery((b) => (b > 10 ? b - 1 : 100));
      if (Math.random() > 0.97) setGlitch(true);
      else setGlitch(false);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = 60;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.18';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#39ff14';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    const interval = setInterval(draw, 60);
    matrixRef.current?.appendChild(canvas);
    return () => {
      clearInterval(interval);
      if (matrixRef.current) matrixRef.current.innerHTML = '';
    };
  }, []);

  const handleNav = (item: typeof NAV_ITEMS[0]) => {
    setIsTyping(true);
    setTypedCommand("");
    setActiveNav(item.href);
    setMobileMenu(false);
    let i = 0;
    const type = () => {
      setTypedCommand(item.command.slice(0, i + 1));
      i++;
      if (i < item.command.length) {
        setTimeout(type, 40);
      } else {
        setTimeout(() => {
          setIsTyping(false);
          setCommandHistory((h) => [item.command, ...h.slice(0, 2)]);
          document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    };
    type();
  };

  return (
    <>
      <nav className="w-full bg-black border-b border-green-500 text-green-400 font-mono flex items-center px-4 py-2 z-50 shadow-lg fixed top-0 left-0" style={{position:'relative',overflow:'hidden'}}>
        {/* Matrix rain overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" id="matrix-rain-navbar" ref={matrixRef}></div>
        {/* Hamburger for mobile */}
        <button className="md:hidden mr-2 text-green-400" onClick={() => setMobileMenu(!mobileMenu)}>
          <FaBars size={24} />
        </button>
        {/* Terminal prompt */}
        <div className="flex items-center gap-2 text-lg relative flex-shrink-0">
          <span className="absolute -left-6 top-1 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1"></span>
            <span className="text-green-400 text-xs font-bold">ONLINE</span>
          </span>
          <span className={`text-green-500 ${glitch ? "glitch" : ""}`}>root</span>
          <span className="text-white">@</span>
          <span className={`text-cyan-400 ${glitch ? "glitch" : ""}`}>yashika-portfolio</span>
          <span className="text-white">:~$</span>
          <span className="ml-2">
            {isTyping ? (
              <span>{typedCommand}<span className="animate-pulse">█</span></span>
            ) : (
              <span className="text-green-300">{typedCommand || ""}</span>
            )}
          </span>
        </div>
        {/* Desktop nav */}
        <div className="flex-1 items-center gap-4 ml-8 hidden md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`hover:text-cyan-400 transition-colors px-2 py-1 ${activeNav === item.href ? "underline" : ""}`}
              onClick={() => handleNav(item)}
              disabled={isTyping}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* System info and socials */}
        <div className="flex items-center gap-4 text-xs flex-shrink-0">
          <span>CPU: <span className="text-yellow-400">{cpu}%</span></span>
          <span>RAM: <span className="text-yellow-400">{ram}%</span></span>
          <span className="flex items-center gap-1">
            <FaBatteryFull className="text-green-400" /> {battery}%
          </span>
          <span className="flex items-center gap-1">
            <FaWifi className="text-cyan-400" /> 5G
          </span>
          <span className="text-cyan-400">{time}</span>
          {SOCIALS.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-cyan-400 text-lg ml-2">
              {s.icon}
            </a>
          ))}
          <button
            className="ml-2 px-2 py-1 border border-green-500 rounded text-green-400 hover:bg-green-500/10 transition"
            onClick={() => setShowLock(true)}
            title="Lock Screen"
          >
            Lock
          </button>
        </div>
      </nav>
      {/* Mobile nav menu */}
      {mobileMenu && (
        <div className="fixed top-14 left-0 w-full bg-black/95 border-b border-green-500 z-50 flex flex-col items-center py-4 md:hidden animate-slide-down">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`w-full text-left px-8 py-3 text-green-400 hover:text-cyan-400 transition-colors ${activeNav === item.href ? "underline" : ""}`}
              onClick={() => handleNav(item)}
              disabled={isTyping}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {/* Command history */}
      <div className="fixed top-14 left-4 z-40 text-green-500 font-mono text-xs opacity-70">
        {commandHistory.map((cmd, idx) => (
          <div key={idx} className="mb-1">{cmd}</div>
        ))}
      </div>
      {/* Lock screen overlay */}
      {showLock && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[100]">
          <div className="text-green-400 text-3xl mb-8 font-mono animate-pulse">[ SYSTEM LOCKED ]</div>
          <button
            className="px-6 py-2 bg-green-500 text-black rounded font-bold text-lg hover:bg-green-400 transition"
            onClick={() => setShowLock(false)}
          >
            UNLOCK
          </button>
        </div>
      )}
      <style>{`
        .glitch {
          animation: glitch 0.5s linear 1;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 red, -2px 0 blue; }
          20% { text-shadow: -2px 0 red, 2px 0 blue; }
          40% { text-shadow: 2px 2px red, -2px -2px blue; }
          60% { text-shadow: -2px 2px red, 2px -2px blue; }
          80% { text-shadow: 2px 0 red, -2px 0 blue; }
          100% { text-shadow: 0 0 red, 0 0 blue; }
        }
        .animate-slide-down {
          animation: slide-down 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
} 