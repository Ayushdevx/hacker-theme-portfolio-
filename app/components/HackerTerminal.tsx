'use client';

import { useState, useEffect, useRef } from 'react';
import { FaLock, FaUnlock, FaFolder, FaFile, FaCode, FaTerminal } from 'react-icons/fa';

interface Command {
  input: string;
  output: string | React.ReactNode;
  isHtml?: boolean;
  isError?: boolean;
  delay?: number;
}

interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  permission?: 'read' | 'read-write' | 'restricted';
  encrypted?: boolean;
  children?: { [key: string]: FileSystemNode };
}

const HackerTerminal = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [userInput, setUserInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState('/home/hacker');
  const [bootComplete, setBootComplete] = useState(false);
  const [accessLevel, setAccessLevel] = useState('user');
  const [terminalTitle, setTerminalTitle] = useState('Terminal');
  const [isGlitching, setIsGlitching] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize file system (more complete and interesting structure)
  const [fileSystem, setFileSystem] = useState<FileSystemNode>({
    name: 'root',
    type: 'directory',
    permission: 'restricted',
    children: {
      'home': {
        name: 'home',
        type: 'directory',
        permission: 'read-write',
        children: {
          'hacker': {
            name: 'hacker',
            type: 'directory',
            permission: 'read-write',
            children: {
              'projects': {
                name: 'projects',
                type: 'directory',
                permission: 'read-write',
                children: {
                  'portfolio.js': {
                    name: 'portfolio.js',
                    type: 'file',
                    permission: 'read-write',
                    content: `// Portfolio Website\nconst skills = [\n  'TypeScript',\n  'React.js',\n  'Node.js',\n  'TailwindCSS',\n  'Python',\n  'Cybersecurity',\n];\n\nconst showSkills = () => {\n  return skills.map(skill => console.log(skill));\n};\n\nshowSkills();`
                  },
                  'backdoor.py': {
                    name: 'backdoor.py',
                    type: 'file',
                    permission: 'read-write',
                    content: `# Ethical hacking demonstration tool\nimport socket\nimport threading\nimport time\n\ndef simulate_connection():\n    # This is just a simulation of secure connection\n    print("Establishing secure connection...")\n    time.sleep(2)\n    print("Connection secured!")\n\ndef start_server():\n    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    server.bind(('127.0.0.1', 9999))\n    server.listen(5)\n    print(f"[*] Listening on 127.0.0.1:9999")\n\nsimulate_connection()\n# start_server()`
                  }
                }
              },
              'skills': {
                name: 'skills',
                type: 'directory',
                permission: 'read-write',
                children: {
                  'frontend.md': {
                    name: 'frontend.md',
                    type: 'file',
                    permission: 'read-write',
                    content: `# Frontend Skills\n\n- React.js\n- Next.js\n- TypeScript\n- TailwindCSS\n- Framer Motion\n- Three.js`
                  },
                  'backend.md': {
                    name: 'backend.md',
                    type: 'file',
                    permission: 'read-write',
                    content: `# Backend Skills\n\n- Node.js\n- Express\n- MongoDB\n- PostgreSQL\n- GraphQL\n- Firebase`
                  },
                  'security.md': {
                    name: 'security.md',
                    type: 'file',
                    permission: 'read-write',
                    content: `# Security Skills\n\n- Network Security\n- Penetration Testing\n- Cryptography\n- Secure Coding Practices\n- Security Auditing\n- Threat Analysis`
                  }
                }
              },
              'notes.txt': {
                name: 'notes.txt',
                type: 'file',
                permission: 'read-write',
                content: `TODO:\n- Finish portfolio project\n- Study advanced cryptography\n- Prepare for security certification\n- Contact potential clients`
              },
              '.ssh': {
                name: '.ssh',
                type: 'directory',
                permission: 'read-write',
                children: {
                  'id_rsa': {
                    name: 'id_rsa',
                    type: 'file',
                    permission: 'restricted',
                    encrypted: true,
                    content: `-----BEGIN RSA PRIVATE KEY-----\n[ENCRYPTED CONTENT]\n-----END RSA PRIVATE KEY-----`
                  },
                  'id_rsa.pub': {
                    name: 'id_rsa.pub',
                    type: 'file',
                    permission: 'read-write',
                    content: `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...truncated...`
                  }
                }
              }
            }
          }
        }
      },
      'usr': {
        name: 'usr',
        type: 'directory',
        permission: 'read',
        children: {
          'bin': {
            name: 'bin',
            type: 'directory',
            permission: 'read',
            children: {}
          },
          'lib': {
            name: 'lib',
            type: 'directory',
            permission: 'read',
            children: {}
          }
        }
      },
      'etc': {
        name: 'etc',
        type: 'directory',
        permission: 'restricted',
        children: {
          'passwd': {
            name: 'passwd',
            type: 'file',
            permission: 'restricted',
            encrypted: true,
            content: `root:x:0:0:root:/root:/bin/bash\nhacker:x:1000:1000:Hacker User:/home/hacker:/bin/bash`
          },
          'shadow': {
            name: 'shadow',
            type: 'file',
            permission: 'restricted',
            encrypted: true,
            content: `[ENCRYPTED CONTENT]`
          }
        }
      },
      'var': {
        name: 'var',
        type: 'directory',
        permission: 'restricted',
        children: {
          'log': {
            name: 'log',
            type: 'directory',
            permission: 'restricted',
            children: {
              'auth.log': {
                name: 'auth.log',
                type: 'file',
                permission: 'restricted',
                content: `May 10 15:23:42 localhost sshd[12345]: Accepted publickey for hacker from 192.168.1.10 port 55555`
              }
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    // Initialization and boot sequence
    if (!bootComplete) {
      simulateBootSequence();
    }
    
    // Focus input when user clicks on terminal
    const handleTerminalClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleTerminalClick);
    }
    
    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleTerminalClick);
      }
    };
  }, [bootComplete]);
  
  useEffect(() => {
    // Auto-scroll to bottom when commands are added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    
    // Focus input after each command
    if (inputRef.current && bootComplete) {
      inputRef.current.focus();
    }
  }, [commands, bootComplete]);

  // Simulate boot sequence with realistic boot messages
  const simulateBootSequence = async () => {
    setIsBusy(true);
    await simulateDelay(500);
    addCommand('', '[BOOT] Initializing system...', false);
    await simulateDelay(300);
    addCommand('', '[KERNEL] Loading kernel modules', false);
    await simulateDelay(200);
    addCommand('', '[HARDWARE] Detecting hardware...', false);
    await simulateDelay(300);
    addCommand('', '[SECURITY] Initializing security protocols', false);
    await simulateDelay(400);
    addCommand('', '[NETWORK] Establishing secure connection', false);
    await simulateDelay(700);
    addCommand('', '[SYSTEM] Loading file system...', false);
    await simulateDelay(500);
    addCommand('', '[AUTH] User authentication required', false);
    await simulateDelay(800);
    addCommand('', '[AUTH] Biometric verification complete', false);
    await simulateDelay(300);
    addCommand('', '[SYSTEM] Welcome to SecureOS v3.7.2', false);
    await simulateDelay(400);
    
    // Glitch effect
    setIsGlitching(true);
    await simulateDelay(150);
    setIsGlitching(false);
    
    await simulateDelay(200);
    addCommand('', 'Type `help` to see available commands.', false);
    setBootComplete(true);
    setIsBusy(false);
  };

  const simulateDelay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const addCommand = (input: string, output: string | React.ReactNode, isError = false, delay = 0, isHtml = false) => {
    const newCommand: Command = {
      input,
      output,
      isError,
      delay,
      isHtml
    };
    setCommands(prev => [...prev, newCommand]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const clearScreen = () => {
    setCommands([]);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isBusy) {
      e.preventDefault();
      
      const input = userInput.trim();
      setUserInput('');
      
      if (input) {
        // Add to command history
        setCommandHistory(prev => [...prev, input]);
        setHistoryIndex(-1);
        
        // Process command
        processCommand(input);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      autocompleteCommand();
    }
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
      const newIndex = historyIndex < 0 
        ? commandHistory.length - 1 
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setUserInput(commandHistory[newIndex]);
    } else {
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setUserInput(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setUserInput('');
        }
      }
    }
  };

  const autocompleteCommand = () => {
    // Simple tab completion for commands and paths
    const input = userInput.trim();
    
    // Try to complete commands
    if (input.startsWith('cd ')) {
      // Directory completion
      const pathToComplete = input.substring(3);
      const suggestions = autocompletePath(pathToComplete);
      
      if (suggestions.length === 1) {
        setUserInput(`cd ${suggestions[0]}`);
      } else if (suggestions.length > 1) {
        addCommand(input, suggestions.join('  '));
      }
    } else if (input.startsWith('cat ')) {
      // File completion
      const pathToComplete = input.substring(4);
      const suggestions = autocompletePath(pathToComplete);
      
      if (suggestions.length === 1) {
        setUserInput(`cat ${suggestions[0]}`);
      } else if (suggestions.length > 1) {
        addCommand(input, suggestions.join('  '));
      }
    } else {
      // Command completion
      const commands = ['help', 'cd', 'ls', 'cat', 'pwd', 'clear', 'echo', 'sudo', 'whoami', 'date', 'ifconfig', 'nmap', 'ssh', 'chmod', 'mkdir', 'touch', 'rm', 'hack', 'encrypt', 'decrypt', 'scan'];
      const matching = commands.filter(cmd => cmd.startsWith(input));
      
      if (matching.length === 1) {
        setUserInput(matching[0]);
      } else if (matching.length > 1) {
        addCommand(input, matching.join('  '));
      }
    }
  };

  const autocompletePath = (pathFragment: string): string[] => {
    // Get the current directory node
    const currentPathParts = currentDir.split('/').filter(Boolean);
    let currentNode = fileSystem;
    
    // Navigate to the current directory
    for (const part of currentPathParts) {
      if (currentNode.children && currentNode.children[part]) {
        currentNode = currentNode.children[part];
      } else {
        return [];
      }
    }
    
    // If the current node doesn't have children, there's nothing to autocomplete
    if (!currentNode.children) return [];
    
    // Get all potential matches from the current directory
    const matches = Object.keys(currentNode.children).filter(
      name => name.startsWith(pathFragment)
    );
    
    return matches;
  };

  const resolvePath = (path: string): string => {
    // Handle absolute and relative paths
    if (path.startsWith('/')) {
      return path;
    }
    
    // Handle '..' for parent directory
    if (path === '..') {
      const parts = currentDir.split('/').filter(Boolean);
      if (parts.length === 0) return '/';
      parts.pop();
      return '/' + parts.join('/');
    }
    
    // Handle '.' for current directory
    if (path === '.') {
      return currentDir;
    }
    
    // Handle relative path
    if (currentDir === '/') {
      return `/${path}`;
    }
    
    return `${currentDir}/${path}`;
  };

  const getNodeAtPath = (path: string): FileSystemNode | null => {
    const resolvedPath = resolvePath(path);
    const parts = resolvedPath.split('/').filter(Boolean);
    
    let currentNode = fileSystem;
    
    // Handle root directory
    if (parts.length === 0) {
      return fileSystem;
    }
    
    // Navigate to the specified path
    for (const part of parts) {
      if (currentNode.children && currentNode.children[part]) {
        currentNode = currentNode.children[part];
      } else {
        return null;
      }
    }
    
    return currentNode;
  };

  const processCommand = async (input: string) => {
    setIsBusy(true);
    // Add command to display
    addCommand(input, '');
    
    // Split command and arguments
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Process command
    await simulateDelay(100); // Slight delay for realism
    
    try {
      switch (command) {
        case 'help':
          handleHelp();
          break;
        case 'clear':
        case 'cls':
          clearScreen();
          break;
        case 'ls':
          handleLs(args[0]);
          break;
        case 'cd':
          handleCd(args[0]);
          break;
        case 'pwd':
          handlePwd();
          break;
        case 'cat':
          handleCat(args[0]);
          break;
        case 'whoami':
          handleWhoami();
          break;
        case 'date':
          handleDate();
          break;
        case 'echo':
          handleEcho(args.join(' '));
          break;
        case 'mkdir':
          handleMkdir(args[0]);
          break;
        case 'touch':
          handleTouch(args[0]);
          break;
        case 'rm':
          handleRm(args[0], args.includes('-rf'));
          break;
        case 'sudo':
          handleSudo(args.join(' '));
          break;
        case 'ifconfig':
          handleIfconfig();
          break;
        case 'nmap':
          handleNmap(args[0]);
          break;
        case 'ssh':
          handleSsh(args[0]);
          break;
        case 'chmod':
          handleChmod(args[0], args[1]);
          break;
        case 'hack':
          handleHack(args[0]);
          break;
        case 'encrypt':
          handleEncrypt(args[0]);
          break;
        case 'decrypt':
          handleDecrypt(args[0]);
          break;
        case 'scan':
          handleScan(args[0]);
          break;
        case 'matrix':
          handleMatrix();
          break;
        default:
          addCommand('', `Command not found: ${command}. Type 'help' for available commands.`, true);
          break;
      }
    } catch (error) {
      console.error('Command error:', error);
      addCommand('', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
    }
    
    setIsBusy(false);
  };

  // Command handlers
  const handleHelp = () => {
    const helpText = (
      <div className="space-y-2">
        <p className="text-green-400 font-bold">Available commands:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div><span className="text-yellow-400">help</span> - Show this help message</div>
          <div><span className="text-yellow-400">cd [dir]</span> - Change directory</div>
          <div><span className="text-yellow-400">ls [dir]</span> - List directory contents</div>
          <div><span className="text-yellow-400">pwd</span> - Print working directory</div>
          <div><span className="text-yellow-400">cat [file]</span> - Display file contents</div>
          <div><span className="text-yellow-400">clear</span> - Clear the terminal</div>
          <div><span className="text-yellow-400">echo [text]</span> - Print text</div>
          <div><span className="text-yellow-400">whoami</span> - Print current user</div>
          <div><span className="text-yellow-400">date</span> - Display current date/time</div>
          <div><span className="text-yellow-400">mkdir [dir]</span> - Create a directory</div>
          <div><span className="text-yellow-400">touch [file]</span> - Create a file</div>
          <div><span className="text-yellow-400">rm [file]</span> - Remove a file or directory</div>
          <div><span className="text-yellow-400">sudo [command]</span> - Run command as admin</div>
          <div><span className="text-yellow-400">ifconfig</span> - Network interface info</div>
          <div><span className="text-yellow-400">nmap [host]</span> - Network scan</div>
          <div><span className="text-yellow-400">ssh [host]</span> - Secure shell connection</div>
          <div><span className="text-yellow-400">chmod [perm] [file]</span> - Change permissions</div>
          <div><span className="text-yellow-400">encrypt [file]</span> - Encrypt a file</div>
          <div><span className="text-yellow-400">decrypt [file]</span> - Decrypt a file</div>
          <div><span className="text-yellow-400">scan [target]</span> - Run security scan</div>
          <div><span className="text-yellow-400">hack [target]</span> - Run hacking simulation</div>
          <div><span className="text-yellow-400">matrix</span> - Activate Matrix mode</div>
        </div>
        <p className="text-green-400 mt-2">Use <span className="text-yellow-400">Tab</span> for autocompletion and <span className="text-yellow-400">↑/↓</span> for command history</p>
      </div>
    );
    
    addCommand('', helpText, false, 100, true);
  };

  const handleCd = (path: string) => {
    if (!path) {
      setCurrentDir('/home/hacker');
      return;
    }
    
    const targetPath = resolvePath(path);
    const targetNode = getNodeAtPath(targetPath);
    
    if (!targetNode) {
      addCommand('', `cd: ${path}: No such directory`, true);
      return;
    }
    
    if (targetNode.type !== 'directory') {
      addCommand('', `cd: ${path}: Not a directory`, true);
      return;
    }
    
    if (targetNode.permission === 'restricted' && accessLevel !== 'root') {
      addCommand('', `cd: ${path}: Permission denied`, true);
      return;
    }
    
    setCurrentDir(targetPath);
  };

  const handleLs = (path?: string) => {
    const targetPath = path ? resolvePath(path) : currentDir;
    const node = getNodeAtPath(targetPath);
    
    if (!node) {
      addCommand('', `ls: ${path}: No such directory`, true);
      return;
    }
    
    if (node.type !== 'directory') {
      addCommand('', `ls: ${path}: Not a directory`, true);
      return;
    }
    
    if (node.permission === 'restricted' && accessLevel !== 'root') {
      addCommand('', `ls: ${path}: Permission denied`, true);
      return;
    }
    
    if (!node.children || Object.keys(node.children).length === 0) {
      // Empty directory
      return;
    }
    
    const output = (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
        {Object.entries(node.children).map(([name, childNode]) => (
          <div key={name} className="flex items-center">
            {childNode.type === 'directory' ? (
              <FaFolder className="text-blue-400 mr-2" />
            ) : (
              <FaFile className="text-gray-400 mr-2" />
            )}
            <span 
              className={`
                ${childNode.type === 'directory' ? 'text-blue-400' : ''} 
                ${childNode.encrypted ? 'text-red-400' : ''}
                ${childNode.permission === 'restricted' ? 'text-yellow-500' : ''}
              `}
            >
              {name} {childNode.encrypted && <FaLock className="inline text-xs text-red-400" />}
            </span>
          </div>
        ))}
      </div>
    );
    
    addCommand('', output, false, 0, true);
  };

  const handlePwd = () => {
    addCommand('', currentDir);
  };

  const handleCat = async (path: string) => {
    if (!path) {
      addCommand('', 'cat: missing file operand', true);
      return;
    }
    
    const targetPath = resolvePath(path);
    const node = getNodeAtPath(targetPath);
    
    if (!node) {
      addCommand('', `cat: ${path}: No such file`, true);
      return;
    }
    
    if (node.type !== 'file') {
      addCommand('', `cat: ${path}: Is a directory`, true);
      return;
    }
    
    if ((node.permission === 'restricted' && accessLevel !== 'root') || node.encrypted) {
      if (node.encrypted) {
        const hexContent = Array(30).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        const output = (
          <div>
            <p className="text-red-400 mb-2">[ENCRYPTED CONTENT]</p>
            <div className="font-mono text-xs text-red-400 opacity-80">
              {Array(10).fill(0).map((_, i) => (
                <div key={i}>{Array(8).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(' ')}</div>
              ))}
            </div>
            <p className="text-red-400 mt-2">Use 'decrypt {path}' to view this file.</p>
          </div>
        );
        addCommand('', output, false, 0, true);
      } else {
        addCommand('', `cat: ${path}: Permission denied`, true);
      }
      return;
    }
    
    if (!node.content) {
      // Empty file
      return;
    }
    
    // Add slight delay for large files to simulate reading
    const delay = node.content.length > 500 ? 300 : 100;
    await simulateDelay(delay);
    
    // Check if content is code by file extension
    const extension = path.split('.').pop()?.toLowerCase();
    const isCode = ['js', 'py', 'ts', 'jsx', 'tsx', 'java', 'c', 'cpp', 'cs', 'go', 'rb', 'php'].includes(extension || '');
    
    if (isCode) {
      // Format as code
      const output = (
        <div className="font-mono text-xs overflow-auto max-h-60">
          <pre className="language-javascript whitespace-pre-wrap">
            <code>{node.content}</code>
          </pre>
        </div>
      );
      addCommand('', output, false, 0, true);
    } else if (extension === 'md') {
      // Format as markdown
      const lines = node.content.split('\n');
      const output = (
        <div className="font-mono text-xs overflow-auto max-h-60">
          {lines.map((line, i) => {
            if (line.startsWith('# ')) {
              return <h3 key={i} className="text-blue-400 font-bold">{line.substring(2)}</h3>;
            } else if (line.startsWith('## ')) {
              return <h4 key={i} className="text-blue-300 font-bold">{line.substring(3)}</h4>;
            } else if (line.startsWith('- ')) {
              return <div key={i} className="ml-2">• {line.substring(2)}</div>;
            } else {
              return <div key={i}>{line}</div>;
            }
          })}
        </div>
      );
      addCommand('', output, false, 0, true);
    } else {
      // Regular text file
      addCommand('', node.content);
    }
  };

  const handleWhoami = () => {
    const output = accessLevel === 'root' ? 'root' : 'hacker';
    addCommand('', output);
  };

  const handleDate = () => {
    const now = new Date();
    addCommand('', now.toString());
  };

  const handleEcho = (text: string) => {
    addCommand('', text || '');
  };

  const handleMkdir = (path: string) => {
    if (!path) {
      addCommand('', 'mkdir: missing operand', true);
      return;
    }
    
    addCommand('', `mkdir: created directory '${path}'`);
  };

  const handleTouch = (path: string) => {
    if (!path) {
      addCommand('', 'touch: missing file operand', true);
      return;
    }
    
    addCommand('', '');
  };

  const handleRm = (path: string, recursive: boolean) => {
    if (!path) {
      addCommand('', 'rm: missing operand', true);
      return;
    }
    
    const targetPath = resolvePath(path);
    const node = getNodeAtPath(targetPath);
    
    if (!node) {
      addCommand('', `rm: cannot remove '${path}': No such file or directory`, true);
      return;
    }
    
    if (node.type === 'directory' && !recursive) {
      addCommand('', `rm: cannot remove '${path}': Is a directory, use -rf flag`, true);
      return;
    }
    
    if (node.permission === 'restricted' && accessLevel !== 'root') {
      addCommand('', `rm: cannot remove '${path}': Permission denied`, true);
      return;
    }
    
    addCommand('', '');
  };

  const handleSudo = async (command: string) => {
    addCommand('', '[sudo] password for hacker: ', false);
    
    // Password simulation (just dots)
    await simulateDelay(300);
    addCommand('', '•');
    await simulateDelay(100);
    addCommand('', '••');
    await simulateDelay(100);
    addCommand('', '•••');
    await simulateDelay(100);
    addCommand('', '••••');
    await simulateDelay(100);
    addCommand('', '•••••');
    await simulateDelay(300);
    
    if (command === 'su' || command.includes('passwd') || command.includes('rm -rf /')) {
      // Sensitive commands
      addCommand('', 'Sorry, user hacker is not allowed to execute these commands.', true);
      return;
    }
    
    const oldAccessLevel = accessLevel;
    setAccessLevel('root');
    
    // Execute the command with elevated privileges
    if (command) {
      await processCommand(command);
    } else {
      addCommand('', 'root@localhost:~# ');
    }
    
    // Reset to user level
    await simulateDelay(500);
    setAccessLevel(oldAccessLevel);
  };

  const handleIfconfig = () => {
    const output = (
      <div className="font-mono text-xs">
        <p className="text-blue-400">eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500</p>
        <p className="ml-4">inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255</p>
        <p className="ml-4">inet6 fe80::216:3eff:fe1c:8080  prefixlen 64  scopeid 0x20&lt;link&gt;</p>
        <p className="ml-4">ether 00:16:3e:1c:80:80  txqueuelen 1000  (Ethernet)</p>
        <p className="ml-4">RX packets 5416  bytes 1325521 (1.2 MiB)</p>
        <p className="ml-4">RX errors 0  dropped 0  overruns 0  frame 0</p>
        <p className="ml-4">TX packets 2365  bytes 302249 (295.1 KiB)</p>
        <p className="ml-4">TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0</p>
        
        <p className="text-blue-400 mt-2">lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536</p>
        <p className="ml-4">inet 127.0.0.1  netmask 255.0.0.0</p>
        <p className="ml-4">inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;</p>
        <p className="ml-4">loop  txqueuelen 1000  (Local Loopback)</p>
        <p className="ml-4">RX packets 328  bytes 27104 (26.4 KiB)</p>
        <p className="ml-4">RX errors 0  dropped 0  overruns 0  frame 0</p>
        <p className="ml-4">TX packets 328  bytes 27104 (26.4 KiB)</p>
        <p className="ml-4">TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0</p>
      </div>
    );
    
    addCommand('', output, false, 0, true);
  };

  const handleNmap = async (target: string) => {
    if (!target) {
      addCommand('', 'nmap: Specify a target', true);
      return;
    }
    
    addCommand('', `Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toLocaleString()}`);
    addCommand('', `Scanning ${target} [1000 ports]`);
    
    // Simulated scanning animation
    await simulateDelay(300);
    for (let i = 0; i < 5; i++) {
      addCommand('', `.${'.'.repeat(i)}`);
      await simulateDelay(200);
    }
    
    const output = (
      <div className="font-mono text-xs">
        <p className="text-green-400">Nmap scan report for {target}</p>
        <p>Host is up (0.015s latency).</p>
        <p>Not shown: 990 closed ports</p>
        <p className="mt-2">PORT     STATE SERVICE</p>
        <p>22/tcp   open  ssh</p>
        <p>80/tcp   open  http</p>
        <p>443/tcp  open  https</p>
        <p>3306/tcp open  mysql</p>
        <p>8080/tcp open  http-proxy</p>
        <p className="mt-2 text-yellow-400">Nmap done: 1 IP address (1 host up) scanned in 3.25 seconds</p>
      </div>
    );
    
    addCommand('', output, false, 0, true);
  };

  const handleSsh = async (target: string) => {
    if (!target) {
      addCommand('', 'ssh: Specify a hostname', true);
      return;
    }
    
    addCommand('', `Connecting to ${target}...`);
    await simulateDelay(1000);
    
    // Random connection response
    const responses = [
      `ssh: connect to host ${target} port 22: Connection refused`,
      `ssh: connect to host ${target} port 22: Connection timed out`,
      `The authenticity of host '${target}' can't be established.\nConnection closed.`,
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    if (randomResponse.includes('Connection refused') || randomResponse.includes('timed out')) {
      addCommand('', randomResponse, true);
    } else {
      addCommand('', randomResponse);
    }
  };

  const handleChmod = (permissions: string, path: string) => {
    if (!permissions || !path) {
      addCommand('', 'chmod: missing operand', true);
      return;
    }
    
    addCommand('', '');
  };

  const handleHack = async (target: string) => {
    if (!target) {
      addCommand('', 'hack: Specify a target', true);
      return;
    }
    
    addCommand('', `Initializing hack sequence on ${target}...`);
    
    // Fancy animation
    await simulateDelay(500);
    addCommand('', 'Running reconnaissance...');
    await simulateDelay(700);
    addCommand('', 'Scanning for vulnerabilities...');
    await simulateDelay(800);
    
    // Glitch effect
    setIsGlitching(true);
    await simulateDelay(200);
    setIsGlitching(false);
    
    await simulateDelay(500);
    addCommand('', 'Attempting exploit...');
    
    // Progress bar
    for (let i = 0; i <= 100; i += 10) {
      const progressBar = '[' + '='.repeat(i / 5) + ' '.repeat(20 - i / 5) + ']';
      addCommand('', `Progress: ${progressBar} ${i}%`);
      await simulateDelay(200);
    }
    
    await simulateDelay(300);
    
    // Random result - success or failure
    if (Math.random() > 0.5) {
      const output = (
        <div>
          <p className="text-green-500 font-bold">HACK SUCCESSFUL!</p>
          <p className="mt-2">Access granted to {target}</p>
          <p className="mt-1 text-yellow-400">This is a simulated ethical hacking demonstration.</p>
          <p className="text-yellow-400">No actual systems were compromised.</p>
        </div>
      );
      addCommand('', output, false, 0, true);
    } else {
      const output = (
        <div>
          <p className="text-red-500 font-bold">HACK FAILED!</p>
          <p className="mt-2">Access denied to {target}</p>
          <p>System deployed countermeasures. Connection terminated.</p>
          <p className="mt-1 text-yellow-400">This is a simulated ethical hacking demonstration.</p>
          <p className="text-yellow-400">No actual systems were compromised.</p>
        </div>
      );
      addCommand('', output, false, 0, true);
    }
  };

  const handleEncrypt = async (path: string) => {
    if (!path) {
      addCommand('', 'encrypt: Specify a file', true);
      return;
    }
    
    const targetPath = resolvePath(path);
    const node = getNodeAtPath(targetPath);
    
    if (!node) {
      addCommand('', `encrypt: ${path}: No such file`, true);
      return;
    }
    
    if (node.type !== 'file') {
      addCommand('', `encrypt: ${path}: Not a file`, true);
      return;
    }
    
    addCommand('', `Encrypting ${path}...`);
    
    // Progress animation
    for (let i = 0; i < 5; i++) {
      addCommand('', `${'#'.repeat(i)} ${Math.round(i * 25)}%`);
      await simulateDelay(300);
    }
    
    addCommand('', `File encrypted successfully: ${path}`);
  };

  const handleDecrypt = async (path: string) => {
    if (!path) {
      addCommand('', 'decrypt: Specify a file', true);
      return;
    }
    
    const targetPath = resolvePath(path);
    const node = getNodeAtPath(targetPath);
    
    if (!node) {
      addCommand('', `decrypt: ${path}: No such file`, true);
      return;
    }
    
    if (node.type !== 'file') {
      addCommand('', `decrypt: ${path}: Not a file`, true);
      return;
    }
    
    if (!node.encrypted) {
      addCommand('', `decrypt: ${path}: File is not encrypted`, true);
      return;
    }
    
    addCommand('', `Decrypting ${path}...`);
    addCommand('', 'Enter decryption key: ');
    
    // Password simulation
    await simulateDelay(1000);
    addCommand('', 'Verifying key...');
    await simulateDelay(800);
    
    // Random success or failure
    if (Math.random() > 0.3) {
      addCommand('', 'Decryption successful.');
      
      if (node.content) {
        addCommand('', node.content);
      }
    } else {
      addCommand('', 'Incorrect decryption key. Access denied.', true);
    }
  };

  const handleScan = async (target: string) => {
    if (!target) {
      addCommand('', 'scan: Specify a target', true);
      return;
    }
    
    addCommand('', `Running security scan on ${target}...`);
    
    // Simulated scanning animation
    await simulateDelay(500);
    addCommand('', 'Initializing scan modules...');
    await simulateDelay(700);
    addCommand('', 'Running vulnerability assessment...');
    
    // Progress bar
    for (let i = 0; i <= 100; i += 20) {
      const progressBar = '[' + '█'.repeat(i / 10) + ' '.repeat(10 - i / 10) + ']';
      addCommand('', `Progress: ${progressBar} ${i}%`);
      await simulateDelay(400);
    }
    
    // Random number of vulnerabilities
    const vulnCount = Math.floor(Math.random() * 5);
    
    const vulnTypes = [
      'Cross-Site Scripting (XSS)',
      'SQL Injection',
      'Broken Authentication',
      'Sensitive Data Exposure',
      'Security Misconfiguration',
      'Outdated Components',
      'Insecure Deserialization',
      'Missing Access Controls'
    ];
    
    const output = (
      <div>
        <p className="text-green-400 font-bold">Scan completed!</p>
        <p className="mt-2">Target: {target}</p>
        <p>Scan time: 00:01:24</p>
        <p className="text-yellow-400 mt-2 font-bold">Findings: {vulnCount} vulnerabilities detected</p>
        
        {vulnCount > 0 ? (
          <div className="mt-2 space-y-2">
            {Array(vulnCount).fill(0).map((_, i) => {
              const randomVuln = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
              const severity = ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)];
              const severityColor = {
                'Low': 'text-blue-400',
                'Medium': 'text-yellow-400',
                'High': 'text-orange-500',
                'Critical': 'text-red-500'
              }[severity];
              
              return (
                <div key={i} className="border-l-2 border-gray-600 pl-2">
                  <p><span className="text-blue-300">Vulnerability {i+1}:</span> {randomVuln}</p>
                  <p>Severity: <span className={severityColor}>{severity}</span></p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-green-400 mt-2">No vulnerabilities found!</p>
        )}
        
        <p className="text-xs text-gray-400 mt-4">This is a simulated security scan for demonstration purposes.</p>
      </div>
    );
    
    addCommand('', output, false, 0, true);
  };

  const handleMatrix = async () => {
    addCommand('', 'Entering the Matrix...');
    
    setIsGlitching(true);
    await simulateDelay(300);
    setIsGlitching(false);
    
    const output = (
      <div className="text-xs font-mono mt-2">
        {Array(10).fill(0).map((_, i) => (
          <div key={i} className="text-green-500">
            {Array(40).fill(0).map(() => Math.floor(Math.random() * 10)).join(' ')}
          </div>
        ))}
        <p className="text-green-400 mt-2">Wake up, Neo. The Matrix has you...</p>
      </div>
    );
    
    addCommand('', output, false, 0, true);
  };

  return (
    <div className="neo-panel rounded-md overflow-hidden h-96 bg-black text-green-500">
      {/* Terminal header */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-green-700">
        <div className="flex items-center">
          <FaTerminal className="mr-2" />
          <span className="font-mono text-sm">{terminalTitle}</span>
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className={`font-mono text-sm h-full overflow-y-auto p-4 ${isGlitching ? 'glitch' : ''}`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {commands.map((cmd, i) => (
          <div key={i} className="mb-1">
            {cmd.input && (
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">{accessLevel === 'root' ? '# ' : '$ '}</span>
                <span>{cmd.input}</span>
              </div>
            )}
            {cmd.output && (
              <div className={`ml-4 ${cmd.isError ? 'text-red-400' : ''}`}>
                {cmd.isHtml ? cmd.output : <span className="whitespace-pre-wrap">{cmd.output}</span>}
              </div>
            )}
          </div>
        ))}
        
        {bootComplete && !isBusy && (
          <div className="flex items-center mt-1">
            <span className="text-blue-400 mr-2">{accessLevel === 'root' ? '# ' : '$ '}</span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-green-400"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HackerTerminal;
