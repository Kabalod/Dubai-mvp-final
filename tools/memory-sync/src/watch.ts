import chokidar from 'chokidar';
import path from 'node:path';
import fs from 'node:fs/promises';
import ts from 'typescript';
import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('root', { type: 'string', demandOption: true, describe: 'Root directory to watch' })
  .option('api', { type: 'string', default: process.env.MEMORY_BASE_URL || 'http://localhost:8080', describe: 'Memory API base URL' })
  .option('tags', { type: 'string', default: 'code', describe: 'Comma separated tags' })
  .option('category', { type: 'string', default: 'code', describe: 'Memory category' })
  .option('debounceMs', { type: 'number', default: 1500, describe: 'Debounce for batching' })
  .argv as unknown as {
    root: string;
    api: string;
    tags: string;
    category: string;
    debounceMs: number;
  };

const TAGS = argv.tags.split(',').map(s => s.trim()).filter(Boolean);

type MemoryItem = {
  text: string;
  type: 'system' | 'property' | 'analytics' | 'recommendation' | 'user' | 'agent' | 'market' | 'legal' | 'code';
  age: 'day' | 'week' | 'month' | 'year' | 'permanent';
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
};

const queue = new Map<string, MemoryItem>();
let debounceTimer: NodeJS.Timeout | null = null;

function scheduleFlush() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(flush, argv.debounceMs);
}

async function flush() {
  if (queue.size === 0) return;
  const items = Array.from(queue.values());
  queue.clear();

  try {
    const payload = { items: items.map(i => ({ ...i, type: 'code' as const, age: 'week' as const })) };
    await axios.post(`${argv.api}/memory/batch/add`, payload);
    // eslint-disable-next-line no-console
    console.log(`[memory-sync] Uploaded ${items.length} snippets`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[memory-sync] Upload failed', e);
  }
}

function extractAstSummary(code: string) {
  try {
    const sf = ts.createSourceFile('file.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const exports: string[] = [];
    const signatures: string[] = [];
    const visit = (node: ts.Node) => {
      if ((ts.getCombinedModifierFlags(node as any) & ts.ModifierFlags.Export) !== 0) {
        if (ts.isFunctionDeclaration(node) && node.name) exports.push(node.name.getText());
        if (ts.isClassDeclaration(node) && node.name) exports.push(node.name.getText());
        if (ts.isInterfaceDeclaration(node) && node.name) exports.push(node.name.getText());
        if (ts.isTypeAliasDeclaration(node) && node.name) exports.push(node.name.getText());
        if (ts.isVariableStatement(node)) {
          node.declarationList.declarations.forEach(d => {
            if (d.name) exports.push(d.name.getText());
          });
        }
      }
      if (ts.isFunctionDeclaration(node) && node.name) {
        signatures.push(`function ${node.name.getText()}(${node.parameters.map(p=>p.getText()).join(', ')})`);
      }
      if (ts.isMethodDeclaration(node) && node.name) {
        signatures.push(`method ${(node.name as ts.Identifier).getText()}(${node.parameters.map(p=>p.getText()).join(', ')})`);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return { exports, signatures };
  } catch {
    return { exports: [], signatures: [] };
  }
}

async function extractFromFile(filePath: string): Promise<MemoryItem | null> {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) return null;

    const content = await fs.readFile(filePath, 'utf-8');

    // Первые 20 строк (часто описание/импорты)
    const head = content.split('\n').slice(0, 20).join('\n');

    // Заголовки JSDoc /** ... */ и верхние комментарии // ...
    const jsdocMatches = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
    const topComments = (content.match(/\n\s*\/\/.*$/gm) || []).slice(0, 5).join('\n');

    const ast = extractAstSummary(content);
    const exports = ast.exports.slice(0, 15);

    const short = [
      `FILE: ${path.relative(process.cwd(), filePath)}`,
      exports.length ? `EXPORTS: ${exports.join(', ')}` : '',
      head,
      ast.signatures.slice(0, 10).join('\n'),
      jsdocMatches[0] || '',
      topComments
    ].filter(Boolean).join('\n\n');

    if (!short.trim()) return null;

    const item: MemoryItem = {
      text: short.slice(0, 2000), // ограничим размер
      type: 'code',
      age: 'week',
      category: argv.category,
      tags: TAGS,
      metadata: { filePath: filePath, exports }
    };
    return item;
  } catch {
    return null;
  }
}

function onChange(filePath: string) {
  extractFromFile(filePath).then(item => {
    if (!item) return;
    queue.set(filePath, item);
    scheduleFlush();
  });
}

async function main() {
  // eslint-disable-next-line no-console
  console.log(`[memory-sync] Watching ${argv.root}, API ${argv.api}`);
  const watcher = chokidar.watch(argv.root, {
    persistent: true,
    ignoreInitial: false,
    ignored: [/node_modules/, /dist/, /.git/]
  });

  watcher
    .on('add', onChange)
    .on('change', onChange)
    .on('unlink', (filePath) => {
      queue.delete(filePath);
    });
}

main();
