# Professional README Design

## Goal

Create a polished, product-first English README for Neon Blocks that accurately presents the game to players and developers visiting the public GitHub repository.

## Audience

- Players who want to understand the game and open the live demo quickly.
- Developers evaluating the implementation, architecture, and code quality.
- Contributors who need exact local setup and verification commands.

## Content Structure

1. Centered hero with the Neon Blocks name, a concise arcade-focused tagline, repository badges, and live demo link.
2. Overview explaining that Neon Blocks is a browser-based classic Tetris experience built with React and TypeScript.
3. Feature list covering the seven tetrominoes, 7-bag randomizer, ghost piece, scoring, progressive levels, high-score persistence, pause/restart, responsive neon UI, and reduced-motion support.
4. Keyboard controls table for movement, rotation, soft drop, hard drop, pause, start, and restart.
5. Technical overview describing the pure TypeScript engine, reducer state machine, custom hooks, focused components, `@` source alias, and responsibility-based CSS files.
6. Project structure tree limited to meaningful source directories and configuration files.
7. Getting-started instructions using Node.js 24, pnpm 11, `pnpm install`, and `pnpm dev`.
8. Scripts table copied from `package.json`, with accurate descriptions for development, linting, testing, typechecking, and production builds.
9. Testing and quality section that states the current test count only when verified in the same implementation turn.
10. GitHub Pages deployment section describing the existing workflow on pushes to `master` and the repository Pages URL.
11. MIT license section linking to the repository license.

## Presentation Rules

- Use concise, professional English and consistent title casing.
- Prefer short paragraphs, compact tables, and scannable sections.
- Use only real repository, demo, workflow, license, and technology links.
- Do not include a fake screenshot, fabricated coverage percentage, roadmap, contributor list, download count, or unsupported compatibility claim.
- Keep badges useful: deployment workflow, React, TypeScript, pnpm, and MIT license.
- Avoid excessive emoji, decorative separators, and marketing language.

## Metadata Alignment

Update `package.json` so its description, homepage, repository URL, keywords, and bug tracker describe `khanhpn/game_block_builder` and the Neon Blocks game. Preserve dependency versions, scripts, package manager, author, version, and license unless factual correction requires otherwise.

## Verification

- Check every README link and command against local repository configuration.
- Confirm README Markdown has no placeholder text, stale code-platform wording, or unsupported claims.
- Run `pnpm lint`, `pnpm test --run`, `pnpm typecheck`, and `pnpm build` after metadata changes.
- Confirm the test count from fresh output before mentioning it in README.
- Run `git diff --check` and inspect the final Markdown source.

## Acceptance Criteria

The repository root contains a professional English `README.md` that accurately introduces Neon Blocks, makes the live demo and controls immediately discoverable, documents architecture and local development, matches the GitHub Pages workflow, and agrees with corrected package metadata.
