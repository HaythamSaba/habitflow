# CLAUDE.md

## UI/UX audit workflow

- Audit items are listed in `docs/ui-ux-audit.md`. Work on exactly ONE item per request, the one I name.
- Never run `git add`, `git commit`, `git push`, or any git command that changes history or the remote. I handle all git.
- Stay in scope. List related issues under "Noticed, not fixed" instead of fixing them.
- After each change, run the type check and build (and tests if any exist) and confirm nothing new breaks or warns.
- If a fix is much bigger than the audit's effort estimate or needs a decision, stop and ask first.
- When done, reply with:
  - Item ID and title
  - Previous situation (with file paths)
  - Solution (with files modified)
  - Why it matters
  - How to test manually
  - A Conventional Commits message (subject max 72 chars, `Refs: audit [ID]` in the body)
  - Noticed, not fixed
