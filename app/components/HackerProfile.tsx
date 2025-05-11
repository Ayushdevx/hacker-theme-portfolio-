'use client';

import { useState, useEffect, useRef } from 'react';
import Globe3D from './Globe3D';
import ProfileGlobe from './ProfileGlobe';
import GlitchText from './GlitchText';
import TypewriterEffect from './TypewriterEffect';
import ProfilePic3D from './ProfilePic3D';
import { FaFingerprint, FaServer, FaShieldAlt, FaLock, FaUnlock, FaUserSecret, FaNetworkWired, FaCode } from 'react-icons/fa';

const certificates = [
  {
    src: "/certificate1.jpg",
    alt: "Infosys Python for Beginners Certificate",
    label: "Python for Beginners (Infosys, 2024)"
  },
  {
    src: "/certificate2.jpg",
    alt: "Augmented & Virtual Reality Bootcamp Certificate",
    label: "AR/VR Bootcamp (NIELIT, 2025)"
  },
  {
    src: "/certificate3.jpg",
    alt: "Smart India Hackathon Certificate",
    label: "Smart India Hackathon (2024)"
  }
];

const threatLocations = [
  "New York, USA",
  "Tokyo, Japan",
  "London, UK",
  "Sydney, Australia",
  "Moscow, Russia",
  "Seoul, South Korea",
  "Beijing, China",
  "São Paulo, Brazil",
  "Mumbai, India",
  "Paris, France"
];

const skills = [
  { name: "Penetration Testing", level: 85 },
  { name: "Network Security", level: 92 },
  { name: "Cryptography", level: 78 },
  { name: "Malware Analysis", level: 72 },
  { name: "OSINT", level: 88 },
  { name: "Forensics", level: 76 },
  { name: "Web Security", level: 90 },
  { name: "Mobile Security", level: 68 }
];

const HackerProfile = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [imageGlitch, setImageGlitch] = useState(false);
  const [stats, setStats] = useState({
    hackingLevel: 0,
    securityScore: 0,
    systemAccess: 0
  });
  const [showStats, setShowStats] = useState(false);
  const [threatLevel, setThreatLevel] = useState(Math.floor(Math.random() * 100));
  const [activeThreats, setActiveThreats] = useState<string[]>([]);
  const [authStatus, setAuthStatus] = useState<'authenticating' | 'verified' | 'locked'>('authenticating');
  const [biometricProgress, setBiometricProgress] = useState(0);
  const globeRef = useRef<HTMLCanvasElement>(null);
  
  // Random IP generator
  const getRandomIP = () => {
    return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
  };

  useEffect(() => {
    // Simulate loading stats with a delay to show the authentication first
    setTimeout(() => {
      setAuthStatus('verified');
      
      const interval = setInterval(() => {
        setStats(prev => ({
          hackingLevel: Math.min(prev.hackingLevel + 1, 100),
          securityScore: Math.min(prev.securityScore + 2, 100),
          systemAccess: Math.min(prev.systemAccess + 1, 100)
        }));
        
        setStats(prev => {
          if (prev.hackingLevel >= 100 && prev.securityScore >= 100 && prev.systemAccess >= 100) {
            clearInterval(interval);
            setShowStats(true);
          }
          return prev;
        });
      }, 30);
    }, 3000);
    
    // Simulate biometric verification
    const bioInterval = setInterval(() => {
      setBiometricProgress(prev => {
        const newValue = prev + (Math.random() * 4);
        if (newValue >= 100) {
          clearInterval(bioInterval);
          return 100;
        }
        return newValue;
      });
    }, 100);
    
    // Randomly change threat level periodically
    const threatInterval = setInterval(() => {
      setThreatLevel(Math.floor(Math.random() * 100));
      
      // Random chance to trigger glitch
      if (Math.random() > 0.85) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
      
      // Random chance to trigger image glitch
      if (Math.random() > 0.9) {
        setImageGlitch(true);
        setTimeout(() => setImageGlitch(false), 300);
      }
    }, 5000);
    
    // Update active threats
    const threatUpdateInterval = setInterval(() => {
      const numThreats = Math.floor(Math.random() * 3);
      const newThreats = [];
      
      for (let i = 0; i < numThreats; i++) {
        const location = threatLocations[Math.floor(Math.random() * threatLocations.length)];
        const ip = getRandomIP();
        newThreats.push(`${location} (${ip})`);
      }
      
      setActiveThreats(newThreats);
    }, 8000);
    
    return () => {
      clearInterval(threatInterval);
      clearInterval(threatUpdateInterval);
    };
  }, []);

  // Initialize 3D Globe
  useEffect(() => {
    if (globeRef.current) {
      const canvas = globeRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let rotation = 0;
      const points: Array<{x: number, y: number, z: number, size?: number, color?: string}> = [];
      const numPoints = 1000;

      // Generate random points for the globe
      for (let i = 0; i < numPoints; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);
        points.push({ x, y, z });
      }

      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw points
        points.forEach(point => {
          const x = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
          const z = point.x * Math.sin(rotation) + point.z * Math.cos(rotation);
          const scale = 100;
          const x2d = x * scale + canvas.width / 2;
          const y2d = point.y * scale + canvas.height / 2;
          
          if (z > 0) {
            ctx.fillStyle = `rgba(57, 255, 20, ${z * 0.5})`;
            ctx.beginPath();
            ctx.arc(x2d, y2d, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        rotation += 0.005;
        requestAnimationFrame(animate);
      };

      animate();
    }

    // No need to clear interval here as it's not defined in this scope
    return () => {
      // Cleanup function
    };
  }, []);

  const handleGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 1000);
  };

  return (
    <div className={`neo-panel bg-black bg-opacity-90 text-green-500 p-6 rounded-lg max-w-4xl mx-auto my-8 ${isGlitching ? 'glitch' : ''}`}>
      {/* Authentication Status Display */}
      {authStatus === 'authenticating' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="neo-panel bg-black p-6 rounded-lg max-w-md w-full border border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-400 text-xl font-mono flex items-center">
                <FaFingerprint className="mr-2" /> Biometric Verification
              </h3>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-green-400">
                      Scanning Fingerprint...
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-400">
                      {Math.round(biometricProgress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-900">
                  <div 
                    style={{ width: `${biometricProgress}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <TypewriterEffect 
                  text={[
                    "Initializing security protocols...", 
                    "Analyzing fingerprint patterns...",
                    "Matching against database...",
                    "Verifying identity...",
                    "Access granted."
                  ]}
                  speed={40}
                  className="text-yellow-400 text-sm"
                  loop={false}
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-24 h-24 rounded-full border-2 border-green-500 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src="/profile-pic.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover opacity-80"
                    onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
                  />
                  {/* Mini globe in authentication screen */}
                  <div className="absolute inset-0 opacity-40">
                    <ProfileGlobe />
                  </div>
                </div>
                <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin-slow pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 pointer-events-none z-10">
                  <FaFingerprint className="text-green-500 text-3xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="relative group">
            <div 
              className={`w-32 h-32 rounded-full overflow-hidden border-2 border-green-500 
                ${imageGlitch ? 'glitch' : ''} group-hover:border-cyan-400 transition-colors duration-300`}
              style={{ 
                background: '#111', 
                position: 'relative',
                aspectRatio: '1/1'
              }}
            >
              {/* Regular Profile Picture with hover effect */}
              <div className="w-full h-full absolute inset-0">
                <img
                  src="/profile-pic.jpg"
                  alt="Yashika Kainth"
                  className={`w-full h-full object-cover ${imageGlitch ? 'glitch-effect' : ''} group-hover:opacity-70 transition-opacity duration-300`}
                  onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
                />
              </div>
              
              {/* Scanner line effect */}
              <div 
                className="absolute left-0 w-full h-1 bg-green-500 opacity-70 pointer-events-none"
                style={{ 
                  top: `${(Math.sin(Date.now() / 1000) + 1) * 50}%`,
                  boxShadow: '0 0 10px rgba(57, 255, 20, 0.7)'
                }}
              ></div>
              
              {/* Interactive Globe overlay (hidden by default, shown on hover) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <ProfileGlobe />
                </div>
              </div>
            </div>
            
            {/* Status indicators */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center z-10 group-hover:bg-cyan-400 transition-colors duration-300">
              <FaLock className="mr-1 text-xs" /> SECURE
            </div>
            
            <div className="absolute -bottom-2 -left-2 bg-black border border-green-500 text-green-500 text-xs px-2 py-1 rounded-full z-10 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-colors duration-300">
              ID: YK-42
            </div>
            
            <div className="absolute -inset-1 bg-green-500/20 group-hover:bg-cyan-400/20 rounded-full blur-lg pointer-events-none transition-colors duration-300"></div>
            
            {/* Hover instruction text */}
            <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 bg-black/70 border border-green-500 text-green-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <span className="font-mono">Interactive Profile</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center">
              <GlitchText 
                text="YASHIKA_KAINTH" 
                className="text-3xl font-bold mb-2 text-green-400"
                intensity={7}
              />
              <div className="ml-2 bg-green-900 text-green-400 text-xs px-2 py-1 rounded">
                <TypewriterEffect 
                  text={["ADMIN", "VERIFIED", "SECURE"]} 
                  speed={100} 
                  loop={true} 
                  deleteSpeed={50}
                />
              </div>
            </div>
            
            <div className="flex items-center text-green-400 mb-4">
              <FaUserSecret className="mr-2" />
              <TypewriterEffect 
                text="Ethical Hacker | Security Researcher | Program Coordinator"
                speed={30}
                className="text-sm"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="neo-panel p-2 rounded text-center">
                <div className="text-xl text-blue-400">{stats.hackingLevel}%</div>
                <div className="text-xs text-green-400">Hacking Level</div>
                <div className="w-full h-1 bg-gray-800 mt-1">
                  <div className="h-full bg-blue-400" style={{ width: `${stats.hackingLevel}%` }}></div>
                </div>
              </div>
              <div className="neo-panel p-2 rounded text-center">
                <div className="text-xl text-yellow-400">{stats.securityScore}%</div>
                <div className="text-xs text-green-400">Security Score</div>
                <div className="w-full h-1 bg-gray-800 mt-1">
                  <div className="h-full bg-yellow-400" style={{ width: `${stats.securityScore}%` }}></div>
                </div>
              </div>
              <div className="neo-panel p-2 rounded text-center">
                <div className="text-xl text-red-400">{stats.systemAccess}%</div>
                <div className="text-xs text-green-400">System Access</div>
                <div className="w-full h-1 bg-gray-800 mt-1">
                  <div className="h-full bg-red-400" style={{ width: `${stats.systemAccess}%` }}></div>
                </div>
              </div>
            </div>
            
            {/* Threat level indicator */}
            <div className="neo-panel p-2 rounded">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-yellow-400 flex items-center">
                  <FaShieldAlt className="mr-1" /> THREAT LEVEL
                </div>
                <div className={`text-xs ${threatLevel > 70 ? 'text-red-400' : threatLevel > 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {threatLevel > 70 ? 'HIGH' : threatLevel > 30 ? 'MEDIUM' : 'LOW'} - {threatLevel}%
                </div>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${threatLevel > 70 ? 'bg-red-400' : threatLevel > 30 ? 'bg-yellow-400' : 'bg-green-400'}`} 
                  style={{ width: `${threatLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neo-panel p-4 rounded">
            <h3 className="text-xl text-blue-400 mb-2 flex items-center">
              <FaServer className="mr-2" /> Experience
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-bold">Ethical Hacker</span>
                  <span className="text-yellow-400 text-sm">2025 - Present</span>
                </div>
                <div className="text-blue-400 text-sm">TryHackMe</div>
                <p className="text-xs text-green-400/70 mt-1">
                  Completed various rooms and challenges in ethical hacking and penetration testing
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-bold">Program Coordinator</span>
                  <span className="text-yellow-400 text-sm">2023 - Present</span>
                </div>
                <div className="text-blue-400 text-sm">Chandigarh Group of Colleges</div>
                <p className="text-xs text-green-400/70 mt-1">
                  Contributing to academic and organizational initiatives
                </p>
              </div>
            </div>
          </div>

          <div className="neo-panel p-4 rounded">
            <h3 className="text-xl text-blue-400 mb-2 flex items-center">
              <FaCode className="mr-2" /> Skills Matrix
            </h3>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-green-400 text-sm">{skill.name}</span>
                    <span className="text-yellow-400 text-xs">{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neo-panel p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl text-blue-400 flex items-center">
                <FaNetworkWired className="mr-2" /> Network Status
              </h3>
              <div className="bg-green-900 text-green-400 text-xs px-2 py-1 rounded flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                ONLINE
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-green-400">Local IP:</span>
                <span className="text-yellow-400 font-mono">192.168.1.42</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-400">VPN Status:</span>
                <span className="text-yellow-400 font-mono">Active (AES-256)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-400">Location:</span>
                <span className="text-yellow-400 font-mono">Undisclosed</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-400">Uptime:</span>
                <TypewriterEffect 
                  text={["16:34:12", "16:34:13", "16:34:14", "16:34:15"]} 
                  speed={1000} 
                  className="text-yellow-400 font-mono"
                  loop={true}
                  deleteSpeed={1}
                />
              </div>
              <div className="text-xs mt-3">
                <div className="text-green-400 mb-1">Active Threats:</div>
                {activeThreats.length > 0 ? (
                  <ul className="text-red-400 font-mono space-y-1">
                    {activeThreats.map((threat, i) => (
                      <li key={i} className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse"></span>
                        {threat}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-green-400 font-mono">No active threats detected</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="neo-panel p-4 rounded">
            <h3 className="text-xl text-blue-400 mb-2">Global Monitoring</h3>
            <div className="relative h-64 border border-green-500/30 rounded bg-black">
              <div className="w-full h-full interactive-globe">
                <Globe3D />
              </div>
              
              {/* Overlay information */}
              <div className="absolute top-2 left-2 bg-black/70 text-green-400 text-xs p-1 rounded">
                <div className="font-mono">LIVE FEED</div>
              </div>
              
              <div className="absolute bottom-2 right-2 bg-black/70 text-green-400 text-xs p-1 rounded">
                <div className="font-mono text-right">SATELLITES: 3</div>
                <div className="font-mono text-right">COVERAGE: 92%</div>
              </div>
              
              <div className="absolute top-2 right-2 bg-black/70 text-red-400 text-xs px-2 py-1 rounded flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse"></span>
                <span className="font-mono">3 Active Threats</span>
              </div>
              
              <div className="absolute bottom-2 left-2 bg-black/70 text-green-400 text-xs p-1 rounded opacity-70">
                <div className="font-mono">Interactive Globe: Click and drag to explore</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="neo-panel p-4 rounded">
            <h3 className="text-xl text-blue-400 mb-4">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {certificates.map((cert, index) => (
                <div key={index} className="border border-green-500/30 p-2 rounded hover:border-green-500 transition-colors">
                  <img src={cert.src} alt={cert.alt} className="w-full h-24 object-cover mb-2" />
                  <div className="text-green-400 text-xs">{cert.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackerProfile; 