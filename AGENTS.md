# Repository Guidelines

## Project Structure & Module Organization
This is a small Node.js Discord/Gitea bot. Key paths:
- `src/`: application source (entry point is `src/index.js`).
- `package.json`: scripts and dependencies.
- `.env`: local configuration (do not commit secrets).
- `run.bat`: Windows convenience launcher.

There is no dedicated `tests/` or `docs/` directory in this repo today.

## Build, Test, and Development Commands
Use npm (lockfile is present).
- `npm install`: install dependencies.
- `npm start`: run the bot via `node src/index.js`.

There is no build step or test script configured in `package.json`.

## Coding Style & Naming Conventions
No formatter or linter is configured. Keep changes minimal and consistent:
- Match existing style in touched files (spacing, quotes, and trailing commas).
- Prefer clear, descriptive names for commands and handlers (e.g., `handleWebhook`, `registerCommands`).
- Keep new modules under `src/` and export with CommonJS `module.exports` or `exports` to match existing patterns.

## Testing Guidelines
No automated tests or coverage targets are set up. If you add tests, include:
- A `test` script in `package.json`.
- A short note in the PR describing how to run them.

## Commit & Pull Request Guidelines
Git history is minimal (only an initial commit), so no convention is established. Suggested practice:
- Use short, imperative commit messages (e.g., “Add webhook signature check”).
- PRs should include: purpose, key changes, and any manual test steps.
- If changes affect bot behavior, add a brief example of the new command or event flow.

## Security & Configuration Tips
- Use `.env` for tokens and secrets (e.g., `DISCORD_TOKEN`, `GITEA_TOKEN`).
- Never log secrets or commit them; rotate credentials if they leak.
