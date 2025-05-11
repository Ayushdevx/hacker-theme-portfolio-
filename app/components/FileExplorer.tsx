'use client';

import { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaFile, FaFileCode, FaFilePdf, FaFileAlt, FaLock, FaAngleRight, FaSearch, FaCog, FaTrash, FaCopy, FaPaste, FaStar, FaTerminal } from 'react-icons/fa';
import GlitchText from './GlitchText';
import TypewriterEffect from './TypewriterEffect';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  size?: string;
  modified?: string;
  permissions?: string;
  owner?: string;
  locked?: boolean;
  executable?: boolean;
  starred?: boolean;
  children?: FileNode[];
}

interface FileExplorerProps {
  className?: string;
  darkMode?: boolean;
  showPermissions?: boolean;
}

const FileExplorer = ({ className = "", darkMode = true, showPermissions = true }: FileExplorerProps) => {
  const [currentPath, setCurrentPath] = useState('/home/hacker');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showHidden, setShowHidden] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [clipboard, setClipboard] = useState<FileNode | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showFileContent, setShowFileContent] = useState<string | null>(null);

  const fileSystem: FileNode = {
    name: 'home',
    type: 'directory',
    permissions: 'drwxr-xr-x',
    owner: 'root',
    children: [
      {
        name: 'hacker',
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'hacker',
        children: [
          {
            name: 'projects',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'hacker',
            children: [
              { 
                name: 'web-app', 
                type: 'directory', 
                size: '4.2K', 
                modified: '2024-03-15',
                permissions: 'drwxr-xr-x',
                owner: 'hacker',
                starred: true,
                children: [
                  { name: 'index.html', type: 'file', size: '1.5K', modified: '2024-03-15', permissions: '-rw-r--r--', owner: 'hacker' },
                  { name: 'styles.css', type: 'file', size: '0.8K', modified: '2024-03-15', permissions: '-rw-r--r--', owner: 'hacker' },
                  { name: 'script.js', type: 'file', size: '1.9K', modified: '2024-03-15', permissions: '-rw-r--r--', owner: 'hacker' }
                ]
              },
              { 
                name: 'api-server', 
                type: 'directory', 
                size: '2.8K', 
                modified: '2024-03-14',
                permissions: 'drwxr-xr-x',
                owner: 'hacker',
                children: [
                  { name: 'server.js', type: 'file', size: '1.2K', modified: '2024-03-14', permissions: '-rw-r--r--', owner: 'hacker' },
                  { name: 'routes.js', type: 'file', size: '0.9K', modified: '2024-03-14', permissions: '-rw-r--r--', owner: 'hacker' },
                  { name: 'config.json', type: 'file', size: '0.7K', modified: '2024-03-14', permissions: '-rw-r--r--', owner: 'hacker' }
                ]
              },
              { 
                name: 'security-tools', 
                type: 'directory', 
                size: '1.5K', 
                modified: '2024-03-13',
                permissions: 'drwxr-xr-x',
                owner: 'hacker',
                children: [
                  { name: 'scanner.py', type: 'file', size: '0.7K', modified: '2024-03-13', permissions: '-rwxr-xr-x', owner: 'hacker', executable: true },
                  { name: 'exploit.js', type: 'file', size: '0.8K', modified: '2024-03-13', permissions: '-rw-r--r--', owner: 'hacker' }
                ]
              },
            ]
          },        ]
      }
    ]
  };

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  const getCurrentDirectory = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    let current = fileSystem;
    
    for (const part of pathParts) {
      if (current.children) {
        const next = current.children.find(child => child.name === part);
        if (next && next.type === 'directory') current = next;
        else return current;
      } else {
        return current;
      }
    }
    
    return current;
  };
  const handleFileClick = (file: FileNode) => {
    if (file.locked) {
      // Simulate locked file effect
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
        setShowFileContent('ACCESS DENIED: INSUFFICIENT PERMISSIONS');
      }, 300);
      return;
    }
    
    if (file.type === 'directory') {
      setCurrentPath(`${currentPath === '/' ? '' : currentPath}/${file.name}`);
      setSelectedFile(null);
      setShowFileContent(null);
    } else {
      setSelectedFile(file.name);
      
      // Generate file content based on file type
      const fileContent = generateFileContent(file);
      setShowFileContent(fileContent);
    }
  };
  
  const generateFileContent = (file: FileNode): string => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'py':
        return `#!/usr/bin/env python3
# Filename: ${file.name}
# Created by: hacker
# ${file.executable ? 'This file is executable' : ''}

import sys
import socket
import argparse
from datetime import datetime

def scan_ports(target, ports):
    print(f"Scanning {target} for open ports...")
    for port in ports:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        result = s.connect_ex((target, port))
        if result == 0:
            print(f"Port {port}: OPEN")
        s.close()
    print("Scan complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Simple port scanner')
    parser.add_argument('target', help='Target IP address')
    args = parser.parse_args()
    
    scan_ports(args.target, range(1, 1025))
`;
      
      case 'js':
        return `// Filename: ${file.name}
// Author: hacker
// Last modified: ${file.modified}

const hackingTools = {
  bruteForce: function(target, charset, maxLength) {
    console.log(\`Attempting bruteforce on \${target}...\`);
    // Simulation of brute force algorithm
    const attempts = Math.pow(charset.length, maxLength);
    console.log(\`This would require approximately \${attempts} attempts\`);
    return { success: Math.random() > 0.8, attempts };
  },
  
  vulnScanner: function(target) {
    const vulnerabilities = [
      "SQL Injection",
      "XSS",
      "CSRF",
      "Broken Authentication",
      "Sensitive Data Exposure"
    ];
    
    return vulnerabilities.filter(() => Math.random() > 0.6);
  }
};

// Initialize the exploit
document.addEventListener('DOMContentLoaded', () => {
  console.log("Exploit initialized and ready.");
});
`;
      
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hacker Dashboard</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="terminal">
    <header>
      <h1>Hacker Control Panel</h1>
      <div class="status">SECURE CONNECTION</div>
    </header>
    
    <main>
      <div class="panel">
        <h2>Available Exploits</h2>
        <ul>
          <li data-level="high">SQL Injection Vector</li>
          <li data-level="medium">XSS Payload Generator</li>
          <li data-level="low">Cookie Stealer</li>
        </ul>
      </div>
      
      <div class="console">
        <div class="output">Ready for commands...</div>
        <div class="input">
          <span class="prompt">$</span>
          <input type="text" placeholder="Enter command...">
        </div>
      </div>
    </main>
  </div>
  <script src="script.js"></script>
</body>
</html>
`;
      
      case 'css':
        return `:root {
  --hacker-green: #39ff14;
  --bg-color: #111;
  --panel-bg: rgba(0, 0, 0, 0.8);
  --border-color: rgba(57, 255, 20, 0.3);
}

body {
  background-color: var(--bg-color);
  color: var(--hacker-green);
  font-family: 'Courier New', monospace;
  margin: 0;
  padding: 0;
}

.terminal {
  max-width: 1200px;
  margin: 2rem auto;
  border: 1px solid var(--border-color);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.panel {
  background: var(--panel-bg);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.console {
  background: #000;
  padding: 1rem;
  border-radius: 4px;
  font-family: monospace;
}

.prompt {
  color: var(--hacker-green);
  margin-right: 0.5rem;
}

input {
  background: transparent;
  border: none;
  color: var(--hacker-green);
  font-family: monospace;
  width: 80%;
}

[data-level="high"] {
  color: #ff4136;
}

[data-level="medium"] {
  color: #ffdc00;
}

[data-level="low"] {
  color: #2ecc40;
}
`;
      
      case 'json':
        return `{
  "name": "Hacker Project",
  "version": "1.3.37",
  "description": "A collection of cybersecurity tools",
  "author": "Yashika Kainth",
  "license": "UNLICENSED",
  "private": true,
  "scripts": {
    "scan": "node tools/scanner.js",
    "exploit": "python exploits/main.py",
    "backdoor": "python tools/backdoor.py --stealth"
  },
  "dependencies": {
    "crypto": "^1.0.1",
    "socket.io": "^4.5.4",
    "express": "^4.18.2",
    "axios": "^1.3.4"
  },
  "devDependencies": {
    "eslint": "^8.36.0",
    "nodemon": "^2.0.22"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/hacker/secret-project.git"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}`;
      
      case 'md':
        return `# ${file.name.replace('.md', '')}

## Overview
This document contains sensitive information about the hacking operations.

## Security Tools

### Network Scanners
- Port Scanner: Identifies open ports on target systems
- Vulnerability Scanner: Detects known vulnerabilities
- Packet Sniffer: Analyzes network traffic

### Exploitation Frameworks
- Web Exploit Suite
- Password Cracking Tools
- Reverse Shell Generators

## Security Guidelines
1. Always use VPN when conducting operations
2. Maintain separate operational systems
3. Use encrypted communications
4. Leave no trace behind
5. Document findings securely

## Skills Required
- Network fundamentals
- Programming (Python, JavaScript, C++)
- Linux system administration
- Web application security
- Cryptography basics

---

*This document is for authorized personnel only*
`;
      
      case 'txt':
        return `=====================================================
CONFIDENTIAL: ${file.name}
AUTHOR: hacker
LAST UPDATED: ${file.modified}
=====================================================

This text file contains sensitive information.
Access is restricted to security level ALPHA.

-----BEGIN NOTES-----
- Server credentials updated on 2024-03-10
- New security protocols implemented
- Backdoor patched in version 3.14.15
- Authentication bypass discovered in admin panel
- Zero-day vulnerability reported to vendor

TODO:
* Update scanning scripts
* Test new encryption module
* Review recent CVEs for exploitable vulnerabilities
* Strengthen firewall rules

-----END NOTES-----

REMEMBER: Security through obscurity is not security at all.
`;
      
      default:
        return `// File contents of ${file.name}
// Last modified: ${file.modified || new Date().toISOString().split('T')[0]}
// Size: ${file.size || 'Unknown'}
// Owner: ${file.owner || 'hacker'}
// Permissions: ${file.permissions || '-rw-r--r--'}

The contents of this file cannot be displayed in the preview.
Use a specialized tool to view this file type.

----- FILE SIGNATURE -----
d41d8cd98f00b204e9800998ecf8427e
--------------------------------
`;
    }
  };
  const handleBack = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    setCurrentPath('/' + pathParts.join('/'));
    setSelectedFile(null);
    setShowFileContent(null);
  };
  
  // Get icon for file by extension
  const getFileIcon = (file: FileNode) => {
    if (file.type === 'directory') {
      return file.locked ? <FaLock className="text-red-400" /> : <FaFolder className="text-yellow-400" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'js':
      case 'py':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'cpp':
      case 'c':
      case 'java':
      case 'php':
        return <FaFileCode className="text-blue-400" />;
      case 'pdf':
        return <FaFilePdf className="text-red-400" />;
      case 'md':
      case 'txt':
        return <FaFileAlt className="text-gray-400" />;
      default:
        return <FaFile className="text-green-400" />;
    }
  };
  
  // Filter files based on current view settings
  const filteredFiles = () => {
    const currentDir = getCurrentDirectory();
    if (!currentDir?.children) return [];
    
    let files = [...currentDir.children];
    
    // Filter hidden files
    if (!showHidden) {
      files = files.filter(file => !file.name.startsWith('.'));
    }
    
    // Filter by search query
    if (searchQuery) {
      files = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort files
    files.sort((a, b) => {
      // Directories always come first
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      if (sortBy === 'size' && a.size && b.size) {
        const aSize = parseFloat(a.size);
        const bSize = parseFloat(b.size);
        return sortDirection === 'asc' ? aSize - bSize : bSize - aSize;
      }
      
      if (sortBy === 'modified' && a.modified && b.modified) {
        return sortDirection === 'asc'
          ? a.modified.localeCompare(b.modified)
          : b.modified.localeCompare(a.modified);
      }
      
      return 0;
    });
    
    return files;
  };
  
  const toggleSort = (field: 'name' | 'size' | 'modified') => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  const handleCopyFile = (file: FileNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setClipboard(file);
    
    // Visual feedback
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 150);
  };
  
  const handlePaste = () => {
    if (!clipboard) return;
    
    // Visual feedback of paste operation
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 150);
    
    // Reset clipboard after a paste operation
    setClipboard(null);
  };
  
  const toggleView = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };
  
  const renderBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    return (
      <div className="flex items-center text-xs font-mono mb-2 overflow-x-auto pb-1">
        <div 
          className="text-blue-400 hover:text-green-400 cursor-pointer px-1"
          onClick={() => setCurrentPath('/')}
        >
          /
        </div>
        {parts.map((part, index) => (
          <div key={index} className="flex items-center">
            <FaAngleRight className="mx-1 text-gray-500" />
            <div 
              className="text-blue-400 hover:text-green-400 cursor-pointer px-1"
              onClick={() => {
                const newPath = '/' + parts.slice(0, index + 1).join('/');
                setCurrentPath(newPath);
              }}
            >
              {part}
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className={`neo-panel p-4 ${isGlitching ? 'glitch' : ''} ${className} ${darkMode ? 'bg-black bg-opacity-90' : 'bg-gray-100'}`}>      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <div className="flex items-center justify-center w-full md:w-auto">
            <FaTerminal className="text-green-500 mr-2 text-lg" />
            <GlitchText 
              text="FILE EXPLORER" 
              className="text-lg sm:text-xl font-mono text-green-500 font-bold"
              intensity={3}
            />
            <div className="ml-2 text-xs text-gray-500 bg-black px-2 py-0.5 rounded">
              {filteredFiles().length} items
            </div>
          </div>
          {renderBreadcrumbs()}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black text-green-400 border border-green-500/30 rounded px-2 py-1 text-xs sm:text-sm font-mono w-32 sm:w-40 focus:border-green-500 focus:outline-none"
            />
            <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500/50 text-xs" />
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => setShowHidden(!showHidden)}
              className={`text-xs px-1.5 sm:px-2 py-1 rounded border ${showHidden ? 'bg-green-500/20 border-green-500' : 'border-gray-700'}`}
              title={showHidden ? "Hide hidden files" : "Show hidden files"}
            >
              {showHidden ? "Hidden" : "Show"}
            </button>
            
            <button
              onClick={toggleView}
              className="text-xs px-1.5 sm:px-2 py-1 rounded border border-gray-700"
              title={viewMode === 'list' ? "Switch to grid view" : "Switch to list view"}
            >
              {viewMode === 'list' ? "Grid" : "List"}
            </button>
            
            <button
              onClick={() => setCurrentPath('/home/hacker')}
              className="text-xs px-1.5 sm:px-2 py-1 rounded border border-gray-700"
              title="Go to home directory"
            >
              Home
            </button>          </div>
        </div>
      </div>
      
      {/* File Navigation */}
      <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white'} border ${darkMode ? 'border-green-500/30' : 'border-gray-300'} rounded p-2 mb-4 overflow-x-auto`}>
        {viewMode === 'list' ? (
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className={`${darkMode ? 'border-green-500/30' : 'border-gray-300'} border-b text-xs`}>
                <th className="text-left py-1 sm:py-2 px-1 sm:px-2 w-1/2">
                  <div className="flex items-center cursor-pointer" onClick={() => toggleSort('name')}>
                    <span>NAME</span>
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                {showPermissions && (
                  <th className="text-left py-1 sm:py-2 px-1 sm:px-2 hidden md:table-cell">PERMISSIONS</th>
                )}
                <th className="text-left py-1 sm:py-2 px-1 sm:px-2 hidden md:table-cell">
                  <div className="flex items-center cursor-pointer" onClick={() => toggleSort('size')}>
                    <span>SIZE</span>
                    {sortBy === 'size' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-left py-2 px-2 hidden md:table-cell">
                  <div className="flex items-center cursor-pointer" onClick={() => toggleSort('modified')}>
                    <span>MODIFIED</span>
                    {sortBy === 'modified' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-right py-2 px-2 w-16">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles().map((file, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-gray-700/30 hover:bg-green-500/10 cursor-pointer ${
                    file.name === selectedFile ? 'bg-green-500/20' : ''
                  } ${file.locked ? 'text-red-400' : ''}`}
                  onClick={() => handleFileClick(file)}
                >                  <td className="py-1 sm:py-2 px-1 sm:px-2">
                    <div className="flex items-center">
                      <span className="mr-1 sm:mr-2">{getFileIcon(file)}</span>
                      <span className={`truncate max-w-[120px] sm:max-w-full ${file.starred ? 'text-yellow-400' : file.executable ? 'text-green-500' : ''}`}>
                        {file.name}
                      </span>
                      {file.starred && <FaStar className="ml-1 sm:ml-2 text-yellow-400 text-xs" />}
                      {file.executable && <span className="ml-1 sm:ml-2 text-green-500 text-xs">*</span>}
                    </div>
                  </td>
                  {showPermissions && (
                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-mono text-xs hidden md:table-cell">
                      {file.permissions || (file.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--')}
                    </td>
                  )}
                  <td className="py-1 sm:py-2 px-1 sm:px-2 text-xs hidden md:table-cell">{file.size || '-'}</td>
                  <td className="py-1 sm:py-2 px-1 sm:px-2 text-xs hidden md:table-cell">{file.modified || '-'}</td>
                  <td className="py-1 sm:py-2 px-1 sm:px-2 text-right">
                    <div className="flex justify-end space-x-1 sm:space-x-2">
                      <button 
                        onClick={(e) => handleCopyFile(file, e)}
                        className="text-green-500 hover:text-green-400"
                        title="Copy"
                      >
                        <FaCopy size={12} />
                      </button>
                      {file.type !== 'directory' && (
                        <button className="text-red-500 hover:text-red-400" title="Delete">
                          <FaTrash size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 p-1 sm:p-2">
            {filteredFiles().map((file, index) => (
              <div
                key={index}
                className={`p-1 sm:p-2 rounded border border-gray-700/30 hover:border-green-500/50 cursor-pointer flex flex-col items-center justify-center ${
                  file.name === selectedFile ? 'bg-green-500/20 border-green-500/50' : ''
                } ${file.locked ? 'text-red-400' : ''}`}
                onClick={() => handleFileClick(file)}
              >
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{getFileIcon(file)}</div>
                <div className="text-xs text-center truncate w-full">
                  {file.name.length > 12 ? file.name.substring(0, 10) + '...' : file.name}
                </div>
                {file.starred && <FaStar className="mt-1 text-yellow-400 text-xs" />}
              </div>
            ))}
          </div>
        )}
      </div>
        {/* File Content Viewer */}
      {showFileContent && (
        <div className={`${darkMode ? 'bg-black' : 'bg-gray-100'} border ${darkMode ? 'border-green-500/30' : 'border-gray-300'} rounded p-1 sm:p-2 mt-4`}>
          <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1 sm:pb-2">
            <div className="flex items-center">
              <FaFileCode className="text-green-500 mr-1 sm:mr-2 text-sm sm:text-base" />
              <div className="text-green-500 font-mono text-xs sm:text-sm truncate max-w-[150px] sm:max-w-full">{selectedFile}</div>
            </div>
            <button 
              className="text-gray-500 hover:text-green-500 text-xs sm:text-sm"
              onClick={() => {
                setShowFileContent(null);
                setSelectedFile(null);
              }}
            >
              CLOSE
            </button>
          </div>
          <pre className="font-mono text-xs overflow-x-auto p-1 sm:p-2 max-h-48 sm:max-h-64 custom-scrollbar text-wrap break-all sm:break-normal">
            {showFileContent}
          </pre>
        </div>
      )}
        {/* Status Bar */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mt-4 text-[10px] xs:text-xs text-gray-500 font-mono gap-2 xs:gap-0">
        <div>
          {clipboard && (
            <div className="flex items-center">
              <span className="truncate max-w-[120px] sm:max-w-full">Clipboard: {clipboard.name}</span>
              <button
                onClick={handlePaste}
                className="ml-2 text-green-500 hover:text-green-400"
                title="Paste"
              >
                <FaPaste />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center w-full xs:w-auto">
          <FaCog className="text-green-500 mr-1 animate-spin-slow text-xs" />
          <TypewriterEffect 
            text={[
              "System secure", 
              "Scanning for threats...", 
              "No vulnerabilities detected",
              "Connected to encrypted network"
            ]}
            speed={30}
            loop={true}
            deleteSpeed={10}
          />
        </div>
      </div>
    </div>
  );
};

export default FileExplorer; 