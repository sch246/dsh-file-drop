#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHECKOUT="${DSH_CHECKOUT:?set DSH_CHECKOUT to an explicit Harness checkout}"
TOOL_ROOT="${DSH_TOOL_ROOT:-$CHECKOUT/node_modules}"
git -C "$CHECKOUT" rev-parse --is-inside-work-tree >/dev/null
if [ -e "$ROOT/harness" ] && [ ! -L "$ROOT/harness" ]; then
  echo 'file-drop: refusing to replace a non-symlink Harness locator' >&2
  exit 1
fi
ln -sfn "$CHECKOUT" "$ROOT/harness"
