// ESLint 配置文件（ESLint v9+ 扁平配置格式）
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

// 导出 ESLint 配置
export default [
  // 基础配置
  {
    // 忽略文件
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
  
  // TypeScript 配置
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // React 规则
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'error',
      
      // React Hooks 规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // React Refresh 规则
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
      }],
      
      // 基础规则
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // 由 @typescript-eslint/no-unused-vars 代替
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // Prettier 配置（禁用与 Prettier 冲突的 ESLint 规则）
  prettierConfig,
]