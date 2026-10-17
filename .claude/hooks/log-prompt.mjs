#!/usr/bin/env node
// Appends every prompt the user submits to PROMPTS.md, word for word, with a timestamp.
// Runs on Claude Code's UserPromptSubmit hook. Never blocks the prompt.
import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw || "{}");
    const prompt = (input.prompt ?? "").trim();
    if (!prompt) return;
    const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
    const file = join(root, "PROMPTS.md");
    if (!existsSync(file)) {
      writeFileSync(file, "# Prompt log\n\nEvery prompt sent to Claude Code during this build, in order, logged automatically by `.claude/hooks/log-prompt.mjs`.\n");
    }
    const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
    const session = (input.session_id ?? "").slice(0, 8);
    appendFileSync(file, `\n---\n\n### ${ts} UTC · session ${session}\n\n${prompt}\n`);
  } catch {
    // Logging must never break the session.
  }
  process.exit(0);
});
