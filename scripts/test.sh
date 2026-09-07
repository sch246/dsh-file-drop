#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/check-checkout.sh"
cd "$ROOT"
node "$TOOL_ROOT/vitest/vitest.mjs" run packages/dsh-file-drop/tests "$@"
