import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', '.claude/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // App code: runs in the browser
    files: ['src/**/*.{js,ts}'],
    languageOptions: { globals: globals.browser },
  },
  {
    // Tests, rules and config: runs in Node
    files: ['tests/**/*.{js,mjs,ts}', '*.{js,mjs,ts}'],
    languageOptions: { globals: globals.node },
  },
);
