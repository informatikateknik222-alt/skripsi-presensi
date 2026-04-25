const fs = require('fs');
const path = require('path');

function removeGitFolders(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (item === 'node_modules') continue;
        if (item === '.git' && dir !== __dirname) {
            console.log(`Removing ${fullPath}`);
            fs.rmSync(fullPath, { recursive: true, force: true });
            continue;
        }
        if (fs.statSync(fullPath).isDirectory()) {
            removeGitFolders(fullPath);
        }
    }
}

removeGitFolders(__dirname);
