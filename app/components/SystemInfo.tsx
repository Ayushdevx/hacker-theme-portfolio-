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

  // Scroll logs to bottom when new logs are added
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

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
    <div className={`neo-panel p-4 ${isGlitching ? 'glitch' : ''} ${className}`}>
      <div className="mb-4 flex items-center">
        <FaServer className="text-green-500 mr-2" />
        <GlitchText
          text="SYSTEM INFORMATION"
          className="text-xl font-mono text-green-500 font-bold"
          intensity={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* System specs */}
        <div className="border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-sm mb-2">SYSTEM SPECS</div>
          
          <div className="text-xs space-y-2">
            <div className="flex items-center">
              <FaLinux className="mr-2 text-blue-400" />
              <div>
                <div className="text-gray-400">OS</div>
                <div className="text-green-400">Kali Linux 6.2.0</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaMicrochip className="mr-2 text-blue-400" />
              <div>
                <div className="text-gray-400">CPU</div>
                <div className="text-green-400">AMD Ryzen 9 5950X (16 cores)</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaMemory className="mr-2 text-blue-400" />
              <div>
                <div className="text-gray-400">Memory</div>
                <div className="text-green-400">{Math.round(memory.total / 1024)}GB DDR4 3600MHz</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaHdd className="mr-2 text-blue-400" />
              <div>
                <div className="text-gray-400">Storage</div>
                <div className="text-green-400">2TB NVMe SSD + 8TB RAID Array</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaNetworkWired className="mr-2 text-blue-400" />
              <div>
                <div className="text-gray-400">Network</div>
                <div className="text-green-400">10Gbps Fiber + VPN</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaUserSecret className="mr-2 text-blue-400" />
              <div>
                <div className="text-gray-400">User</div>
                <div className="text-green-400">root@hackersystem</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaShieldAlt className="mr-2 text-blue-400" />
              <div>
                <div className="text-gray-400">Security Status</div>
                <div className={`flex items-center ${
                  securityStatus === 'secure' ? 'text-green-400' : 
                  securityStatus === 'warning' ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {securityStatus === 'secure' ? (
                    <><FaCheckCircle className="mr-1" size={12} /> System Secure</>
                  ) : securityStatus === 'warning' ? (
                    <><FaExclamationTriangle className="mr-1" size={12} /> Security Warning</>
                  ) : (
                    <><FaExclamationTriangle className="mr-1" size={12} /> Security Breach</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* System usage */}
        <div className="border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-sm mb-2">SYSTEM USAGE</div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-green-400">{cpu}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
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
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Memory Usage</span>
                <span className="text-green-400">{memory.percent}% ({Math.round(memory.used / 1024)}GB / {Math.round(memory.total / 1024)}GB)</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
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
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Disk Usage</span>
                <span className="text-green-400">{disk}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
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
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Network Traffic</span>
                <span className="text-green-400">{networkTraffic} KB/s</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${Math.min((networkTraffic / 200) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Uptime</span>
                <span className="text-green-400">{uptime}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-gray-400 text-xs mb-1">Running Services</div>
            <div className="text-green-400 text-xs grid grid-cols-2 gap-1">
              {runningProcesses.map((process, index) => (
                <div key={index} className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                  {process}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* System logs */}
      <div className="border border-green-500/30 bg-black/50 rounded p-2">
        <div className="text-green-400 font-mono text-xs mb-1 flex items-center">
          <span>SYSTEM LOGS</span>
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
                {log.includes('WARNING') ? (
                  <span className="text-yellow-400">{log}</span>
                ) : log.includes('ERROR') ? (
                  <span className="text-red-400">{log}</span>
                ) : (
                  <span className="text-green-400">{log}</span>
                )}
              </div>
            ))
          ) : (
            <TypewriterEffect 
              text="System log monitoring initialized. Waiting for events..."
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
              "System monitoring active", 
              "Security protocols engaged", 
              "Scanning for intrusions"
            ]}
            speed={30}
            loop={true}
            deleteSpeed={10}
          />
        </div>
        <div>
          <span>Host: hacker-portfolio</span>
        </div>
      </div>
    </div>
  );
}

export default SystemInfo;