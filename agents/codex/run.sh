#!/usr/bin/env bash
set -euo pipefail
CMD="${1:-scaffold}"
SPEC="${2:-specs/contrastive-goat.yaml}"
: "${CODEX_API_KEY:?Set CODEX_API_KEY in env/secrets}"
CODEX_BIN="${CODEX_BIN:-codex}"  # change if your CLI name differs

case "$CMD" in
  scaffold)
    $CODEX_BIN chat \
      --system "$(cat agents/codex/prompts/system.md)" \
      --input "$(cat agents/codex/prompts/codegen.md)" \
      --var SPEC_PATH="$SPEC" \
      --files "specs:$SPEC" \
      --files "src:src" \
      --files "data:data" \
      --out-dir .
    ;;
  fix)
    $CODEX_BIN chat \
      --system "$(cat agents/codex/prompts/system.md)" \
      --input "$(cat agents/codex/prompts/fix.md)" \
      --files "src:src" "tests:tests" "lighthouserc.json:lighthouserc.json"
    ;;
  *)
    echo "Usage: $0 {scaffold|fix} [spec.yaml]" && exit 2
    ;;
esac