# README, Hook Refactor, and Quality Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a professional English README, extract remaining component logic into custom hooks, and enforce Prettier plus ESLint before commits and GitHub Pages deployments.

**Architecture:** Three focused hooks own derived board cells, next-piece preview data, and overlay actions while components render props and JSX only. Prettier, Husky, and lint-staged provide the local quality gate; the existing Pages workflow mirrors it with `format:check`. README content is generated only from verified repository behavior and configuration.

**Tech Stack:** React 19, TypeScript 6, Vite 8, pnpm 11, Vitest, React Testing Library, ESLint, Prettier, Husky, lint-staged, GitHub Actions.

## Global Constraints

- All new functions and hooks use arrow-function syntax.
- Internal source imports use the `@/` alias.
- Components are never wrapped in `memo()` or `React.memo()`.
- Components retain rendering concerns only; derived data and event callbacks live in custom hooks.
- Before every implementation commit, run Prettier and ESLint and proceed only when both pass.
- README text is professional English and contains no fake screenshot, coverage percentage, roadmap, contributor list, or unsupported claims.

---

## File Structure

- `src/hooks/useBoardCells.ts`: derives the flattened board render model.
- `src/hooks/useNextPiecePreview.ts`: derives the 4×4 preview occupancy model.
- `src/hooks/useGameOverlayAction.ts`: returns the stable overlay action callback.
- `src/hooks/*.test.ts(x)`: focused hook behavior tests.
- `src/components/GameBoard.tsx`, `NextPiece.tsx`, `GameOverlay.tsx`: rendering-only consumers.
- `.prettierrc.json`, `.prettierignore`: repository formatting policy.
- `.husky/pre-commit`: staged-file quality gate entrypoint.
- `package.json`, `pnpm-lock.yaml`: scripts, lint-staged rules, and tool dependencies.
- `.github/workflows/deploy-pages.yml`: CI format check.
- `README.md`: product-first public documentation.

### Task 1: Extract component logic into custom hooks

**Files:**

- Create: `src/hooks/useBoardCells.ts`, `src/hooks/useBoardCells.test.ts`
- Create: `src/hooks/useNextPiecePreview.ts`, `src/hooks/useNextPiecePreview.test.ts`
- Create: `src/hooks/useGameOverlayAction.ts`, `src/hooks/useGameOverlayAction.test.tsx`
- Modify: `src/components/GameBoard.tsx`, `src/components/NextPiece.tsx`, `src/components/GameOverlay.tsx`

**Interfaces:**

- `useBoardCells(state: GameState): DisplayCell[]`, where `DisplayCell` is exported as `{ type: PieceType | null; mode?: 'active' | 'ghost' }`.
- `useNextPiecePreview(piece: PieceType): boolean[]`, always returning 16 cells.
- `useGameOverlayAction(status: GameStatus, dispatch: Dispatch<GameAction>): () => void`.

- [ ] **Step 1: Write failing hook tests**

```tsx
it("layers locked, ghost, and active cells into a 200-cell model", () => {
  const state = {
    ...createInitialState(() => 0.5),
    status: "playing" as const,
  };
  const { result } = renderHook(() => useBoardCells(state));
  expect(result.current).toHaveLength(200);
  expect(result.current.filter((cell) => cell.mode === "active")).toHaveLength(
    4,
  );
  expect(result.current.filter((cell) => cell.mode === "ghost")).toHaveLength(
    4,
  );
});

it("builds a centered 4 by 4 preview", () => {
  const { result } = renderHook(() => useNextPiecePreview("I"));
  expect(result.current).toHaveLength(16);
  expect(result.current.filter(Boolean)).toHaveLength(4);
});

it("dispatches the action matching the overlay status", () => {
  const dispatch = vi.fn();
  const { result } = renderHook(() => useGameOverlayAction("paused", dispatch));
  act(() => result.current());
  expect(dispatch).toHaveBeenCalledWith({ type: "TOGGLE_PAUSE" });
});
```

- [ ] **Step 2: Verify the tests fail for missing hooks**

Run: `pnpm test --run src/hooks/useBoardCells.test.ts src/hooks/useNextPiecePreview.test.ts src/hooks/useGameOverlayAction.test.tsx`

Expected: FAIL because the three hook modules do not exist.

- [ ] **Step 3: Implement the hooks with memoized arrow functions**

```ts
export const useNextPiecePreview = (piece: PieceType): boolean[] => {
  const matrix = TETROMINOES[piece];
  return useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const offsetX = Math.floor((4 - matrix[0].length) / 2);
        const offsetY = Math.floor((4 - matrix.length) / 2);
        return Boolean(matrix[row - offsetY]?.[column - offsetX]);
      }),
    [matrix],
  );
};
```

`useBoardCells` moves `DisplayCell`, `paintPiece`, `getDropDistance`, and the existing `useMemo` calculation out of `GameBoard`. `useGameOverlayAction` moves the existing status switch and `useCallback` out of `GameOverlay`.

- [ ] **Step 4: Replace component-local logic with the new hooks**

```tsx
const cells = useBoardCells(state);
const previewCells = useNextPiecePreview(piece);
const handleAction = useGameOverlayAction(status, dispatch);
```

Remove `useMemo`, `useCallback`, engine helpers, and logic-only types from the three component imports. Keep component JSX and existing props unchanged.

- [ ] **Step 5: Verify hook and component behavior**

Run: `pnpm test --run src/hooks src/components && pnpm typecheck`

Expected: all hook/component tests pass and TypeScript exits 0.

- [ ] **Step 6: Format, lint, and commit**

Run: `pnpm dlx prettier@latest --write src/hooks src/components && pnpm lint`

Expected: Prettier completes and ESLint exits 0.

```bash
git add src/hooks src/components
git commit -m "refactor: move component logic into custom hooks"
```

### Task 2: Add automated formatting and pre-commit checks

**Files:**

- Create: `.prettierrc.json`, `.prettierignore`, `.husky/pre-commit`
- Modify: `package.json`, `pnpm-lock.yaml`, `.github/workflows/deploy-pages.yml`

**Interfaces:**

- Produces `pnpm format` and `pnpm format:check`.
- Produces a `prepare` script that initializes Husky.
- Produces lint-staged rules for `*.{ts,tsx}` and supported text files.

- [ ] **Step 1: Install formatting and hook dependencies**

Run: `pnpm add -D prettier husky lint-staged`

Expected: `package.json` and `pnpm-lock.yaml` include all three tools.

- [ ] **Step 2: Add formatting policy and scripts**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

Add these `package.json` scripts:

```json
"format": "prettier --write .",
"format:check": "prettier --check .",
"prepare": "husky"
```

Add this lint-staged configuration:

```json
"lint-staged": {
  "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{css,md,json,yml,yaml,html}": "prettier --write"
}
```

Ignore `node_modules`, `dist`, `coverage`, `pnpm-lock.yaml`, and generated `*.tsbuildinfo` files in `.prettierignore`.

- [ ] **Step 3: Add the Husky hook**

```sh
pnpm exec lint-staged
```

Store that exact command in `.husky/pre-commit` and ensure the file is executable.

- [ ] **Step 4: Add CI formatting verification**

Insert before the workflow lint step:

```yaml
- name: Check formatting
  run: pnpm format:check
```

- [ ] **Step 5: Format the repository and verify the gate**

Run: `pnpm format && pnpm format:check && pnpm lint && pnpm test --run && pnpm typecheck && pnpm build`

Expected: formatting is unchanged on the check pass; 24 existing tests plus the new hook tests pass; lint, typecheck, and build exit 0.

- [ ] **Step 6: Verify pre-commit enforcement**

Create and stage a temporary malformed Markdown fixture, run `pnpm exec lint-staged`, confirm Prettier rewrites it, then remove the fixture from the index and working tree. Stage the task files and run `pnpm exec lint-staged` again.

Expected: staged supported files are formatted; ESLint runs for staged TypeScript/TSX; the final staged task files pass.

- [ ] **Step 7: Commit through the hook**

```bash
git add .prettierrc.json .prettierignore .husky package.json pnpm-lock.yaml .github/workflows/deploy-pages.yml src
git commit -m "chore: enforce formatting before commits"
```

Expected: Husky invokes lint-staged and the commit succeeds only after Prettier and ESLint pass.

### Task 3: Write the professional README and align metadata

**Files:**

- Create: `README.md`
- Modify: `package.json`

**Interfaces:**

- README live demo: `https://khanhpn.github.io/game_block_builder/`.
- Repository: `https://github.com/khanhpn/game_block_builder`.
- Workflow badge: `https://github.com/khanhpn/game_block_builder/actions/workflows/deploy-pages.yml/badge.svg`.

- [ ] **Step 1: Run fresh verification for factual README claims**

Run: `pnpm test --run && pnpm typecheck && pnpm build`

Expected: record the exact passing test count; typecheck and build exit 0.

- [ ] **Step 2: Correct package metadata**

Set the description to `A polished browser-based Tetris game with neon arcade visuals.` Set homepage to the Pages URL, repository URL to `https://github.com/khanhpn/game_block_builder.git`, bugs URL to the matching issues page, and keywords to `tetris`, `react`, `typescript`, `vite`, `game`, and `arcade`.

- [ ] **Step 3: Write the product-first README**

Start with this verified hero contract:

```md
<div align="center">
  <h1>Neon Blocks</h1>
  <p>A polished, keyboard-first Tetris experience with a neon arcade interface.</p>
</div>
```

Add useful badges, live demo, overview, verified features, keyboard controls, stack, architecture, source tree, pnpm setup, scripts, quality workflow, GitHub Pages deployment, and MIT license. Mention the fresh test count from Step 1 only.

- [ ] **Step 4: Verify links, commands, and content**

Run: `rg -n "neonblocks.com|neon-blocks/neon-blocks|platform for creating" README.md package.json`

Expected: no matches.

Run: `pnpm format && pnpm format:check && pnpm lint && pnpm test --run && pnpm typecheck && pnpm build && git diff --check`

Expected: every command exits 0.

- [ ] **Step 5: Commit through the enforced hook**

```bash
git add README.md package.json
git commit -m "docs: add professional project readme"
```

Expected: Husky runs lint-staged; Prettier and ESLint pass before the commit is created.
