#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
: "${DSH_CHECKOUT:?set DSH_CHECKOUT explicitly}" "${DSH_HOME:?set DSH_HOME explicitly}" "${DSH_PROFILE:?set DSH_PROFILE explicitly}"
case "${1:---check}" in
  --check) bash "$ROOT/scripts/inspect.sh" ;;
  --install)
    node "$ROOT/scripts/profile-state.mjs" --check
    node "$ROOT/scripts/host-patch.mjs" --apply
    bash "$ROOT/scripts/build-host-adapter.sh"
    bash "$ROOT/scripts/build.sh"
    node "$ROOT/scripts/profile-state.mjs" --install
    bash "$ROOT/scripts/inspect.sh"
    echo 'file-drop: installed on disk; service activation is separate.'
    ;;
  *) echo 'usage: setup.sh [--check|--install]' >&2; exit 2 ;;
esac
