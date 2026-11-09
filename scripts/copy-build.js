import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const vikkiDir = path.join(rootDir, 'vikki');
const docsDir = path.join(rootDir, 'docs');
const rootAssetsDir = path.join(rootDir, 'assets');

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
    const distAssets = path.join(distDir, 'assets');

    // 1. Find main JS and CSS bundles in dist/assets
    if (fs.existsSync(distAssets)) {
      const files = fs.readdirSync(distAssets);
      const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
      const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

      if (jsFile) {
        fs.copyFileSync(path.join(distAssets, jsFile), path.join(distAssets, 'app.js'));
      }
      if (cssFile) {
        fs.copyFileSync(path.join(distAssets, cssFile), path.join(distAssets, 'app.css'));
      }
    }

    // 2. Populate 'vikki/' directory for GitHub repository directory deployments
    console.log('Syncing build output to vikki/ directory...');
    copyRecursiveSync(distDir, vikkiDir);

    // 3. Populate 'docs/' directory for standard GitHub Pages /docs folder deployments
    console.log('Syncing build output to docs/ directory...');
    copyRecursiveSync(distDir, docsDir);

    // 4. Also copy dist/assets to root assets/ so root-level deployments can resolve ./assets/
    console.log('Syncing assets to root assets/ directory...');
    if (fs.existsSync(distAssets)) {
      copyRecursiveSync(distAssets, rootAssetsDir);
    }

    // 5. Create dist/vikki/assets/ alias for backwards-compatibility with absolute /vikki/ requests
    const distVikkiAssets = path.join(distDir, 'vikki', 'assets');
    if (fs.existsSync(distAssets)) {
      if (!fs.existsSync(distVikkiAssets)) {
        fs.mkdirSync(distVikkiAssets, { recursive: true });
      }
      copyRecursiveSync(distAssets, distVikkiAssets);
    }

    // 6. Ensure .nojekyll in all deployment directories
    ['.', 'dist', 'vikki', 'docs', 'public'].forEach((dir) => {
      const p = path.join(rootDir, dir, '.nojekyll');
      if (fs.existsSync(path.dirname(p)) && !fs.existsSync(p)) {
        fs.writeFileSync(p, '');
      }
    });

    // 7. Ensure 404.html in root for GitHub Pages
    const dist404 = path.join(distDir, '404.html');
    const root404 = path.join(rootDir, '404.html');
    if (fs.existsSync(dist404) && !fs.existsSync(root404)) {
      fs.copyFileSync(dist404, root404);
    }

    console.log('Successfully prepared vikki/, docs/, root assets, and dist/ directories!');
  }
} catch (err) {
  console.error('Error copying build output:', err);
}
