'use client';

import { useState, useEffect, useRef } from 'react';
import { FaLock, FaUnlock, FaKey, FaExchangeAlt, FaRandom, FaBolt, FaShieldAlt, FaCopy, FaFileAlt, FaHistory } from 'react-icons/fa';
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
      const fence: string[][] = Array(rails).fill('').map(() => []);
      let rail = 0;
      let direction = 1;

      for (let i = 0; i < text.length; i++) {
        fence[rail].push(text[i]);
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
      }

      return fence.flat().join('');
    } else {
      // Simplified decryption
      const fence: string[][] = Array(rails).fill('').map(() => []);
      let rail = 0;
      let direction = 1;
      let index = 0;

      for (let i = 0; i < text.length; i++) {
        fence[rail][i] = '*';
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
      }

      for (let i = 0; i < rails; i++) {
        for (let j = 0; j < text.length; j++) {
          if (fence[i][j] === '*') {
            fence[i][j] = text[index++];
          }
        }
      }

      rail = 0;
      direction = 1;
      let result = '';

      for (let i = 0; i < text.length; i++) {
        result += fence[rail][i] || '';
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
      }      return result;
    }
  };

  const calculateStrength = (text: string, method: string): number => {
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

  const processText = () => {
    if (!input) return;

    let output = '';
    switch (method) {
      case 'caesar':
        const shift = parseInt(key) || 3;
        output = caesarCipher(input, shift, mode === 'encrypt');
        break;
      case 'xor':
        output = xorEncrypt(input, key || 'default');
        break;
      case 'base64':
        output = mode === 'encrypt' ? btoa(input) : atob(input);
        break;
      case 'binary':
        output = mode === 'encrypt'
          ? input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
          : input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        break;
      case 'hex':
        output = mode === 'encrypt'
          ? input.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')
          : input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
        break;
      case 'vigenere':
        output = vigenereCipher(input, key || 'KEY', mode === 'encrypt');
        break;
      case 'railfence':
        const rails = parseInt(key) || 3;
        output = railFenceCipher(input, rails, mode === 'encrypt');
        break;
      case 'playfair':
        // Simplified Playfair implementation
        output = `[Playfair ${mode === 'encrypt' ? 'Encryption' : 'Decryption'} requires a 5x5 key matrix]`;
        break;
      case 'aes':
        output = `[AES-256 ${mode === 'encrypt' ? 'Encryption' : 'Decryption'} requires a secure key]`;
        break;
      case 'rsa':
        output = `[RSA ${mode === 'encrypt' ? 'Encryption' : 'Decryption'} requires public/private key pair]`;
        break;
    }

    const newResult: EncryptionResult = {
      method: methods.find(m => m.id === method)?.name || method,
      input,
      output,
      timestamp: new Date().toLocaleTimeString(),
      mode,
      key
    };

    setResults(prev => [newResult, ...prev]);
    setStrength(calculateStrength(output, method));
    setOutput(output);
  };
  return (
    <div className={`hacker-card max-w-4xl mx-auto my-4 sm:my-8 ${className}`}>
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 sm:mb-4 gap-2 xs:gap-0">
        <GlitchText text="Encryption Tool" className="text-xl sm:text-2xl" />
        <div className="flex flex-wrap gap-2 sm:gap-4 w-full xs:w-auto">
          <select 
            className="hacker-button bg-black text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {methods.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <select
            className="hacker-button bg-black text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')}
          >
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Enter key (optional)"
          className="w-full p-1.5 sm:p-2 bg-black border border-green-500 text-green-500 mb-2 text-xs sm:text-sm"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <textarea
          placeholder={`Enter text to ${mode}...`}
          className="w-full p-1.5 sm:p-2 bg-black border border-green-500 text-green-500 h-24 sm:h-32 text-xs sm:text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <span className="text-green-400 text-xs sm:text-sm">Encryption Strength</span>
          <span className="text-yellow-400 text-xs sm:text-sm">{strength}%</span>
        </div>
        <div className="h-1.5 sm:h-2 bg-black border border-green-500/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 animate-pulse"
            style={{ width: `${strength}%` }}
          ></div>
        </div>
      </div>

      <button 
        className="hacker-button w-full mb-3 sm:mb-4 text-xs sm:text-sm py-1.5 sm:py-2"
        onClick={processText}
        disabled={!input || processing}
      >
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <div className="space-y-3 sm:space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border border-green-500/20 p-2 sm:p-4 rounded">
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-2 gap-1 xs:gap-0">
              <span className="text-blue-400 text-xs sm:text-sm">{result.method}</span>
              <span className="text-yellow-400 text-[10px] sm:text-xs">{result.timestamp}</span>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-4">
              <div>
                <h3 className="text-xs text-green-500 mb-1">Input:</h3>
                <pre className="bg-black/50 p-1.5 sm:p-2 rounded overflow-x-auto text-[10px] sm:text-xs">
                  {result.input}
                </pre>
              </div>
              <div>
                <h3 className="text-xs text-green-500 mb-1">Output:</h3>
                <pre className="bg-black/50 p-1.5 sm:p-2 rounded overflow-x-auto text-[10px] sm:text-xs">
                  {result.output}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EncryptionTool;