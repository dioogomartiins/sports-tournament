import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  {
    // Código da app: corre no navegador
    files: ['js/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    // Testes, regras e configuração: correm no Node
    files: ['tests/**/*.{js,mjs}', '*.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
];
