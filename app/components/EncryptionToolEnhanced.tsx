'use client';

import { useState, useEffect, useRef } from 'react';
import { FaLock, FaUnlock, FaKey, FaExchangeAlt, FaRandom, FaBolt, FaShieldAlt, FaCopy, FaFileAlt, FaHistory, FaCheck } from 'react-icons/fa';
import GlitchText from './GlitchText';
import TypewriterEffect from './TypewriterEffect';

interface EncryptionResult {
  method: string;
  input: string;
  output: string;
  timestamp: string;
  mode: 'encrypt' | 'decrypt';
  key?: string;
}

interface EncryptionToolProps {
  className?: string;
}

const EncryptionTool = ({ className = "" }: EncryptionToolProps) => {
  const [input, setInput] = useState('');
  const [method, setMethod] = useState('caesar');
  const [key, setKey] = useState('');
  const [results, setResults] = useState<EncryptionResult[]>([]);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [strength, setStrength] = useState(0);
  const [output, setOutput] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  
  const methods = [
    { 
      id: 'caesar', 
      name: 'Caesar Cipher',
      description: 'Simple substitution cipher, shifts characters by a fixed value',
      keyType: 'number',
      keyExample: '3',
      securityLevel: 'Very Low',
      icon: <FaExchangeAlt />
    },
    { 
      id: 'xor', 
      name: 'XOR Encryption',
      description: 'Bitwise XOR operation using a repeating key',
      keyType: 'text',
      keyExample: 'secretkey',
      securityLevel: 'Low',
      icon: <FaKey />
    },
    { 
      id: 'base64', 
      name: 'Base64',
      description: 'Encodes binary data into ASCII characters',
      keyType: 'none',
      securityLevel: 'None (Encoding)',
      icon: <FaFileAlt />
    },
    { 
      id: 'binary', 
      name: 'Binary',
      description: 'Converts text to binary representation',
      keyType: 'none',
      securityLevel: 'None (Encoding)',
      icon: <FaRandom />
    },
    { 
      id: 'hex', 
      name: 'Hexadecimal',
      description: 'Converts text to hexadecimal representation',
      keyType: 'none',
      securityLevel: 'None (Encoding)',
      icon: <FaRandom />
    },
    { 
      id: 'vigenere', 
      name: 'Vigenère Cipher',
      description: 'Polyalphabetic substitution using a keyword',
      keyType: 'text',
      keyExample: 'KEY',
      securityLevel: 'Low',
      icon: <FaKey />
    },
    { 
      id: 'railfence', 
      name: 'Rail Fence Cipher',
      description: 'Transposition cipher using a zigzag pattern',
      keyType: 'number',
      keyExample: '3',
      securityLevel: 'Low',
      icon: <FaExchangeAlt />
    },
    { 
      id: 'playfair', 
      name: 'Playfair Cipher',
      description: 'Digraph substitution using a 5x5 key table',
      keyType: 'text',
      keyExample: 'KEYWORD',
      securityLevel: 'Medium-Low',
      icon: <FaKey />
    },
    { 
      id: 'aes', 
      name: 'AES-256',
      description: 'Advanced Encryption Standard, industry standard block cipher',
      keyType: 'text',
      keyExample: '32+ character key',
      securityLevel: 'Very High',
      icon: <FaShieldAlt />
    },
    { 
      id: 'rsa', 
      name: 'RSA',
      description: 'Public-key cryptosystem used for secure data transmission',
      keyType: 'keypair',
      keyExample: 'Public/Private key',
      securityLevel: 'Very High',
      icon: <FaLock />
    }
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

  // Calculate encryption strength 
  const calculateStrength = (text: string, method: string): number => {
    if (!text) return 0;
    
    let score = 0;
    
    // Length check
    if (text.length > 8) score += 20;
    if (text.length > 16) score += 20;
    
    // Complexity checks
    if (/[A-Z]/.test(text)) score += 10;
    if (/[a-z]/.test(text)) score += 10;
    if (/[0-9]/.test(text)) score += 10;
    if (/[^A-Za-z0-9]/.test(text)) score += 10;
    
    // Method strength
    const methodScores: { [key: string]: number } = {
      'caesar': 20,
      'xor': 40,
      'base64': 30,
      'binary': 30,
      'hex': 30,
      'vigenere': 50,
      'railfence': 40,
      'playfair': 60,
      'aes': 100,
      'rsa': 100
    };
    
    score += methodScores[method] || 0;
    
    return Math.min(score, 100);
  };

  // Update strength when input, method or key changes
  useEffect(() => {
    const newStrength = calculateStrength(input, method);
    setStrength(newStrength);
  }, [input, method, key]);

  // Implementation of cipher algorithms
  const caesarCipher = (text: string, shift: number, encrypt: boolean): string => {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) { // Uppercase
        return String.fromCharCode(((code - 65 + (encrypt ? shift : -shift) + 26) % 26) + 65);
      }
      if (code >= 97 && code <= 122) { // Lowercase
        return String.fromCharCode(((code - 97 + (encrypt ? shift : -shift) + 26) % 26) + 97);
      }
      return char;
    }).join('');
  };

  const xorEncrypt = (text: string, key: string): string => {
    return text.split('').map((char, i) => {
      const keyChar = key[i % key.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join('');
  };

  const vigenereCipher = (text: string, key: string, encrypt: boolean): string => {
    const keyUpper = key.toUpperCase();
    return text.split('').map((char, i) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) { // Uppercase
        const keyCode = keyUpper[i % keyUpper.length].charCodeAt(0) - 65;
        return String.fromCharCode(((code - 65 + (encrypt ? keyCode : 26 - keyCode)) % 26) + 65);
      }
      if (code >= 97 && code <= 122) { // Lowercase
        const keyCode = keyUpper[i % keyUpper.length].charCodeAt(0) - 65;
        return String.fromCharCode(((code - 97 + (encrypt ? keyCode : 26 - keyCode)) % 26) + 97);
      }
      return char;
    }).join('');
  };

  const railFenceCipher = (text: string, rails: number, encrypt: boolean): string => {
    if (encrypt) {
      // Create the fence structure
      const fence: string[][] = Array(rails).fill('').map(() => []);
      let rail = 0;
      let direction = 1;

      // Place characters in fence
      for (let i = 0; i < text.length; i++) {
        fence[rail].push(text[i]);
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
      }

      // Join all rows to get ciphertext
      return fence.flat().join('');
    } else {
      // Decryption
      // Create the fence structure
      const fence: string[][] = Array(rails).fill('').map(() => Array(text.length).fill(''));
      let rail = 0;
      let direction = 1;

      // Mark positions in fence
      for (let i = 0; i < text.length; i++) {
        fence[rail][i] = '*';
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
      }

      // Fill the fence with characters
      let index = 0;
      for (let i = 0; i < rails; i++) {
        for (let j = 0; j < text.length; j++) {
          if (fence[i][j] === '*' && index < text.length) {
            fence[i][j] = text[index++];
          }
        }
      }

      // Read the fence in zigzag pattern
      rail = 0;
      direction = 1;
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += fence[rail][i] || '';
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
      }

      return result;
    }
  };

  // Process text based on selected method
  const processText = () => {
    if (!input) return;
    
    setProcessing(true);
    addLog(`Starting ${mode === 'encrypt' ? 'encryption' : 'decryption'} using ${methods.find(m => m.id === method)?.name}`);
    
    // Glitch effect during processing
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);

    setTimeout(() => {
      let outputText = '';
      
      try {
        switch (method) {
          case 'caesar':
            const shift = parseInt(key) || 3;
            outputText = caesarCipher(input, shift, mode === 'encrypt');
            addLog(`Caesar shift by ${shift} complete`);
            break;
            
          case 'xor':
            outputText = xorEncrypt(input, key || 'default');
            addLog(`XOR with key "${key || 'default'}" complete`);
            break;
            
          case 'base64':
            if (mode === 'encrypt') {
              outputText = btoa(input);
              addLog("Base64 encoding complete");
            } else {
              try {
                outputText = atob(input);
                addLog("Base64 decoding complete");
              } catch (e) {
                outputText = "ERROR: Invalid Base64 input";
                addLog("ERROR: Invalid Base64 input");
              }
            }
            break;
            
          case 'binary':
            if (mode === 'encrypt') {
              outputText = input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
              addLog("Binary encoding complete");
            } else {
              try {
                outputText = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
                addLog("Binary decoding complete");
              } catch (e) {
                outputText = "ERROR: Invalid binary input";
                addLog("ERROR: Invalid binary input");
              }
            }
            break;
            
          case 'hex':
            if (mode === 'encrypt') {
              outputText = input.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
              addLog("Hexadecimal encoding complete");
            } else {
              try {
                outputText = input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
                addLog("Hexadecimal decoding complete");
              } catch (e) {
                outputText = "ERROR: Invalid hexadecimal input";
                addLog("ERROR: Invalid hexadecimal input");
              }
            }
            break;
            
          case 'vigenere':
            outputText = vigenereCipher(input, key || 'KEY', mode === 'encrypt');
            addLog(`Vigenère cipher with key "${key || 'KEY'}" complete`);
            break;
            
          case 'railfence':
            const rails = parseInt(key) || 3;
            outputText = railFenceCipher(input, rails, mode === 'encrypt');
            addLog(`Rail fence with ${rails} rails complete`);
            break;
            
          case 'playfair':
            // Simplified simulation of Playfair
            outputText = `[Playfair ${mode === 'encrypt' ? 'Encryption' : 'Decryption'} simulation]`;
            addLog("Playfair cipher would require 5x5 key matrix implementation");
            break;
            
          case 'aes':
            // Simplified simulation of AES
            outputText = `[AES-256 ${mode === 'encrypt' ? 'Encryption' : 'Decryption'} simulation]`;
            addLog("AES would require crypto library implementation");
            break;
            
          case 'rsa':
            // Simplified simulation of RSA
            outputText = `[RSA ${mode === 'encrypt' ? 'Encryption' : 'Decryption'} simulation]`;
            addLog("RSA would require crypto library implementation");
            break;
            
          default:
            outputText = input;
        }
        
        setOutput(outputText);
        
        // Add to results history
        const newResult: EncryptionResult = {
          method: methods.find(m => m.id === method)?.name || method,
          input,
          output: outputText,
          timestamp: new Date().toLocaleTimeString(),
          mode,
          key: key || undefined
        };
        
        setResults(prev => [newResult, ...prev.slice(0, 9)]);
        addLog(`${mode === 'encrypt' ? 'Encryption' : 'Decryption'} complete`);
        
      } catch (error) {
        addLog(`ERROR: ${(error as Error).message}`);
        setOutput(`Error: ${(error as Error).message}`);
      }
      
      setProcessing(false);
    }, 800);
  };

  // Copy output to clipboard
  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output)
      .then(() => {
        setCopied(true);
        addLog("Output copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        addLog(`ERROR: Failed to copy: ${err}`);
      });
  };
  
  // Get appropriate hint for current method
  const getKeyHint = (): string => {
    const methodInfo = methods.find(m => m.id === method);
    if (!methodInfo) return '';
    
    return methodInfo.keyExample ? `e.g., ${methodInfo.keyExample}` : '';
  };

  // Get current method security level
  const getSecurityLevel = (): string => {
    return methods.find(m => m.id === method)?.securityLevel || 'Unknown';
  };

  return (
    <div className={`neo-panel p-4 ${isGlitching ? 'glitch' : ''} ${className}`}>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center">
          {mode === 'encrypt' ? (
            <FaLock className="text-green-500 mr-2" />
          ) : (
            <FaUnlock className="text-yellow-500 mr-2" />
          )}
          <GlitchText
            text="ENCRYPTION TOOL"
            className="text-xl font-mono text-green-500 font-bold"
            intensity={3}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            className="bg-black text-green-400 border border-green-500/30 rounded px-2 py-1 text-sm font-mono"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            disabled={processing}
          >
            {methods.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          
          <button
            className={`px-3 py-1 rounded text-sm font-mono flex items-center gap-1
              ${mode === 'encrypt' 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'}`}
            onClick={() => setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')}
            disabled={processing}
          >
            {mode === 'encrypt' ? (
              <>
                <FaLock size={12} />
                Encrypt
              </>
            ) : (
              <>
                <FaUnlock size={12} />
                Decrypt
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Input section */}
        <div className="border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-sm mb-2 flex items-center">
            <span>INPUT</span>
            <div className="ml-auto text-xs text-gray-500">
              {input.length} characters
            </div>
          </div>
          
          <textarea
            className="w-full h-32 p-2 mb-3 bg-black border border-green-500/30 text-green-400 font-mono text-sm resize-none"
            placeholder={mode === 'encrypt' ? "Enter text to encrypt..." : "Enter text to decrypt..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={processing}
          />
          
          {/* Key input if needed */}
          {methods.find(m => m.id === method)?.keyType !== 'none' && (
            <div>
              <div className="text-green-400 font-mono text-xs mb-1 flex items-center">
                <FaKey className="mr-1" />
                <span>KEY {getKeyHint() && `(${getKeyHint()})`}</span>
              </div>
              <input
                type="text"
                className="w-full p-2 bg-black border border-green-500/30 text-green-400 font-mono text-sm"
                placeholder={`Enter ${methods.find(m => m.id === method)?.keyType} key`}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={processing}
              />
            </div>
          )}
        </div>
        
        {/* Output section */}
        <div className="border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-sm mb-2 flex items-center">
            <span>OUTPUT</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 flex items-center gap-1 text-xs"
              >
                {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div
            className="w-full h-32 p-2 mb-3 bg-black border border-green-500/30 text-green-400 font-mono text-sm overflow-auto"
            ref={outputRef}
          >
            {processing ? (
              <TypewriterEffect
                text="Processing..."
                speed={50}
                className="text-yellow-400"
              />
            ) : output ? (
              output
            ) : (
              <span className="text-gray-600">Output will appear here...</span>
            )}
          </div>
          
          {/* Strength meter */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-green-400 font-mono">ENCRYPTION STRENGTH</span>
              <span className={`
                ${strength < 40 ? 'text-red-400' : 
                  strength < 70 ? 'text-yellow-400' : 
                  'text-green-400'}
              `}>{strength}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  strength < 40 ? 'bg-red-500' : 
                  strength < 70 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`} 
                style={{ width: `${strength}%` }}
              ></div>
            </div>
            
            <div className="mt-2 text-xs flex justify-between">
              <div className="text-gray-500">Security Level:</div>
              <div className={`
                ${getSecurityLevel().includes('Very Low') || getSecurityLevel().includes('None') ? 'text-red-400' :
                  getSecurityLevel().includes('Low') ? 'text-yellow-400' :
                  getSecurityLevel().includes('Medium') ? 'text-blue-400' :
                  'text-green-400'}
              `}>
                {getSecurityLevel()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Method info */}
      <div className="border border-green-500/30 bg-black/50 rounded p-2 mb-4">
        <div className="text-green-400 font-mono text-sm mb-2 flex items-center">
          <span>METHOD INFORMATION</span>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="mt-1 text-blue-400">
            {methods.find(m => m.id === method)?.icon}
          </div>
          <div>
            <div className="text-blue-400 font-bold">
              {methods.find(m => m.id === method)?.name}
            </div>
            <div className="text-gray-400 text-sm">
              {methods.find(m => m.id === method)?.description}
            </div>
          </div>
        </div>
      </div>
      
      {/* Process button */}
      <button
        className={`w-full mb-4 px-4 py-2 rounded font-mono flex items-center justify-center gap-2
          ${processing ? 'bg-gray-700 text-gray-400' : 
            mode === 'encrypt' 
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'}`}
        onClick={processText}
        disabled={processing || !input}
      >
        {processing ? (
          <>
            <FaBolt className="animate-pulse" />
            Processing...
          </>
        ) : mode === 'encrypt' ? (
          <>
            <FaLock />
            Encrypt Text
          </>
        ) : (
          <>
            <FaUnlock />
            Decrypt Text
          </>
        )}
      </button>
      
      {/* Split section for logs and history */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Console/Log Area */}
        <div className="border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-xs mb-1 flex items-center">
            <span>CONSOLE OUTPUT</span>
            <div className="ml-auto flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
          
          <div className="bg-black border border-green-500/20 h-32 overflow-y-auto p-2 font-mono text-xs custom-scrollbar">
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} className="mb-1">
                  {log.includes('complete') || log.includes('copied') ? (
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
                text="Encryption system initialized. Ready for operation..."
                speed={30}
                className="text-green-400"
              />
            )}
            <div ref={logEndRef} />
          </div>
        </div>
        
        {/* History */}
        <div className="border border-green-500/30 bg-black/50 rounded p-2">
          <div className="text-green-400 font-mono text-xs mb-1 flex items-center">
            <FaHistory className="mr-1" />
            <span>HISTORY</span>
          </div>
          
          <div className="h-32 overflow-y-auto custom-scrollbar">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="border-b border-green-500/20 py-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>{result.method}</span>
                    <span>{result.timestamp}</span>
                  </div>
                  <div className="text-sm truncate">
                    <span className={`${result.mode === 'encrypt' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {result.input.substring(0, 20)}{result.input.length > 20 ? '...' : ''}
                    </span>
                    <span className="text-gray-500 mx-1">→</span>
                    <span className="text-blue-400">
                      {result.output.substring(0, 20)}{result.output.length > 20 ? '...' : ''}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 flex items-center justify-center h-full text-sm">
                No encryption history yet
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500 font-mono">
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          <TypewriterEffect 
            text={[
              "Encryption module active", 
              "Secure transmission channel open", 
              "Waiting for data input"
            ]}
            speed={30}
            loop={true}
            deleteSpeed={10}
          />
        </div>
        <div>
          <span>Method: {methods.find(m => m.id === method)?.name}</span>
          {key && (
            <span> | Key: {key.substring(0, 8)}{key.length > 8 ? '...' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncryptionTool;
