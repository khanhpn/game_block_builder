<div align="center">

# Neon Blocks

**A polished, keyboard-first Tetris experience with a neon arcade interface.**

[![Deploy GitHub Pages](https://github.com/khanhpn/game_block_builder/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/khanhpn/game_block_builder/actions/workflows/deploy-pages.yml)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-6DFFAE.svg)](LICENSE)

[Play Neon Blocks](https://khanhpn.github.io/game_block_builder/) · [Report a bug](https://github.com/khanhpn/game_block_builder/issues)

</div>

## Overview

Neon Blocks is a browser-based implementation of classic Tetris, built for responsive keyboard control and a focused arcade experience. Its deterministic TypeScript engine is kept separate from React, while custom hooks connect game state, timing, input, persistence, and derived render models to a polished DOM-based interface.

## Features

- Fourteen balanced tetromino variants: seven classic shapes plus seven mirror variants
- Fair piece distribution through a 14-bag randomizer
- Expanded 15×25 playfield for longer runs and more strategic stacking
- Ghost piece that previews the landing position
- Collision detection, wall kicks, soft drop, and hard drop
- Line clearing, scoring, progressive levels, and increasing gravity
- High-score persistence with a safe `localStorage` fallback
- Ready, paused, and game-over states with keyboard shortcuts
- Responsive neon arcade interface for desktop and narrow viewports
- Reduced-motion support for users who prefer fewer animations
- Synthesized Web Audio cues for rotation, drops, line clears, and dramatic game over
- In-game volume slider and mute toggle with persisted preferences

## Controls

| Key               | Action                  |
| ----------------- | ----------------------- |
| <kbd>←</kbd>      | Move left               |
| <kbd>→</kbd>      | Move right              |
| <kbd>↓</kbd>      | Soft drop               |
| <kbd>↑</kbd>      | Rotate clockwise        |
| <kbd>Space</kbd>  | Hard drop               |
| <kbd>P</kbd>      | Pause or resume         |
| <kbd>Escape</kbd> | Pause or resume         |
| <kbd>Enter</kbd>  | Start or restart a game |

## Tech Stack

| Area       | Technology                           |
| ---------- | ------------------------------------ |
| UI         | React 19, TypeScript 6               |
| Build      | Vite 8, pnpm 11                      |
| Testing    | Vitest, React Testing Library, jsdom |
| Quality    | ESLint, Prettier, Husky, lint-staged |
| Deployment | GitHub Actions, GitHub Pages         |

## Architecture

The project keeps game rules independent from the rendering framework:

- **Game engine** — pure TypeScript modules define tetrominoes, board operations, scoring, collision detection, and reducer transitions.
- **Custom hooks** — focused hooks manage the game loop, keyboard events, high scores, state orchestration, board cells, piece previews, and overlay actions.
- **Components** — rendering-only React components display the board, controls, score, next piece, and game state overlays.
- **Styles** — responsibility-based CSS files define tokens, layout, panels, the game board, animations, and responsive behavior.
- **Imports** — the `@/` alias keeps internal module paths stable and readable.

```text
src/
├── components/        # Rendering-focused React components
├── game/              # Pure game engine and reducer
├── hooks/             # State, input, timing, persistence, and view-model hooks
├── styles/            # Neon visual system and responsive layout
├── test/              # Shared test setup
├── App.tsx             # Application composition
└── main.tsx            # Browser entry point
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 24 or newer
- [pnpm](https://pnpm.io/) 11

### Installation

```bash
git clone https://github.com/khanhpn/game_block_builder.git
cd game_block_builder
corepack enable
pnpm install
pnpm dev
```

Vite prints the local development URL after the server starts.

## Available Scripts

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Start the Vite development server          |
| `pnpm build`        | Typecheck and create a production build    |
| `pnpm test --run`   | Run the complete test suite once           |
| `pnpm typecheck`    | Validate TypeScript without emitting files |
| `pnpm lint`         | Run ESLint across the repository           |
| `pnpm format`       | Format supported files with Prettier       |
| `pnpm format:check` | Verify formatting without changing files   |

## Testing and Quality

The current suite contains **31 tests across 14 test files**, covering the game engine, reducer, custom hooks, keyboard controls, persistence, board rendering, audio fallback behavior, and application shell.

Run the same quality gate used before deployment:

```bash
pnpm format:check
pnpm lint
pnpm test --run
pnpm typecheck
pnpm build
```

Husky runs lint-staged before every commit. Staged TypeScript files are formatted with Prettier and checked with ESLint; other supported staged text files are formatted with Prettier. A failed check stops the commit.

## Deployment

The [GitHub Pages workflow](.github/workflows/deploy-pages.yml) runs on every push to `master` and can also be started manually. It installs dependencies with the frozen pnpm lockfile, verifies formatting and code quality, builds the Vite application with the repository base path, and deploys the `dist` artifact to GitHub Pages.

Live site: [https://khanhpn.github.io/game_block_builder/](https://khanhpn.github.io/game_block_builder/)

## License

Neon Blocks is available under the [MIT License](LICENSE).
