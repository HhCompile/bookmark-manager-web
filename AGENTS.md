# Bookmark Manager Web - Agent Guide

## Project Overview

This is a **Bookmark Manager Web Application** built with React, TypeScript, and Vite. It provides a modern interface for managing browser bookmarks with features like AI-powered organization, Chrome bookmark synchronization, data visualization, and a private vault for sensitive bookmarks.

The project was originally exported from Figma as a code bundle for "Data Collection & AI Processing" and has been enhanced with full functionality.

**Key Features:**
- Bookmark management with multiple view modes (list, card, tree)
- Chrome browser bookmark synchronization
- AI-powered bookmark organization and optimization
- Tag cloud visualization and analytics
- Quality monitoring for bookmark health
- Private vault for encrypted bookmarks
- Task manager for batch operations
- Reader mode for bookmarked articles

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 18.3.1 |
| Language | TypeScript 5.x |
| Build Tool | Vite 6.3.5 |
| Styling | Tailwind CSS 4.1.12 |
| UI Components | Radix UI + shadcn/ui patterns |
| Animation | Motion (Framer Motion successor) |
| Icons | Lucide React |
| Charts | Recharts |
| State Management | React Context + Hooks |
| Testing | Jest 30.x + React Testing Library |
| Package Manager | pnpm |

---

## Project Structure

```
bookmark-manager-web/
├── src/
│   ├── App.tsx                 # Main app component with tab navigation
│   ├── main.tsx                # Application entry point
│   ├── Layout/                 # Layout components
│   │   ├── Header.tsx          # Top navigation header
│   │   ├── Sidebar.tsx         # Side navigation
│   │   └── ReaderSidebar.tsx   # Reader mode sidebar
│   ├── components/
│   │   ├── ui/                 # 40+ reusable UI components (shadcn style)
│   │   ├── home/               # Homepage feature sections
│   │   ├── upload/             # File upload components
│   │   ├── views/              # Bookmark view modes (card/list/tree)
│   │   └── fallback/           # Fallback components
│   ├── common/                 # Shared feature components
│   │   ├── AIConfirmationPanel.tsx
│   │   ├── QualityMonitor.tsx
│   │   ├── SyncProgress.tsx
│   │   ├── TagCloudVisualization.tsx
│   │   └── TaskManagerPanel.tsx
│   ├── contexts/
│   │   └── BookmarkContext.tsx # Global bookmark state management
│   ├── hooks/
│   │   └── useChromeBookmarks.ts # Chrome bookmark API integration
│   ├── pages/
│   │   ├── home/HomePage.tsx
│   │   └── bookmark/
│   │       ├── BookmarkView.tsx
│   │       └── PrivateVault.tsx
│   ├── types/
│   │   └── bookmark.ts         # TypeScript type definitions
│   ├── utils/
│   │   ├── analytics.ts        # Google Analytics 4 integration
│   │   └── env.ts              # Environment utilities
│   └── styles/
│       ├── index.css           # Main style imports
│       ├── tailwind.css        # Tailwind directives + utilities
│       ├── theme.css           # CSS variables for theming
│       └── fonts.css           # Font imports
├── index.html                  # HTML entry
├── manifest.json               # Chrome extension manifest (MV3)
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration
├── eslint.config.js            # ESLint flat config (v9+)
├── prettier.config.mjs         # Prettier formatting config
├── jest.config.js              # Jest test configuration
└── .env.{development,production} # Environment variables
```

---

## Build and Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (port 3000)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

---

## Code Style Guidelines

### ESLint Configuration
- Uses ESLint v9+ flat config format
- TypeScript parser with strict rules
- React hooks rules enforced
- No explicit `any` allowed (`@typescript-eslint/no-explicit-any: error`)
- Console warnings in development (`no-console: warn`)
- Debugger statements forbidden (`no-debugger: error`)

### Prettier Configuration
- 2-space indentation (no tabs)
- Single quotes
- Semicolons required
- Trailing commas (ES5 style)
- 80 character line width
- LF line endings

### Naming Conventions
- Components: PascalCase (e.g., `BookmarkView.tsx`)
- Hooks: camelCase starting with `use` (e.g., `useChromeBookmarks.ts`)
- Utilities: camelCase (e.g., `analytics.ts`)
- CSS classes: Tailwind utility-first approach

### Import Organization
```typescript
// 1. React/Third-party imports
import { useState, useCallback } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

// 2. Absolute imports from @/
import Header from '@/layout/Header';
import { useBookmarks } from '@/contexts/BookmarkContext';

// 3. Relative imports (only when necessary)
import './styles.css';
```

---

## Component Patterns

### UI Components (shadcn/ui style)
All UI components follow the shadcn/ui pattern using:
- `class-variance-authority` for variant management
- `cn()` utility for class name merging
- Radix UI primitives for accessibility
- CSS variables from `theme.css`

Example:
```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva("base-classes", {
  variants: { variant: { default: "...", destructive: "..." } },
  defaultVariants: { variant: 'default' }
});
```

### Context Pattern
The app uses React Context for global state:
- `BookmarkContext` manages bookmarks, folders, view mode, search
- Components use `useBookmarks()` hook to access context
- Always wrap with `BookmarkProvider` in App.tsx

### Lazy Loading
Major page components are lazy-loaded for performance:
```typescript
const BookmarkView = lazy(() => import('./pages/bookmark/BookmarkView'));
```

---

## Testing Strategy

### Test Setup
- Framework: Jest 30.x with jsdom environment
- React Testing Library for component tests
- ts-jest for TypeScript transformation
- Coverage reporting with lcov

### Test Configuration
- Test files: No existing tests currently (Jest configured but empty)
- Coverage collection from `src/**/*.{ts,tsx}`
- Path mapping `@/*` mapped to `src/*`
- Setup file: `src/setupTests.ts` (if needed)

### Running Tests
```bash
pnpm test           # Single run
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage report
```

---

## Chrome Extension Integration

The app is designed to work as a Chrome extension with bookmark API access:

### Manifest V3
- Permission: `bookmarks`
- Default popup: `index.html`
- Background service worker ready

### Chrome Bookmarks Hook
`useChromeBookmarks()` hook provides:
- `refreshBookmarks()` - Sync with Chrome bookmarks
- `createBookmark()`, `updateBookmark()`, `removeBookmark()` - CRUD operations
- Only works in Chrome extension environment (graceful fallback)

### Global Type Declarations
Chrome API types are declared in `useChromeBookmarks.ts`:
```typescript
declare global {
  interface Window { chrome?: { bookmarks?: {...} } }
}
```

---

## Environment Variables

Variables must be prefixed with `VITE_` to be exposed to client:

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_APP_NAME` | Bookmark Manager | Bookmark Manager |
| `VITE_APP_ENV` | development | production |
| `VITE_APP_API_BASE_URL` | http://localhost:3001/api | https://api.bookmark-manager.com/api |
| `VITE_APP_DEBUG` | true | false |
| `VITE_APP_VERSION` | 1.0.0 | 1.0.0 |

Access in code:
```typescript
import { getEnv } from '@/utils/env';
const apiUrl = getEnv('VITE_APP_API_BASE_URL');
```

---

## Design System

### Colors
- Primary: `#030213` (near black)
- Secondary: `#e9ebef` (light gray)
- Muted: `#ececf0`
- Destructive: `#d4183d`
- Success: Green states

### Typography
- Font: System font stack (Inter fallback)
- Base: 16px
- Headings: Medium weight (500)
- Line height: 1.5

### Spacing
- Based on 4px grid
- Standard gaps: 4px, 8px, 16px, 24px, 32px

### Breakpoints
- Mobile: 360px
- Tablet: 768px
- Desktop: 1024px
- Large: 1280px
- XL: 1536px

Full design system documented in `设计系统指南.md` (Chinese).

---

## Security Considerations

1. **XSS Prevention**: React's built-in escaping + no `dangerouslySetInnerHTML`
2. **Content Security**: Configure CSP headers in production
3. **Chrome Extension**: Only requests necessary `bookmarks` permission
4. **Private Vault**: Client-side encryption for sensitive bookmarks
5. **Environment**: API keys and secrets should NEVER be in client-side env vars

---

## Common Development Tasks

### Adding a New Page
1. Create component in `src/pages/{section}/`
2. Add route/tab type in `App.tsx`
3. Implement lazy loading for code splitting
4. Add navigation handler in `Sidebar.tsx`

### Adding a New UI Component
1. Create in `src/components/ui/`
2. Use `cva` for variants
3. Use `cn()` utility for class merging
4. Export from component file

### Adding a New Hook
1. Create in `src/hooks/`
2. Export from `src/hooks/index.ts`
3. Follow `useXxx` naming convention

### Working with Bookmarks
- Always use `useBookmarks()` hook for data
- For Chrome sync, use `useChromeBookmarks()` hook
- Bookmark type defined in `src/types/bookmark.ts`

---

## Deployment

### Production Build
```bash
pnpm build
```
Output goes to `dist/` directory with:
- Optimized chunks (manualChunks configured in vite.config.ts)
- Source maps disabled
- CSS code splitting enabled
- Assets hashed for caching

### Chrome Extension Deployment
1. Build the project
2. Load `dist/` as unpacked extension in Chrome
3. Or pack for Chrome Web Store submission

---

## Troubleshooting

### Common Issues

**Chrome API not available**
- App gracefully degrades when not in Chrome extension context
- Check `isChromeExtension()` before calling Chrome APIs

**Tailwind classes not working**
- Ensure `@import 'tailwindcss'` is in `tailwind.css`
- Run dev server to regenerate styles

**Import path issues**
- Use `@/` prefix for src imports
- Check `tsconfig.json` paths configuration

---

## Additional Documentation

- `设计系统指南.md` - Comprehensive design system (Chinese)
- `技能功能与使用方法文档.md` - Feature documentation (Chinese)
- `技能整合方案.md` - Integration plan (Chinese)
