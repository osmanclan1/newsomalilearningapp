import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // This app is src/ only. These sibling directories are separate projects
  // sharing the repo root (Flutter build output, a standalone Node service,
  // an unidentified folder) — never meant to be linted by this config.
  globalIgnores([
    'dist',
    'somali_learning_flutter',
    'story-hover-translator',
    'Somali language learning app',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Config files run under Node, not the browser.
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
