import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { en } from '../src/i18n/en.js';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(js|ts)$/.test(name) ? [path] : [];
  });
}

describe('en strings', () => {
  it('every en.section.key used in src exists', () => {
    const table = en as unknown as Record<string, Record<string, unknown>>;
    const missing = new Set<string>();
    for (const file of sourceFiles(join(__dirname, '../src'))) {
      for (const [ref, section, key] of readFileSync(file, 'utf8').matchAll(/\ben\.(\w+)\.(\w+)/g)) {
        if (table[section]?.[key] === undefined) missing.add(`${ref} (${file.split('/src/')[1]})`);
      }
    }
    expect([...missing]).toEqual([]);
  });
});
