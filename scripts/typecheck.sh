#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/check-checkout.sh"
cd "$ROOT"
node "$TOOL_ROOT/typescript/bin/tsc" -p packages/dsh-file-drop/tsconfig.host.json --pretty false --noEmit
node "$TOOL_ROOT/typescript/bin/tsc" -p packages/dsh-file-drop/tsconfig.client.json --pretty false --noEmit
