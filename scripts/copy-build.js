import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const vikkiDir = path.join(rootDir, 'vikki');
const docsDir = path.join(rootDir, 'docs');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  if (fs.existsSync(distDir)) {
    // 1. Populate 'vikki/' directory for GitHub repository directory deployments
    console.log('Syncing build output to vikki/ directory...');
    copyRecursiveSync(distDir, vikkiDir);

    // 2. Populate 'docs/' directory for standard GitHub Pages /docs folder deployments
    console.log('Syncing build output to docs/ directory...');
    copyRecursiveSync(distDir, docsDir);

    // 3. Create dist/vikki/assets/ alias for backwards-compatibility with absolute /vikki/ requests
    const distVikkiAssets = path.join(distDir, 'vikki', 'assets');
    const distAssets = path.join(distDir, 'assets');
    if (fs.existsSync(distAssets)) {
      if (!fs.existsSync(distVikkiAssets)) {
        fs.mkdirSync(distVikkiAssets, { recursive: true });
      }
      copyRecursiveSync(distAssets, distVikkiAssets);
    }

    // 4. Ensure .nojekyll in all deployment directories
    ['dist', 'vikki', 'docs', 'public'].forEach((dir) => {
      const p = path.join(rootDir, dir, '.nojekyll');
      if (fs.existsSync(path.dirname(p)) && !fs.existsSync(p)) {
        fs.writeFileSync(p, '');
      }
    });

    console.log('Successfully prepared vikki/, docs/, and dist/ directories!');
  }
} catch (err) {
  console.error('Error copying build output:', err);
}
