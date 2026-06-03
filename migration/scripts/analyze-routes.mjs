#!/usr/bin/env node
/**
 * Compares Phase-0 legacy route inventory with Angular 21 route tables.
 * Writes migration/route-coverage.json and prints a summary.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (ent.name.endsWith('.routes.ts')) acc.push(full);
  }
  return acc;
}

function extractPaths(content) {
  const paths = [];
  for (const m of content.matchAll(/path:\s*['"]([^'"]+)['"]/g)) {
    paths.push(m[1]);
  }
  return paths;
}

function routeKind(fileContent, routePath) {
  const blockRe = new RegExp(
    `\\{[^{}]*path:\\s*['"]${routePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][^{}]*\\}`,
    's',
  );
  const block = fileContent.match(blockRe)?.[0] ?? '';
  if (/loadComponent|loadChildren/.test(block)) return 'implemented';
  if (/placeholder\s*\(/.test(block) || /FeaturePlaceholder/.test(block)) {
    return 'placeholder';
  }
  if (/redirectTo/.test(block)) return 'redirect';
  return 'unknown';
}

const inventoryPath = path.join(repoRoot, 'migration/route-inventory.raw.txt');
const inventoryText = fs.readFileSync(inventoryPath, 'utf8');
const normalizeRoute = (p) => p.replace(/:[^/]+/g, ':param');

const legacyPaths = new Set();
for (const m of inventoryText.matchAll(/path:\s*['"]([^'"]+)['"]/g)) {
  const p = m[1];
  if (p && p !== '' && p !== '**') legacyPaths.add(p);
}

const routeFiles = [
  path.join(repoRoot, 'src/app/app.routes.ts'),
  ...walk(path.join(repoRoot, 'src/app/features')),
];

const newByPath = new Map();
for (const file of routeFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const p of extractPaths(content)) {
    if (!newByPath.has(p)) {
      newByPath.set(p, { kind: routeKind(content, p), file: path.relative(repoRoot, file) });
    }
  }
}

const newByNormalized = new Map();
for (const [p, meta] of newByPath) {
  newByNormalized.set(normalizeRoute(p), { path: p, ...meta });
}

const implemented = [];
const placeholders = [];
const redirects = [];
const legacyOnly = [];
const paramAliasMatch = [];

for (const p of [...legacyPaths].sort()) {
  const hit = newByPath.get(p);
  if (!hit) {
    const alias = newByNormalized.get(normalizeRoute(p));
    if (alias && alias.kind === 'implemented') {
      paramAliasMatch.push({ legacy: p, current: alias.path });
    } else {
      legacyOnly.push(p);
    }
    continue;
  }
  if (hit.kind === 'placeholder') placeholders.push(p);
  else if (hit.kind === 'redirect') redirects.push(p);
  else implemented.push(p);
}

const newOnly = [...newByPath.keys()]
  .filter((p) => !legacyPaths.has(p) && p !== '' && p !== '**')
  .sort();

const report = {
  generatedAt: new Date().toISOString(),
  legacyUniquePaths: legacyPaths.size,
  newUniquePaths: newByPath.size,
  matchedImplemented: implemented.length,
  matchedPlaceholder: placeholders.length,
  matchedRedirect: redirects.length,
  legacyOnlyCount: legacyOnly.length,
  paramAliasMatchCount: paramAliasMatch.length,
  newOnlyCount: newOnly.length,
  placeholders,
  legacyOnlyPaths: legacyOnly,
  paramAliasMatches: paramAliasMatch,
  newOnlyPaths: newOnly,
};

const outJson = path.join(repoRoot, 'migration/route-coverage.json');
fs.writeFileSync(outJson, JSON.stringify(report, null, 2));

console.log('Route coverage (legacy inventory vs Angular 21)');
console.log('  Legacy unique paths:', report.legacyUniquePaths);
console.log('  New app unique paths:', report.newUniquePaths);
console.log('  Matched + implemented:', report.matchedImplemented);
console.log('  Matched + placeholder:', report.matchedPlaceholder);
console.log(
  '  Param-alias match (e.g. :id → :applicationId):',
  report.paramAliasMatchCount,
);
console.log('  Legacy-only (no route):', report.legacyOnlyCount);
console.log('  New-only paths:', report.newOnlyCount);
console.log('  Wrote', path.relative(repoRoot, outJson));
