#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/check-checkout.sh"
cd "$ROOT"
node "$TOOL_ROOT/typescript/bin/tsc" -p packages/dsh-file-drop/tsconfig.host.json --pretty false
node "$TOOL_ROOT/typescript/bin/tsc" -p packages/dsh-file-drop/tsconfig.client.json --pretty false
cd packages/dsh-file-drop
node "$TOOL_ROOT/tsdown/dist/run.mjs" --config tsdown.config.ts
for artifact in lib/index.js lib/client.js lib/types/types.js lib/types/types.d.ts lib/types/client/index.d.ts; do
  test -f "$artifact"
done
