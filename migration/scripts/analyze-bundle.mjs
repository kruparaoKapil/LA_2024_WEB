#!/usr/bin/env node
/**
 * Summarises production build size from dist/PresentationPages/stats.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const statsPath = path.join(repoRoot, 'dist/PresentationPages/stats.json');
const browserDir = path.join(repoRoot, 'dist/PresentationPages/browser');

if (!fs.existsSync(statsPath)) {
  console.error('Run: npm run build:prod -- --stats-json');
  process.exit(1);
}

const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
const outputs = Object.entries(stats.outputs ?? {});

let totalBytes = 0;
const byExt = { js: 0, css: 0, other: 0 };
const topFiles = [];

for (const [file, meta] of outputs) {
  const bytes = meta.bytes ?? 0;
  totalBytes += bytes;
  const ext = file.endsWith('.css') ? 'css' : file.endsWith('.js') ? 'js' : 'other';
  byExt[ext] += bytes;
  topFiles.push({ file: path.basename(file), bytes });
}
topFiles.sort((a, b) => b.bytes - a.bytes);

let diskBytes = 0;
if (fs.existsSync(browserDir)) {
  for (const ent of fs.readdirSync(browserDir)) {
    const full = path.join(browserDir, ent);
    if (fs.statSync(full).isFile()) diskBytes += fs.statSync(full).size;
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  statsOutputs: outputs.length,
  totalBytes,
  totalKb: Math.round(totalBytes / 1024),
  byExt,
  diskBrowserKb: Math.round(diskBytes / 1024),
  topJsChunks: topFiles.filter((f) => f.file.endsWith('.js')).slice(0, 12),
};

const outJson = path.join(repoRoot, 'migration/bundle-stats.json');
fs.writeFileSync(outJson, JSON.stringify(report, null, 2));

console.log('Production bundle (stats.json)');
console.log('  Total output:', report.totalKb, 'KB');
console.log('  JS:', Math.round(byExt.js / 1024), 'KB  CSS:', Math.round(byExt.css / 1024), 'KB');
console.log('  Browser folder on disk:', report.diskBrowserKb, 'KB');
console.log('  Top chunks:');
for (const f of report.topJsChunks.slice(0, 6)) {
  console.log('   ', Math.round(f.bytes / 1024) + 'KB', f.file);
}
console.log('  Wrote', path.relative(repoRoot, outJson));
