#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
: "${DSH_CHECKOUT:?set DSH_CHECKOUT explicitly}" "${DSH_HOME:?set DSH_HOME explicitly}" "${DSH_PROFILE:?set DSH_PROFILE explicitly}"
case "${1:---check}" in
  --check) bash "$ROOT/scripts/inspect.sh" ;;
  --remove)
    node "$ROOT/scripts/host-patch.mjs" --check
    node "$ROOT/scripts/profile-state.mjs" --remove
    node "$ROOT/scripts/host-patch.mjs" --remove
    bash "$ROOT/scripts/build-host-adapter.sh"
    bash "$ROOT/scripts/inspect.sh"
    echo 'file-drop: removed on disk and restored owned Host baseline; service activation is separate.'
    ;;
  *) echo 'usage: remove.sh [--check|--remove]' >&2; exit 2 ;;
esac
