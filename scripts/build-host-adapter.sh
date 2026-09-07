#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/check-checkout.sh"
if [ ! -f "$CHECKOUT/packages/client/ui-attachment/src/DropOverlay.tsx" ]; then
  for suffix in js js.map d.ts d.ts.map; do
    rm -f "$CHECKOUT/packages/client/ui-attachment/lib/types/DropOverlay.$suffix"
  done
fi
for package in ui-conversation ui-attachment; do
  node "$CHECKOUT/node_modules/typescript/bin/tsc" -p "$CHECKOUT/packages/client/$package/tsconfig.json" --pretty false
  (cd "$CHECKOUT/packages/client/$package" && node "$CHECKOUT/node_modules/tsdown/dist/run.mjs" --config tsdown.config.ts)
done
(cd "$CHECKOUT" && node --import tsx/esm scripts/gen-client-catalog.ts)
(cd "$CHECKOUT/packages/extensions/cordis-client-runner" && node "$CHECKOUT/node_modules/tsdown/dist/run.mjs" --config tsdown.config.ts)
