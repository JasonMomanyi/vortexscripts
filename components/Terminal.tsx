
import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine } from '../types';

interface TerminalProps {
  initialLines?: TerminalLine[];
  onCommand?: (cmd: string) => string | null;
}

// Initial Virtual File System
const INITIAL_FS = {
  '~': {
    'notes.txt': 'Target IP: 10.10.10.55\nScan revealed port 80, 22, 3306 open.\nRemember to check for default creds.',
    'todo.md': '- [x] Recon\n- [ ] Exploit SQLi\n- [ ] Pivoting\n- [ ] Exfiltration',
    'exploit.py': 'import sys\nimport requests\n\nprint("Sending payload...")',
    'user.txt': 'VORTEX{user_flag_placeholder}',
    'scans': 'DIR',
    'tools': 'DIR'
  },
  '~/scans': {
    'nmap_result.txt': 'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.2p1\n80/tcp open  http    Apache httpd 2.4.41',
  },
  '~/tools': {
    'linpeas.sh': '#!/bin/bash\n# Linux Privilege Escalation Awesome Script',
    'mimikatz.exe': 'MzkwMA=='
  },
  '/': {
    'etc': 'DIR',
    'var': 'DIR',
    'usr': 'DIR',
    'home': 'DIR',
    'tmp': 'DIR',
    'bin': 'DIR'
  },
  '/etc': {
    'passwd': 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\nservice:x:1001:1001::/var/service:/bin/false',
    'shadow': 'root:$6$..... (permission denied)',
    'hosts': '127.0.0.1\tlocalhost\n127.0.1.1\tvortex-lab',
    'resolv.conf': 'nameserver 8.8.8.8',
    'hostname': 'vortex-box'
  },
  '/var': {
    'www': 'DIR',
    'log': 'DIR',
    'backups': 'DIR'
  },
  '/var/www': {
    'html': 'DIR'
  },
  '/var/www/html': {
    'index.php': '<?php echo "Welcome to the vulnerable app"; ?>',
    'robots.txt': 'User-agent: *\nDisallow: /admin',
    'config.php': '<?php $db_pass = "s3cr3t"; ?>',
    'admin': 'DIR'
  },
  '/var/www/html/admin': {
    'dashboard.php': '<h1>Admin Dashboard</h1>',
    'users.db': 'SQLITE format...'
  },
  '/var/log': {
    'auth.log': 'May 10 09:01:22 vortex sshd[123]: Failed password for invalid user admin from 192.168.1.50 port 4432\nMay 10 09:01:24 vortex sshd[123]: Failed password for invalid user admin from 192.168.1.50 port 4432',
    'syslog': 'May 10 08:00:01 vortex systemd: Started Session 1 of user root.'
  },
  '/usr': {
    'share': 'DIR',
    'bin': 'DIR'
  },
  '/usr/share': {
    'wordlists': 'DIR'
  },
  '/usr/share/wordlists': {
    'rockyou.txt': '123456\npassword\nqwerty\n...'
  },
  '/tmp': {
    '.ICE-unix': 'DIR',
    'payload.tmp': 'A'.repeat(50)
  }
};

const AVAILABLE_COMMANDS = [
  'help', 'clear', 'whoami', 'date', 'exit', 'history', 'pwd',
  'ls', 'cd', 'cat', 'mkdir', 'rm',
  'ping', 'traceroute', 'ifconfig', 'netstat', 'ps', 'grep', 'curl',
  'scan', 'nmap', 'sqlmap', 'hydra', 'gobuster'
];

// Helper component for syntax highlighting
const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
  // Regex captures: IPs, Prompts, Flags, Paths, Ports, Keywords
  const regex = /(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b|root@[\w-]+|\s-[a-zA-Z0-9]+\b|\s--[\w-]+\b|(?:\/[\w\.-]+)+|\b\d{1,5}\/(?:tcp|udp)\b|\b(?:Error|Failed|Denied|DROP|REJECT|Closed|CRITICAL|WARNING)\b|\b(?:Success|Open|Connected|ACCEPT|ESTABLISHED|INFO)\b)/g;

  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;
        
        if (/^\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b$/.test(part)) return <span key={i} className="text-cyan-400">{part}</span>;
        if (/^root@[\w-]+$/.test(part)) return <span key={i} className="text-green-500 font-bold">{part}</span>;
        if (/^\s-[a-zA-Z0-9]+\b|^\s--[\w-]+\b$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
        if (/^(?:\/[\w\.-]+)+$/.test(part)) return <span key={i} className="text-blue-400 underline decoration-blue-400/30">{part}</span>;
        if (/^\b\d{1,5}\/(?:tcp|udp)\b$/.test(part)) return <span key={i} className="text-purple-400">{part}</span>;
        if (/^\b(?:Error|Failed|Denied|DROP|REJECT|Closed|CRITICAL|WARNING)\b$/i.test(part)) return <span key={i} className="text-red-500 font-bold">{part}</span>;
        if (/^\b(?:Success|Open|Connected|ACCEPT|ESTABLISHED|INFO)\b$/i.test(part)) return <span key={i} className="text-green-400 font-bold">{part}</span>;

        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const Terminal: React.FC<TerminalProps> = ({ initialLines = [], onCommand }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: 'VORTEX OS v2.1.0 [Kernel 5.15.0-kali]' },
    { type: 'system', content: 'Type "help" for available commands.' },
    ...initialLines
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  
  // File System State
  const [fileSystem, setFileSystem] = useState<Record<string, any>>(INITIAL_FS);
  const [cwd, setCwd] = useState('~');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addToHistory = (cmd: string) => {
    if (cmd.trim() === '') return;
    setHistory(prev => [cmd, ...prev]);
    setHistoryPointer(-1);
  };

  const resolvePath = (path: string): string => {
    if (path === '/') return '/';
    if (path === '~') return '~';
    if (path.startsWith('/')) return path; // Absolute
    
    // Relative
    if (path === '..') {
      if (cwd === '/') return '/';
      if (cwd === '~') return '/'; 
      const parts = cwd.split('/');
      parts.pop();
      return parts.join('/') || '/';
    }
    
    // Simple handling for relative directory change
    // Note: Does not handle complex paths like dir1/dir2 relative yet
    return cwd === '/' ? `/${path}` : `${cwd}/${path}`;
  };

  const executeSimulatedCommand = (cmd: string, args: string[]): string | string[] => {
    switch (cmd) {
      case 'help':
        return 'Available commands: ' + AVAILABLE_COMMANDS.join(', ');
      
      case 'clear':
        setLines([]);
        return '';

      case 'whoami':
        return 'root';

      case 'pwd':
        return cwd === '~' ? '/home/user' : cwd;

      case 'date':
        return new Date().toString();

      case 'history':
        return history.slice().reverse().map((h, i) => `${i + 1}  ${h}`).join('\n');

      // --- FILE SYSTEM COMMANDS ---
      case 'ls': {
        const targetDir = args[0] ? resolvePath(args[0]) : cwd;
        const dirContent = fileSystem[targetDir];
        if (!dirContent) return `ls: cannot access '${args[0] || ''}': No such file or directory`;
        
        return Object.entries(dirContent)
          .map(([name, content]) => content === 'DIR' ? `${name}/` : name)
          .join('  ');
      }

      case 'cd': {
        if (!args[0]) {
          setCwd('~');
          return '';
        }
        const targetPath = resolvePath(args[0]);
        if (fileSystem[targetPath]) {
          setCwd(targetPath);
          return '';
        }
        return `cd: ${args[0]}: No such file or directory`;
      }

      case 'cat': {
        if (!args[0]) return 'cat: missing operand';
        const fileName = args[0];
        const dirContent = fileSystem[cwd];
        
        if (dirContent && dirContent[fileName]) {
          if (dirContent[fileName] === 'DIR') return `cat: ${fileName}: Is a directory`;
          return dirContent[fileName];
        }
        return `cat: ${fileName}: No such file or directory`;
      }

      case 'mkdir': {
        if (!args[0]) return 'mkdir: missing operand';
        const newDirName = args[0];
        const newPath = resolvePath(newDirName);
        
        setFileSystem(prev => ({
          ...prev,
          [cwd]: { ...prev[cwd], [newDirName]: 'DIR' }, 
          [newPath]: {} 
        }));
        return '';
      }

      case 'rm': {
        if (!args[0]) return 'rm: missing operand';
        const target = args[0];
        
        if (fileSystem[cwd][target]) {
           const newDir = { ...fileSystem[cwd] };
           delete newDir[target];
           setFileSystem(prev => ({ ...prev, [cwd]: newDir }));
           return '';
        }
        return `rm: cannot remove '${target}': No such file or directory`;
      }
      
      case 'grep': {
        if (args.length < 2) return 'usage: grep [PATTERN] [FILE]';
        const pattern = args[0];
        const filename = args[1];
        
        const dirContent = fileSystem[cwd];
        if (dirContent && dirContent[filename]) {
           if (dirContent[filename] === 'DIR') return `grep: ${filename}: Is a directory`;
           const content = dirContent[filename] as string;
           const matches = content.split('\n').filter(line => line.includes(pattern));
           return matches.join('\n');
        }
        return `grep: ${filename}: No such file or directory`;
      }

      // --- NETWORK / SYSTEM TOOLS ---
      case 'ping':
        if (!args[0]) return 'usage: ping [destination]';
        return [
          `PING ${args[0]} (${args[0]}) 56(84) bytes of data.`,
          `64 bytes from ${args[0]}: icmp_seq=1 ttl=64 time=0.045 ms`,
          `64 bytes from ${args[0]}: icmp_seq=2 ttl=64 time=0.052 ms`,
          `64 bytes from ${args[0]}: icmp_seq=3 ttl=64 time=0.048 ms`,
          `--- ${args[0]} ping statistics ---`,
          `3 packets transmitted, 3 received, 0% packet loss, time 2045ms`
        ].join('\n');

      case 'traceroute':
        if (!args[0]) return 'usage: traceroute [host]';
        return [
          `traceroute to ${args[0]} (${args[0]}), 30 hops max, 60 byte packets`,
          ` 1  gateway (192.168.1.1)  0.342 ms  0.289 ms  0.211 ms`,
          ` 2  10.10.0.1 (10.10.0.1)  1.202 ms  1.188 ms  1.154 ms`,
          ` 3  ${args[0]} (${args[0]})  2.431 ms  2.411 ms  2.398 ms`
        ].join('\n');

      case 'ifconfig':
        return [
          `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500`,
          `        inet 10.10.14.22  netmask 255.255.254.0  broadcast 10.10.15.255`,
          `        ether 00:50:56:b9:78:32  txqueuelen 1000  (Ethernet)`,
          `        RX packets 50212  bytes 41234567 (39.3 MiB)`,
          `        TX packets 32104  bytes 12345678 (11.7 MiB)`,
          ``,
          `lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536`,
          `        inet 127.0.0.1  netmask 255.0.0.0`,
          `        loop  txqueuelen 1000  (Local Loopback)`
        ].join('\n');

      case 'netstat':
        return [
          `Active Internet connections (w/o servers)`,
          `Proto Recv-Q Send-Q Local Address           Foreign Address         State`,
          `tcp        0      0 10.10.14.22:4444        10.10.10.55:58322       ESTABLISHED`,
          `tcp        0      0 10.10.14.22:80          10.10.10.55:34212       TIME_WAIT`,
          `udp        0      0 10.10.14.22:68          10.10.0.1:67            ESTABLISHED`
        ].join('\n');

      case 'ps':
        return [
          `  PID TTY          TIME CMD`,
          ` 1337 pts/0    00:00:00 zsh`,
          ` 2042 pts/0    00:00:01 python3`,
          ` 3102 pts/0    00:00:00 ps`
        ].join('\n');

      case 'curl':
        if (!args[0]) return 'curl: try \'curl --help\' for more information';
        return [
          `<!DOCTYPE html>`,
          `<html lang="en">`,
          `<head><title>Target Site</title></head>`,
          `<body>`,
          `  <h1>Welcome to the internal portal</h1>`,
          `  <!-- TODO: Remove debug credentials -->`,
          `</body>`,
          `</html>`
        ].join('\n');

      default:
        return `Command not found: ${cmd}. Type "help" for a list of commands.`;
    }
  };

  const handleCommand = (fullCmd: string) => {
    const trimmedCmd = fullCmd.trim();
    if (!trimmedCmd) {
      setLines(prev => [...prev, { type: 'input', content: `${cwd} $ ` }]);
      return;
    }

    addToHistory(trimmedCmd);
    
    // Display the command input line
    const promptPath = cwd === '~' ? '~' : cwd.split('/').pop() || '/';
    const displayPrompt = `➜ ${promptPath}`;

    const newLines: TerminalLine[] = [...lines, { type: 'input', content: `${displayPrompt} ${fullCmd}` }];
    const lowerCmd = trimmedCmd.toLowerCase();
    const [baseCmd, ...args] = lowerCmd.split(' ');

    // Check if parent component wants to intercept (Lab specifics)
    let response = onCommand ? onCommand(lowerCmd) : null;

    if (response) {
      const responseLines = response.split('\n');
      responseLines.forEach(line => {
        newLines.push({ type: 'success', content: line });
      });
    } else {
      // Execute simulated internal commands
      const result = executeSimulatedCommand(baseCmd, args);
      
      if (result) {
         const resultLines = Array.isArray(result) ? result : result.split('\n');
         resultLines.forEach(line => {
            newLines.push({ type: 'output', content: line });
         });
      }
    }

    setLines(newLines);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextPointer = Math.min(historyPointer + 1, history.length - 1);
        setHistoryPointer(nextPointer);
        setInput(history[nextPointer]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextPointer = historyPointer - 1;
        setHistoryPointer(nextPointer);
        setInput(history[nextPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentInput = input.trim();
      if (!currentInput) return;
      
      const matches = AVAILABLE_COMMANDS.filter(cmd => cmd.startsWith(currentInput));
      if (matches.length === 1) {
        setInput(matches[0] + ' ');
      } else if (matches.length > 1) {
         setLines(prev => [
           ...prev, 
           { type: 'input', content: `➜ ${cwd === '~' ? '~' : cwd.split('/').pop()} ${input}` },
           { type: 'system', content: matches.join('  ') }
         ]);
      }
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Determine prompt display for input field
  const promptPath = cwd === '~' ? '~' : cwd.split('/').pop() || '/';

  return (
    <div 
      className="bg-black/95 border border-green-500/30 rounded-lg p-4 h-96 overflow-hidden flex flex-col font-fira shadow-[0_0_15px_rgba(34,197,94,0.1)] cursor-text"
      onClick={handleContainerClick}
    >
      <div className="flex-1 overflow-y-auto mb-2 space-y-1 scrollbar-hide">
        {lines.map((line, idx) => (
          <div key={idx} className={`${
            line.type === 'input' ? 'text-white font-bold' :
            line.type === 'error' ? 'text-red-500' :
            line.type === 'success' ? 'text-green-400' :
            line.type === 'system' ? 'text-blue-400' :
            'text-gray-300'
          } whitespace-pre-wrap break-words leading-tight`}>
            {/* Syntax Highlighting Applied */}
            <HighlightedText text={line.content} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center text-green-500 border-t border-gray-800 pt-2">
        <span className="mr-2 font-bold">➜ {promptPath}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none flex-1 text-white font-fira"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Terminal;
