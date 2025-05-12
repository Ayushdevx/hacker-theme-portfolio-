'use client';

import { useState, useEffect, useRef } from 'react';
import { FaNetworkWired, FaWifi, FaServer, FaExclamationTriangle, FaLock, FaUnlock, FaSearch, FaGlobe, FaRobot } from 'react-icons/fa';
import GlitchText from './GlitchText';
import TypewriterEffect from './TypewriterEffect';

interface ScanResult {
  ip: string;
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  timestamp: string;
  isVulnerable?: boolean;
  vulnerabilityDescription?: string;
  hostname?: string;
  os?: string;
  ping?: number;
}

interface NetworkScannerProps {
  className?: string;
}

const NetworkScanner = ({ className = "" }: NetworkScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedIP, setSelectedIP] = useState<string | null>(null);
  const [scanType, setScanType] = useState<'quick' | 'full' | 'stealth'>('quick');
  const [target, setTarget] = useState<string>('192.168.1.0/24');
  const [logs, setLogs] = useState<string[]>([]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [scanDetails, setScanDetails] = useState<{
    startTime: string;
    endTime: string;
    hostsScanned: number;
    portsScanned: number;
    vulnerabilitiesFound: number;
  } | null>(null);
  const animationRef = useRef<number | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const commonPorts = [
    { port: 21, service: 'FTP' },
    { port: 22, service: 'SSH' },
    { port: 23, service: 'Telnet' },
    { port: 25, service: 'SMTP' },
    { port: 53, service: 'DNS' },
    { port: 80, service: 'HTTP' },
    { port: 443, service: 'HTTPS' },
    { port: 3306, service: 'MySQL' },
    { port: 5432, service: 'PostgreSQL' },
    { port: 27017, service: 'MongoDB' },
    { port: 8080, service: 'HTTP-Proxy' },
    { port: 1433, service: 'MSSQL' },
    { port: 3389, service: 'RDP' },
    { port: 5900, service: 'VNC' },
  ];

  // Add network visualization animation
  useEffect(() => {
    const canvas = document.getElementById('network-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Network nodes
    const nodes: Array<{
      x: number,
      y: number,
      radius: number,
      color: string,
      speedX: number,
      speedY: number,
      connections: number[]
    }> = [];
    
    // Generate random nodes
    const generateNodes = () => {
      nodes.length = 0; // Clear existing nodes
      const numNodes = Math.floor(Math.random() * 5) + 8; // 8-12 nodes
      
      // Generate main nodes
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 2,
          color: i === 0 ? '#10B981' : // First node is green (scanner)
                 Math.random() > 0.8 ? '#EF4444' : // Some red nodes (vulnerable)
                 '#3B82F6', // Default blue
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          connections: []
        });
      }
      
      // Create connections - each node connects to 1-3 other nodes
      nodes.forEach((node, i) => {
        const numConnections = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numConnections; j++) {
          // Pick a random node to connect to
          let targetIndex;
          do {
            targetIndex = Math.floor(Math.random() * nodes.length);
          } while (targetIndex === i || node.connections.includes(targetIndex));
          
          // Add bidirectional connection
          node.connections.push(targetIndex);
          nodes[targetIndex].connections.push(i);
        }
      });
    };
    
    // Draw the network
    const drawNetwork = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          const target = nodes[targetIndex];
          
          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = 'rgba(49, 163, 84, 0.2)'; // Light green with transparency
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Occasionally draw "data packet" moving along the connection
          if (Math.random() > 0.98) {
            const packetProgress = Math.random();
            const packetX = node.x + (target.x - node.x) * packetProgress;
            const packetY = node.y + (target.y - node.y) * packetProgress;
            
            ctx.beginPath();
            ctx.arc(packetX, packetY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#10B981';
            ctx.fill();
          }
        });
      });
      
      // Draw nodes
      nodes.forEach(node => {
        // Node glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, node.radius / 2,
          node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Move node for next frame
        node.x += node.speedX;
        node.y += node.speedY;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;
      });
      
      // Request next animation frame
      animationRef.current = requestAnimationFrame(drawNetwork);
    };
    
    // Initialize and start animation
    generateNodes();
    animationRef.current = requestAnimationFrame(drawNetwork);
    
    // Regenerate network every 15 seconds
    const intervalId = setInterval(() => {
      generateNodes();
    }, 15000);
    
    // Cleanup
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      clearInterval(intervalId);
    };
  }, []);

  // Scroll logs to bottom when new logs are added
  useEffect(() => {
    if (logEndRef.current) {
      // Only scroll the log container, not the entire page
      const logContainer = logEndRef.current.closest('.log-container');
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      } else {
        // Fallback with smooth scrolling that won't affect page position
        const currentPageScroll = window.scrollY;
        logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Restore page scroll position
        window.scrollTo(0, currentPageScroll);
      }
    }
  }, [logs]);

  // Random network activity for visual effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Random glitch effect
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to add a log message
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [...prev.slice(-50), `[${timestamp}] ${message}`]); // Keep last 50 logs
  };

  // Generate a realistic hostname for an IP
  const generateHostname = (ip: string): string => {
    const lastOctet = parseInt(ip.split('.')[3], 10);
    
    if (lastOctet === 1) return 'router.local';
    if (lastOctet === 254) return 'firewall.local';
    
    const deviceTypes = ['desktop', 'laptop', 'server', 'iot', 'camera', 'printer'];
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    
    return `${deviceType}-${lastOctet}.local`;
  };

  // Generate an OS based on hostname
  const generateOS = (hostname: string): string => {
    if (hostname.includes('server')) {
      return Math.random() > 0.5 ? 'Ubuntu Server 22.04' : 'CentOS 8';
    } else if (hostname.includes('desktop') || hostname.includes('laptop')) {
      const options = ['Windows 11', 'macOS 13', 'Ubuntu 22.04', 'Kali Linux'];
      return options[Math.floor(Math.random() * options.length)];
    } else if (hostname.includes('iot')) {
      return 'Linux-based IoT';
    } else if (hostname.includes('printer')) {
      return 'Proprietary Embedded OS';
    } else if (hostname.includes('camera')) {
      return 'Custom Firmware v3.1';
    } else if (hostname.includes('router') || hostname.includes('firewall')) {
      return 'Custom Network OS';
    } else {
      return 'Unknown';
    }
  };

  // Generate vulnerability data for open ports
  const generateVulnerabilityData = (service: string, port: number): { isVulnerable: boolean, desc?: string } => {
    // Only some percentage of services are vulnerable
    if (Math.random() > 0.3) return { isVulnerable: false };
    
    const vulnDescriptions: Record<string, string[]> = {
      'SSH': [
        'Weak password policy detected',
        'CVE-2023-5763: OpenSSH authentication bypass',
        'SSH version outdated (7.4)'
      ],
      'FTP': [
        'Anonymous login allowed',
        'Clear-text credentials',
        'FTP bounce attack possible'
      ],
      'HTTP': [
        'Directory listing enabled',
        'Default credentials (admin/admin)',
        'Outdated Apache (2.4.29)',
        'CVE-2023-4248: HTTP header injection'
      ],
      'HTTPS': [
        'SSL/TLS using weak ciphers',
        'Certificate expired',
        'Heartbleed vulnerability detected'
      ],
      'MySQL': [
        'Remote root access enabled',
        'CVE-2023-6789: SQL injection',
        'Default credentials (root/blank)'
      ],
      'Telnet': [
        'Cleartext protocol',
        'No encryption',
        'Default credentials'
      ]
    };
    
    const defaultVulns = [
      'Default credentials detected',
      'Service outdated',
      'Misconfiguration detected'
    ];
    
    const vulns = vulnDescriptions[service] || defaultVulns;
    return {
      isVulnerable: true,
      desc: vulns[Math.floor(Math.random() * vulns.length)]
    };
  };

  // Start network scanning
  const startScan = () => {
    setScanning(true);
    setResults([]);
    setProgress(0);
    setLogs([]);
    setSelectedIP(null);
    
    // Log the start of scan
    addLog(`Starting ${scanType} scan on target ${target}`);
    addLog('Initializing scanner...');
    
    const startTime = new Date().toISOString();
    
    let currentProgress = 0;
    const totalHosts = Math.floor(Math.random() * 10) + 15; // 15-25 hosts
    const scannedIPs = new Set<string>();
    let vulnerabilitiesFound = 0;
    
    // Different scan speed based on scan type
    const scanInterval = scanType === 'quick' ? 250 : 
                          scanType === 'full' ? 400 : 600; // Stealth is slower
    
    // Create a unique list of IPs to scan
    const ipList: string[] = [];
    while (ipList.length < totalHosts) {
      const ip = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
      if (!scannedIPs.has(ip)) {
        ipList.push(ip);
        scannedIPs.add(ip);
      }
    }
    
    let ipIndex = 0;
    let totalPortsScanned = 0;
    
    const interval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(interval);
        setScanning(false);
        
        const endTime = new Date().toISOString();
        setScanDetails({
          startTime,
          endTime,
          hostsScanned: scannedIPs.size,
          portsScanned: totalPortsScanned,
          vulnerabilitiesFound
        });
        
        addLog(`Scan completed. Found ${vulnerabilitiesFound} vulnerabilities across ${scannedIPs.size} hosts.`);
        
        // Trigger glitch effect at scan completion
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
        
        return;
      }

      // Progress increment based on scan type
      const progressIncrement = scanType === 'quick' ? 5 : 
                                scanType === 'full' ? 3 : 2;
      currentProgress += progressIncrement;
      setProgress(Math.min(currentProgress, 100));
      
      // Add contextual logs during scan
      if (currentProgress < 20 && Math.random() > 0.7) {
        addLog('Performing ping sweep...');
      } else if (currentProgress >= 20 && currentProgress < 40 && Math.random() > 0.7) {
        addLog('Identifying active hosts...');
      } else if (currentProgress >= 40 && currentProgress < 60 && Math.random() > 0.7) {
        addLog('Scanning for open ports...');
      } else if (currentProgress >= 60 && currentProgress < 80 && Math.random() > 0.7) {
        addLog('Performing service detection...');
      } else if (currentProgress >= 80 && currentProgress < 95 && Math.random() > 0.7) {
        addLog('Analyzing vulnerability data...');
      }

      // For each scan cycle, choose an IP and scan 1-3 ports
      if (ipIndex < ipList.length) {
        const ip = ipList[ipIndex];
        const hostname = generateHostname(ip);
        const os = generateOS(hostname);
        
        // Log when scanning a new host
        if (Math.random() > 0.7) {
          addLog(`Scanning ${hostname} (${ip})...`);
        }
        
        // Scan 1-3 ports per cycle
        const numPortsToScan = Math.floor(Math.random() * 3) + 1;
        const usedPortIndices = new Set<number>();
        
        for (let i = 0; i < numPortsToScan; i++) {
          let portIndex = Math.floor(Math.random() * commonPorts.length);
          
          // Avoid duplicate ports
          while (usedPortIndices.has(portIndex)) {
            portIndex = Math.floor(Math.random() * commonPorts.length);
          }
          usedPortIndices.add(portIndex);
          
          const port = commonPorts[portIndex];
          const isOpen = Math.random() > 0.7;
          
          // Only process if port is open
          if (isOpen) {
            const { isVulnerable, desc } = generateVulnerabilityData(port.service, port.port);
            
            if (isVulnerable && desc) {
              vulnerabilitiesFound++;
              // Log vulnerability found
              if (Math.random() > 0.5) {
                addLog(`WARNING: ${desc} on ${hostname} (${ip}:${port.port})`);
              }
            }
            
            totalPortsScanned++;
            
            const newResult: ScanResult = {
              ip,
              port: port.port,
              service: port.service,
              status: 'open',
              timestamp: new Date().toLocaleTimeString(),
              isVulnerable,
              vulnerabilityDescription: isVulnerable ? desc : undefined,
              hostname,
              os,
              ping: Math.floor(Math.random() * 100) + 5
            };
            
            setResults(prev => [...prev, newResult]);
          } else {
            // For closed ports, only sometimes add them to results depending on scan type
            if (scanType === 'full' && Math.random() > 0.7) {
              totalPortsScanned++;
              
              const newResult: ScanResult = {
                ip,
                port: port.port,
                service: port.service,
                status: 'closed',
                timestamp: new Date().toLocaleTimeString(),
                hostname,
                os,
                ping: Math.floor(Math.random() * 100) + 5
              };
              
              setResults(prev => [...prev, newResult]);
            }
          }
        }
        
        ipIndex++;
      }
    }, scanInterval);
    
    // Cleanup on component unmount
    return () => clearInterval(interval);
  };

  // Add network visualization animation
  useEffect(() => {
    const canvas = document.getElementById('network-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Network nodes
    const nodes: Array<{
      x: number,
      y: number,
      radius: number,
      color: string,
      speedX: number,
      speedY: number,
      connections: number[]
    }> = [];
    
    // Generate random nodes
    const generateNodes = () => {
      nodes.length = 0; // Clear existing nodes
      const numNodes = Math.floor(Math.random() * 5) + 8; // 8-12 nodes
      
      // Generate main nodes
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 2,
          color: i === 0 ? '#10B981' : // First node is green (scanner)
                 Math.random() > 0.8 ? '#EF4444' : // Some red nodes (vulnerable)
                 '#3B82F6', // Default blue
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          connections: []
        });
      }
      
      // Create connections - each node connects to 1-3 other nodes
      nodes.forEach((node, i) => {
        const numConnections = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numConnections; j++) {
          // Pick a random node to connect to
          let targetIndex;
          do {
            targetIndex = Math.floor(Math.random() * nodes.length);
          } while (targetIndex === i || node.connections.includes(targetIndex));
          
          // Add bidirectional connection
          node.connections.push(targetIndex);
          nodes[targetIndex].connections.push(i);
        }
      });
    };
    
    // Draw the network
    const drawNetwork = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          const target = nodes[targetIndex];
          
          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = 'rgba(49, 163, 84, 0.2)'; // Light green with transparency
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Occasionally draw "data packet" moving along the connection
          if (Math.random() > 0.98) {
            const packetProgress = Math.random();
            const packetX = node.x + (target.x - node.x) * packetProgress;
            const packetY = node.y + (target.y - node.y) * packetProgress;
            
            ctx.beginPath();
            ctx.arc(packetX, packetY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#10B981';
            ctx.fill();
          }
        });
      });
      
      // Draw nodes
      nodes.forEach(node => {
        // Node glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, node.radius / 2,
          node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Move node for next frame
        node.x += node.speedX;
        node.y += node.speedY;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;
      });
      
      // Request next animation frame
      animationRef.current = requestAnimationFrame(drawNetwork);
    };
    
    // Initialize and start animation
    generateNodes();
    animationRef.current = requestAnimationFrame(drawNetwork);
    
    // Regenerate network every 15 seconds
    const intervalId = setInterval(() => {
      generateNodes();
    }, 15000);
    
    // Cleanup
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      clearInterval(intervalId);
    };
  }, []);
  
  // Get icon for a service
  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'http':
      case 'https':
        return <FaGlobe className="text-blue-400" />;
      case 'ssh':
        return <FaLock className="text-green-500" />;
      case 'ftp':
        return <FaServer className="text-yellow-400" />;
      default:
        return <FaServer className="text-gray-400" />;
    }
  };

  // Prevent component from auto-scrolling into view
  useEffect(() => {
    // Get the component's container element
    const componentEl = document.getElementById('network-scanner');
    if (!componentEl) return;
    
    // Override any attempts to scroll this into view
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    
    // Create a no-op function for this element
    componentEl.scrollIntoView = function(options) {
      // Do nothing - prevents scrolling
      return;
    };
    
    // Create a more aggressive scroll prevention
    const preventScroll = () => {
      // Check if we're near the NetworkScanner section
      const rect = componentEl.getBoundingClientRect();
      if (Math.abs(rect.top) < window.innerHeight) {
        // We're near the component, restore user's previous position
        window.scrollTo(0, window.scrollY);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', preventScroll, { passive: true });
    
    // Run once immediately
    preventScroll();
    
    // Set up a MutationObserver to watch for DOM changes that might trigger scrolling
    const observer = new MutationObserver(() => {
      preventScroll();
    });
    
    // Start observing the document
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      characterData: true
    });
    
    return () => {
      // Restore original behavior on cleanup
      if (componentEl) {
        componentEl.scrollIntoView = originalScrollIntoView;
      }
      window.removeEventListener('scroll', preventScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`neo-panel p-4 ${isGlitching ? 'glitch' : ''} ${className} no-auto-scroll`} 
      style={{
        scrollMarginTop: '100vh',
        scrollSnapAlign: 'none',
        overscrollBehavior: 'none',
        touchAction: 'none',
      }}>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center justify-center w-full md:w-auto mb-2 md:mb-0">
          <FaNetworkWired className="text-green-500 mr-2 text-lg" />
          <GlitchText 
            text="NETWORK SCANNER" 
            className="text-lg sm:text-xl font-mono text-green-500 font-bold"
            intensity={3}
          />
        </div>
        
        <div className="flex flex-wrap items-center justify-center w-full md:justify-end gap-2">
          <select 
            value={scanType} 
            onChange={(e) => setScanType(e.target.value as 'quick' | 'full' | 'stealth')}
            className="bg-black text-green-400 border border-green-500/30 rounded px-2 py-1 text-xs sm:text-sm font-mono"
            disabled={scanning}
          >
            <option value="quick">Quick Scan</option>
            <option value="full">Full Scan</option>
            <option value="stealth">Stealth Scan</option>
          </select>
          
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-black text-green-400 border border-green-500/30 rounded px-2 py-1 text-xs sm:text-sm font-mono w-28 sm:w-40"
            placeholder="Target range"
            disabled={scanning}
          />
          
          <button
            onClick={startScan}
            disabled={scanning}
            className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-mono w-full sm:w-auto mt-2 sm:mt-0 ${scanning ? 'bg-gray-700 text-gray-400' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
      </div>
      
      {/* Network Visualization */}
      <div className="mb-4 border border-green-500/30 rounded bg-black p-2">
        <canvas id="network-canvas" width="800" height="150" className="w-full h-auto"></canvas>
      </div>
      
      {/* Scanning Progress */}
      {scanning && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-400">{scanType.toUpperCase()} SCAN IN PROGRESS</span>
            <span className="text-green-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Results and Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Main results table */}
        <div className="col-span-1 md:col-span-2 border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-xs sm:text-sm mb-2 flex flex-wrap items-center">
            <span>SCAN RESULTS</span>
            {results.length > 0 && (
              <span className="ml-auto">
                {results.filter(r => r.status === 'open').length} open ports
                {results.filter(r => r.isVulnerable).length > 0 && (
                  <span className="ml-2 text-red-400">
                    {results.filter(r => r.isVulnerable).length} vulnerabilities
                  </span>
                )}
              </span>
            )}
          </div>
          
          <div className="overflow-x-auto overflow-y-auto max-h-48 sm:max-h-64 custom-scrollbar">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-green-500/30 text-xs">
                  <th className="text-left py-1 px-1 sm:px-2">HOST</th>
                  <th className="text-left py-1 px-1 sm:px-2">PORT</th>
                  <th className="text-left py-1 px-1 sm:px-2">SERVICE</th>
                  <th className="text-left py-1 px-1 sm:px-2">STATUS</th>
                  <th className="text-left py-1 px-1 sm:px-2 hidden md:table-cell">OS</th>
                  <th className="text-left py-1 px-1 sm:px-2 hidden md:table-cell">PING</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-green-500/10 hover:bg-green-500/10 cursor-pointer 
                      ${selectedIP === result.ip ? 'bg-green-500/20' : ''} 
                      ${result.isVulnerable ? 'text-red-400' : ''}`}
                    onClick={() => setSelectedIP(result.ip)}
                  >
                    <td className="py-1 px-1 sm:px-2 font-mono truncate max-w-[80px] sm:max-w-[150px]">
                      {result.hostname || result.ip}
                    </td>
                    <td className="py-1 px-1 sm:px-2 font-mono">{result.port}</td>
                    <td className="py-1 px-1 sm:px-2 font-mono flex items-center">
                      <span className="mr-1">{getServiceIcon(result.service)}</span>
                      <span className="truncate max-w-[60px] sm:max-w-none">{result.service}</span>
                    </td>
                    <td className="py-1 px-1 sm:px-2">
                      <span className={`flex items-center ${
                        result.status === 'open' 
                          ? (result.isVulnerable ? 'text-red-500' : 'text-yellow-500')
                          : 'text-green-500'
                      }`}>
                        {result.status === 'open' 
                          ? <FaUnlock className="mr-1" /> 
                          : <FaLock className="mr-1" />}
                        {result.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-1 px-1 sm:px-2 hidden md:table-cell text-xs">{result.os || 'Unknown'}</td>
                    <td className="py-1 px-1 sm:px-2 hidden md:table-cell text-xs">{result.ping ? `${result.ping}ms` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Selected host details */}
        <div className="col-span-1 border border-green-500/30 bg-black/50 rounded p-2">
          {selectedIP ? (
            <>
              <div className="text-green-400 font-mono text-xs sm:text-sm mb-2">TARGET DETAILS</div>
              
              {(() => {
                const hostResults = results.filter(r => r.ip === selectedIP);
                if (hostResults.length === 0) return null;
                
                const firstResult = hostResults[0];
                const openPorts = hostResults.filter(r => r.status === 'open');
                const vulnerabilities = hostResults.filter(r => r.isVulnerable);
                
                return (
                  <>
                    <div className="mb-3">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-xs text-gray-500">HOSTNAME:</div>
                        <div className="col-span-2 text-xs sm:text-sm text-green-400 break-all">{firstResult.hostname || 'Unknown'}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-xs text-gray-500">IP:</div>
                        <div className="col-span-2 text-xs sm:text-sm text-green-400">{firstResult.ip}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-xs text-gray-500">OS:</div>
                        <div className="col-span-2 text-xs sm:text-sm text-green-400">{firstResult.os || 'Unknown'}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-xs text-gray-500">PING:</div>
                        <div className="col-span-2 text-xs sm:text-sm text-green-400">{firstResult.ping ? `${firstResult.ping}ms` : 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">OPEN PORTS:</div>
                      {openPorts.length > 0 ? (
                        <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                          {openPorts.map((port, i) => (
                            <div key={i} className="font-mono flex items-center">
                              <span className="text-yellow-400 mr-1">{port.port}</span>
                              <span className="text-green-400">{port.service}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No open ports detected</div>
                      )}
                    </div>
                    
                    {vulnerabilities.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-red-500 flex items-center mb-1">
                          <FaExclamationTriangle className="mr-1" />
                          VULNERABILITIES:
                        </div>
                        <div className="text-sm text-red-400">
                          {vulnerabilities.map((vuln, i) => (
                            <div key={i} className="mb-1 font-mono text-xs flex items-start">
                              <span className="mr-1">•</span>
                              <span>{vuln.vulnerabilityDescription}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">SECURITY RECOMMENDATIONS:</div>
                      <div className="text-xs text-blue-400">
                        {vulnerabilities.length > 0 ? (
                          <>
                            <div className="mb-1">• Update services to latest versions</div>
                            <div className="mb-1">• Close unnecessary ports</div>
                            <div className="mb-1">• Implement strong authentication</div>
                          </>
                        ) : openPorts.length > 0 ? (
                          <>
                            <div className="mb-1">• Continue monitoring for changes</div>
                            <div className="mb-1">• Implement firewall rules</div>
                          </>
                        ) : (
                          <div>Host appears secure</div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Select a host to view details
            </div>
          )}
        </div>
      </div>
      
      {/* Scan details */}
      {scanDetails && !scanning && (
        <div className="mb-4 border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-sm mb-2">SCAN SUMMARY</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-2">
              <div className="text-xs text-gray-500">HOSTS SCANNED</div>
              <div className="text-xl text-green-400">{scanDetails.hostsScanned}</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xs text-gray-500">PORTS SCANNED</div>
              <div className="text-xl text-green-400">{scanDetails.portsScanned}</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xs text-gray-500">OPEN PORTS</div>
              <div className="text-xl text-yellow-400">{results.filter(r => r.status === 'open').length}</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xs text-gray-500">VULNERABILITIES</div>
              <div className="text-xl text-red-400">{scanDetails.vulnerabilitiesFound}</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xs text-gray-500">SCAN TYPE</div>
              <div className="text-lg text-blue-400">{scanType.toUpperCase()}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Console/Log Area */}
      <div className="border border-green-500/30 bg-black rounded p-2">
        <div className="flex justify-between items-center mb-1">
          <div className="text-green-400 font-mono text-sm">CONSOLE OUTPUT</div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        <div className="bg-black h-32 overflow-y-auto p-2 font-mono text-xs custom-scrollbar log-container">
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div key={idx} className="text-green-400 mb-1">
                {log.includes('ERROR') || log.includes('VULNERAB') ? (
                  <span className="text-red-400">{log}</span>
                ) : log.includes('WARNING') ? (
                  <span className="text-yellow-400">{log}</span>
                ) : (
                  <span>{log}</span>
                )}
              </div>
            ))
          ) : (
            <TypewriterEffect 
              text="Network Scanner ready. Press 'Start Scan' to begin..."
              speed={30}
              className="text-green-400"
            />
          )}
          <div ref={logEndRef} />
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500 font-mono">
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          <TypewriterEffect 
            text={[
              "Scanner module loaded", 
              "System secure", 
              "Network monitoring active"
            ]}
            speed={30}
            loop={true}
            deleteSpeed={10}
          />
        </div>
        <div>
          <span>Scan type: {scanType.toUpperCase()}</span>
          {scanDetails && (
            <span> | Duration: {Math.floor(Math.random() * 100) + 20}s</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkScanner;