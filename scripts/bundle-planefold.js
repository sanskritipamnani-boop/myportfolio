const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_HTML = path.join(ROOT_DIR, 'public', 'plixet-final.html');
const SOURCE_MEDIA_DIR = path.join(ROOT_DIR, 'public', 'plixet-media');
const BUNDLE_DIR = path.join(ROOT_DIR, 'planefold-standalone-bundle');
const TARGET_MEDIA_DIR = path.join(BUNDLE_DIR, 'media');

console.log('--- Generating Standalone Planefold Case Study Bundle ---');

if (!fs.existsSync(BUNDLE_DIR)) {
  fs.mkdirSync(BUNDLE_DIR, { recursive: true });
}
if (!fs.existsSync(TARGET_MEDIA_DIR)) {
  fs.mkdirSync(TARGET_MEDIA_DIR, { recursive: true });
}

if (!fs.existsSync(SOURCE_HTML)) {
  console.error(`Error: Source HTML file not found at ${SOURCE_HTML}`);
  process.exit(1);
}

let htmlContent = fs.readFileSync(SOURCE_HTML, 'utf8');

// Replace root-relative /plixet-media/ with relative ./media/
htmlContent = htmlContent.replace(/(["'])\/plixet-media\//g, '$1./media/');

const targetHtmlPath = path.join(BUNDLE_DIR, 'index.html');
fs.writeFileSync(targetHtmlPath, htmlContent, 'utf8');
console.log(`[✓] Created standalone HTML: ${targetHtmlPath}`);

if (!fs.existsSync(SOURCE_MEDIA_DIR)) {
  console.error(`Error: Source media folder not found at ${SOURCE_MEDIA_DIR}`);
  process.exit(1);
}

const mediaFiles = fs.readdirSync(SOURCE_MEDIA_DIR);
let copiedCount = 0;

for (const file of mediaFiles) {
  const srcFilePath = path.join(SOURCE_MEDIA_DIR, file);
  const stat = fs.statSync(srcFilePath);
  if (stat.isFile()) {
    const destFilePath = path.join(TARGET_MEDIA_DIR, file);
    fs.copyFileSync(srcFilePath, destFilePath);
    copiedCount++;
  }
}

console.log(`[✓] Copied ${copiedCount} media assets into: ${TARGET_MEDIA_DIR}`);

const readmeContent = `PLANEFOLD CASE STUDY (STANDALONE OFFLINE BUNDLE)
=================================================

HOW TO OPEN:
1. Double-click "index.html" in this folder.
2. It will open directly in any web browser (Chrome, Edge, Safari, Firefox).
3. No local server, Node.js, or internet connection is required to view images or play videos.

FOLDER CONTENTS:
- index.html    : The standalone webpage with relative paths.
- media/        : All PNG, MP4, and SVG media assets used in the case study.

PORTABILITY:
You can zip or copy this entire "planefold-standalone-bundle" folder to:
- A USB drive
- Google Drive / Dropbox
- Any static hosting (GitHub Pages, Netlify, Vercel)
- Another computer
All media links will continue working smoothly because all paths are relative (./media/...).
`;

fs.writeFileSync(path.join(BUNDLE_DIR, 'README.txt'), readmeContent, 'utf8');
console.log(`[✓] Created README.txt instructions.`);
console.log(`\n======================================================`);
console.log(`STANDALONE BUNDLE READY AT:`);
console.log(BUNDLE_DIR);
console.log(`Direct entry file: ${targetHtmlPath}`);
console.log(`======================================================\n`);
