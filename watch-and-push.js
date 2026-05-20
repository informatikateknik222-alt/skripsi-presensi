/**
 * Watcher & Auto-Push Daemon
 * Automatically monitors file modifications in 'apps/web' and 'apps/api'
 * and safely stages, commits, and pushes them to GitHub.
 * 
 * Usage: node watch-and-push.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const WATCH_DIRS = [
  path.join(__dirname, 'apps', 'web'),
  path.join(__dirname, 'apps', 'api')
];
const DEBOUNCE_MS = 5000; // Wait 5 seconds after the last change before pushing
const IGNORED_PATTERNS = [
  /[\\/]\.next[\\/]/,
  /[\\/]node_modules[\\/]/,
  /[\\/]\.git[\\/]/,
  /\.log$/,
  /\.tmp$/,
  /[\\/]prisma[\\/]dev\.db/, // ignore sqlite/dev db files if any
  /~$/ // temporary editor files
];

let debounceTimer = null;
let changedFiles = new Set();
let isSyncing = false;

// ANSI Terminal Colors for Premium Aesthetics
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  let prefix = '';
  switch (type) {
    case 'success':
      prefix = `${COLORS.green}[✓ SUCCESS]${COLORS.reset}`;
      break;
    case 'warn':
      prefix = `${COLORS.yellow}[! WARNING]${COLORS.reset}`;
      break;
    case 'error':
      prefix = `${COLORS.red}[✗ ERROR]${COLORS.reset}`;
      break;
    case 'sync':
      prefix = `${COLORS.magenta}[⚡ SYNC]${COLORS.reset}`;
      break;
    case 'info':
    default:
      prefix = `${COLORS.cyan}[ℹ INFO]${COLORS.reset}`;
      break;
  }
  console.log(`${COLORS.dim}[${timestamp}]${COLORS.reset} ${prefix} ${message}`);
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

function isIgnored(filePath) {
  return IGNORED_PATTERNS.some(pattern => pattern.test(filePath));
}

async function performSync() {
  if (isSyncing) {
    log('A synchronization is already in progress. Retrying shortly...', 'warn');
    triggerSync(); // Queue up another sync
    return;
  }

  isSyncing = true;
  log(`Starting automatic push to GitHub for ${changedFiles.size} modified files...`, 'sync');
  
  try {
    // 1. Verify git status
    const { stdout: statusOut } = await runCommand('git status --porcelain');
    if (!statusOut.trim()) {
      log('No actual file modifications detected in Git working tree. Sync skipped.', 'info');
      changedFiles.clear();
      isSyncing = false;
      return;
    }

    log('Staging changes (git add .)...', 'info');
    await runCommand('git add .');

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const commitMessage = `auto: sync changes to github (${timestamp})`;
    log(`Committing changes: "${commitMessage}"...`, 'info');
    await runCommand(`git commit -m "${commitMessage}"`);

    log('Pushing to remote repository (git push)...', 'sync');
    const { stdout: pushOut } = await runCommand('git push origin main');
    
    log('Repository successfully synchronized with GitHub!', 'success');
    changedFiles.clear();
  } catch (err) {
    log(`Sync failed: ${err.stderr || err.error || err}`, 'error');
    log('Make sure you are connected to the internet and have git push permissions.', 'warn');
  } finally {
    isSyncing = false;
  }
}

function triggerSync() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    performSync();
  }, DEBOUNCE_MS);
}

function startWatching() {
  console.clear();
  console.log(`${COLORS.bright}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.green}     ⚡ RS EFARINA AUTOMATIC GITHUB SYNC DAEMON ⚡    ${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`${COLORS.dim}Status: Active and watching for modifications...${COLORS.reset}\n`);

  WATCH_DIRS.forEach(dirPath => {
    if (!fs.existsSync(dirPath)) {
      log(`Watch target path does not exist: ${dirPath}`, 'error');
      return;
    }

    log(`Monitoring directory: ${COLORS.yellow}${dirPath}${COLORS.reset}`, 'info');

    fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
      if (!filename) return;

      const fullPath = path.join(dirPath, filename);
      if (isIgnored(fullPath)) return;

      const relPath = path.relative(__dirname, fullPath);
      if (!changedFiles.has(relPath)) {
        changedFiles.add(relPath);
        log(`Change detected: ${COLORS.yellow}${relPath}${COLORS.reset} (${eventType})`, 'info');
      }
      
      triggerSync();
    });
  });

  log(`Debounce interval set to ${COLORS.green}${DEBOUNCE_MS / 1000}s${COLORS.reset} to group rapid saves. Ready.`, 'success');
}

// Initial safety check & start
runCommand('git status')
  .then(() => {
    startWatching();
  })
  .catch(err => {
    log('Git is not initialized or remote is not configured correctly in this directory.', 'error');
    process.exit(1);
  });
