'use client';

import { useState, useEffect, useRef } from 'react';
import { FaServer, FaMemory, FaHdd, FaMicrochip, FaNetworkWired, FaLinux, FaUserSecret, FaShieldAlt, FaLock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import GlitchText from './GlitchText';
import TypewriterEffect from './TypewriterEffect';

interface SystemInfoProps {
  className?: string;
}

const SystemInfo = ({ className = "" }: SystemInfoProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [uptime, setUptime] = useState('0:00:00');
  const [memory, setMemory] = useState({ total: 16384, used: 0, percent: 0 });
  const [cpu, setCpu] = useState(0);
  const [disk, setDisk] = useState(0);
  const [networkTraffic, setNetworkTraffic] = useState(0);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'breach'>('secure');
  const [logs, setLogs] = useState<string[]>([]);
  const [runningProcesses, setRunningProcesses] = useState<string[]>([
    'system_monitor.service',
    'network_defense.service',
    'intrusion_detection.service',
    'cryptography.service',
    'ssh.service',
    'apache2.service'
  ]);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  // Add a log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [...prev.slice(-20), `[${timestamp}] ${message}`]);
  };

  // Scroll logs to bottom when new logs are added - fixed to prevent page auto-scrolling
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

  // Prevent component from auto-scrolling into view
  useEffect(() => {
    // Create a unique ID for this component if not already exists
    const componentId = 'system-info-component';
    const componentEl = document.getElementById(componentId) || document.querySelector('.system-info-component');
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
      // Check if we're near the component
      const rect = componentEl.getBoundingClientRect();
      if (Math.abs(rect.top) < window.innerHeight) {
        // We're near the component, maintain current scroll
        window.scrollTo(0, window.scrollY);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', preventScroll, { passive: true });
    
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

  // Update system stats
  useEffect(() => {
    // Initial log
    addLog('System monitoring initialized');
    addLog('Security checks passed');
    
    const interval = setInterval(() => {
      // Random system stats
      const newCpuUsage = Math.floor(Math.random() * 30) + 10; // 10-40%
      const newDiskUsage = Math.floor(Math.random() * 20) + 60; // 60-80%
      const newNetworkTraffic = Math.floor(Math.random() * 100) + 50; // 50-150 KB/s
      
      // Simulate uptime
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      setUptime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      
      // Simulate memory usage
      const total = 16384; // 16GB
      const used = Math.floor(Math.random() * (total * 0.6)) + (total * 0.2);
      const percent = Math.round((used / total) * 100);
      setMemory({ total, used, percent });
      
      setCpu(newCpuUsage);
      setDisk(newDiskUsage);
      setNetworkTraffic(newNetworkTraffic);
      
      // Random security status (mostly secure with occasional warnings)
      if (Math.random() > 0.95) {
        setSecurityStatus('warning');
        addLog('WARNING: Unusual network activity detected');
        
        // Return to secure after a delay
        setTimeout(() => {
          setSecurityStatus('secure');
          addLog('Security status normalized');
        }, 5000);
      }
      
      // Random glitch effect
      if (Math.random() > 0.9) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
      
      // Random system logs
      if (Math.random() > 0.7) {
        const logMessages = [
          'System scan completed',
          'Memory optimization performed',
          'Network packets analyzed',
          'Security rules updated',
          'Disk cleanup completed',
          'Connection request authenticated',
          'Firewall rules verified',
          'System resources balanced',
          'Encryption keys rotated',
          'Configuration backup created'
        ];
        
        addLog(logMessages[Math.floor(Math.random() * logMessages.length)]);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="system-info-component"
      className={`neo-panel p-2 sm:p-4 ${isGlitching ? 'glitch' : ''} ${className} system-info-component no-auto-scroll`}
      style={{
        scrollMarginTop: '100vh',
        scrollSnapAlign: 'none',
        overscrollBehavior: 'none',
        touchAction: 'none',
      }}
    >
      <div className="mb-3 sm:mb-4 flex items-center">
        <FaServer className="text-green-500 mr-2 text-lg" />
        <GlitchText
          text="SYSTEM INFORMATION"
          className="text-lg sm:text-xl font-mono text-green-500 font-bold"
          intensity={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* System specs */}
        <div className="border border-green-500/30 bg-black/50 rounded p-1.5 sm:p-2">
          <div className="text-green-400 font-mono text-xs sm:text-sm mb-2">SYSTEM SPECS</div>
          
          <div className="text-[10px] xs:text-xs space-y-1.5 sm:space-y-2">
            <div className="flex items-center">
              <FaLinux className="mr-1.5 sm:mr-2 text-blue-400 text-xs sm:text-sm" />
              <div>
                <div className="text-gray-400">OS</div>
                <div className="text-green-400 truncate w-full max-w-[180px] sm:max-w-none">Kali Linux 6.2.0</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaMicrochip className="mr-1.5 sm:mr-2 text-blue-400 text-xs sm:text-sm" />
              <div>
                <div className="text-gray-400">CPU</div>
                <div className="text-green-400 truncate w-full max-w-[180px] sm:max-w-none">AMD Ryzen 9 5950X</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaMemory className="mr-1.5 sm:mr-2 text-blue-400 text-xs sm:text-sm" />
              <div>
                <div className="text-gray-400">Memory</div>
                <div className="text-green-400 truncate">{Math.round(memory.total / 1024)}GB DDR4</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaHdd className="mr-1.5 sm:mr-2 text-blue-400 text-xs sm:text-sm" />
              <div>
                <div className="text-gray-400">Storage</div>
                <div className="text-green-400 truncate w-full max-w-[180px] sm:max-w-none">2TB NVMe + 8TB RAID</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaNetworkWired className="mr-1.5 sm:mr-2 text-blue-400 text-xs sm:text-sm" />
              <div>
                <div className="text-gray-400">Network</div>
                <div className="text-green-400 truncate">10Gbps Fiber + VPN</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaUserSecret className="mr-1.5 sm:mr-2 text-blue-400 text-xs sm:text-sm" />
              <div>
                <div className="text-gray-400">User</div>
                <div className="text-green-400 truncate">root@hackersystem</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaShieldAlt className="mr-1.5 sm:mr-2 text-blue-400 text-xs sm:text-sm" />
              <div>
                <div className="text-gray-400">Security Status</div>
                <div className={`flex items-center truncate ${
                  securityStatus === 'secure' ? 'text-green-400' : 
                  securityStatus === 'warning' ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {securityStatus === 'secure' ? (
                    <><FaCheckCircle className="mr-1" size={10} /> System Secure</>
                  ) : securityStatus === 'warning' ? (
                    <><FaExclamationTriangle className="mr-1" size={10} /> Security Warning</>
                  ) : (
                    <><FaExclamationTriangle className="mr-1" size={10} /> Security Breach</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* System usage */}
        <div className="border border-green-500/30 bg-black/50 rounded p-1.5 sm:p-2">
          <div className="text-green-400 font-mono text-xs sm:text-sm mb-2">SYSTEM USAGE</div>
          
          <div className="space-y-2 sm:space-y-3">
            <div>
              <div className="flex justify-between text-[10px] xs:text-xs mb-1">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-green-400">{cpu}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    cpu < 30 ? 'bg-green-500' : 
                    cpu < 70 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} 
                  style={{ width: `${cpu}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] xs:text-xs mb-1">
                <span className="text-gray-400">Memory Usage</span>
                <span className="text-green-400">{memory.percent}% ({Math.round(memory.used / 1024)}GB)</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    memory.percent < 50 ? 'bg-green-500' : 
                    memory.percent < 80 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} 
                  style={{ width: `${memory.percent}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] xs:text-xs mb-1">
                <span className="text-gray-400">Disk Usage</span>
                <span className="text-green-400">{disk}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    disk < 70 ? 'bg-green-500' : 
                    disk < 90 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} 
                  style={{ width: `${disk}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] xs:text-xs mb-1">
                <span className="text-gray-400">Network Traffic</span>
                <span className="text-green-400">{networkTraffic} KB/s</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.min(Math.max(networkTraffic / 2, 10), 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] xs:text-xs mb-1">
                <span className="text-gray-400">Uptime</span>
                <span className="text-green-400">{uptime}</span>
              </div>
            </div>
            
            <div>
              <div className="text-[10px] xs:text-xs mb-1 text-gray-400">Running Services</div>
              <div className="flex flex-wrap text-[10px] xs:text-xs gap-1">
                {runningProcesses.map((process, idx) => (
                  <div key={idx} className="bg-black/30 border border-green-500/30 rounded px-1 py-0.5 flex items-center">
                    <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 mr-0.5 sm:mr-1"></span>
                    <span className="text-green-400 truncate">{process}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* System logs */}
      <div className="border border-green-500/30 bg-black/50 rounded p-1.5 sm:p-2">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <div className="text-green-400 font-mono text-xs sm:text-sm">SYSTEM LOGS</div>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        <div className="h-24 sm:h-32 overflow-y-auto custom-scrollbar log-container">
          {logs.length > 0 ? logs.map((log, index) => (
            <div key={index} className="text-[10px] xs:text-xs font-mono mb-0.5 sm:mb-1 truncate">
              {log.includes('WARNING') ? (
                <span className="text-yellow-400">{log}</span>
              ) : log.includes('ERROR') ? (
                <span className="text-red-400">{log}</span>
              ) : (
                <span className="text-green-400">{log}</span>
              )}
            </div>
          )) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-xs sm:text-sm">
              No system logs yet
            </div>
          )}
          <div ref={logEndRef}></div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;