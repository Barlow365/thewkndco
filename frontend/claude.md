---

# claude.md  
### Canonical Project Brain  Used by Both Claude Code and Codex

This file defines the architecture, rules, workflow, and state-management logic for all AI coding agents working in this repository. Any AI tool  including Claude Code, OpenAI Codex, or other LLM-based coding agents  must read **claude.md**, `features.online-python-compiler.json`, and `progress.md` BEFORE writing or modifying any code.

This repository contains a Next.js application that will become an **Online Python Compiler** with a browser-based editor, an API route for running Python code safely via a sandboxed backend, and a test-driven incremental build workflow.

---

## 1. Purpose of This Document

- Acts as the canonical "project memory" so the agent does not rely on conversation history.
- Defines the architecture, constraints, coding rules, and the long-task-safe workflow.
- Enables ANY AI agent to resume work at any time using ONLY:
  - claude.md
  - features.online-python-compiler.json
  - progress.md
  - git log

This ensures stable, incremental development even if sessions terminate.

---

## 2. Architecture Overview

(keep all the architecture sections we created earlier  Codex should copy all content from cloud.md)

[NOTE FOR CODEX: Copy the full architecture, testing strategy, coding rules, etc., from cloud.md exactly. If cloud.md exists, migrate its content into this file verbatim.]

---

## 8. Agent Workflow Rules (Codex + Claude)

### BEFORE ANY CODING:
Every session must begin by reading:

1. `claude.md`
2. `features.online-python-compiler.json`
3. `progress.md`
4. `git log --oneline -n 10` (optional)

### CORE LOOP:
Coding agents follow this EXACT procedure:

1. Identify the **next unfinished feature** in the features JSON.
2. Work ONLY on that feature until the implementation is complete.
3. Write code in small, clean steps.
4. Run tests:
   - Unit tests: `npm test`
   - Browser tests: `npm run test:feature <feature-id>` (via Puppeteer)
5. Only if all tests pass:
   - Mark that features `implemented` flags as true in the JSON.
   - Update all related test flags to true.
   - Add a new entry to the TOP of `progress.md`.
   - Make a Git commit in a clean, mergeable state.

### ADDITIONAL RULES:
- Codex MUST NOT change the structure of the features JSON.
- Codex may ONLY update:
  - `implemented` fields for features
  - `implemented` fields for tests
- Codex must NEVER delete or rename:
  - claude.md
  - features JSON
  - progress.md

---

## 9. Git Protocol (Applies to Codex and Claude)

After a feature passes all tests:

1. Run: `git add .`
2. Commit with:
   - `feat(<feature-id>): <short description>`
3. Ensure working tree is clean.
4. Ensure tests pass *before and after* the commit.

---

## 10. Next Steps

This project is now ready for the incremental build loop.

Future prompts will use:

> Codex, implement the next feature marked not done.

---
