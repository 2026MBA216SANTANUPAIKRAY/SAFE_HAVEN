import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const publicDir = path.resolve('public');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Find JS and CSS files in assets
const assetFiles = fs.readdirSync(assetsDir);
const jsFile = assetFiles.find(f => f.endsWith('.js') && !f.includes('aistudio'));
const cssFile = assetFiles.find(f => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('Could not find JS or CSS asset in dist/assets');
  process.exit(1);
}

const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');

// Escape any closing script tag inside JS
const safeJsContent = jsContent.replace(/<\/script/gi, '<\\/script');

// Replace stylesheet link with inline <style>
html = html.replace(
  /<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*["'][^>]*>/i,
  `<style id="inlined-app-styles">\n${cssContent}\n</style>`
);

// Replace module script with inline <script type="module">
html = html.replace(
  /<script[^>]*type=["']module["'][^>]*src=["'][^"']*["'][^>]*><\/script>/i,
  `<script type="module" id="inlined-app-bundle">\n${safeJsContent}\n</script>`
);

// Add an offline banner comment / metadata
const offlineHeader = `<!-- 
  ================================================================
  SafeHaven Institutional Residential Companion
  APARTMENT 402 · TOWER A — OFFLINE STANDALONE APPLICATION
  Self-contained single-file offline distribution.
  Works 100% locally with zero internet connection or server required.
  Built with IndexedDB local vault, offline mmWave simulation & audio.
  ================================================================
-->\n`;

html = offlineHeader + html;

// Ensure public dir exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const targetPublicPath = path.join(publicDir, 'SafeHaven_Apartment402_Offline.html');
const targetDistPath = path.join(distDir, 'SafeHaven_Apartment402_Offline.html');

fs.writeFileSync(targetPublicPath, html, 'utf8');
fs.writeFileSync(targetDistPath, html, 'utf8');

console.log(`Successfully generated standalone offline HTML:`);
console.log(` - ${targetPublicPath} (${(html.length / 1024).toFixed(1)} KB)`);
console.log(` - ${targetDistPath} (${(html.length / 1024).toFixed(1)} KB)`);
