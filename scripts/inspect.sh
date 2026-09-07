#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
node "$ROOT/scripts/host-patch.mjs" --check
node "$ROOT/scripts/profile-state.mjs" --check
