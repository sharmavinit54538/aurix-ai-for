#!/usr/bin/env bash
set -e

BASELINE_FILE=".any-baseline"

if [ ! -f "$BASELINE_FILE" ]; then
  echo "Baseline file $BASELINE_FILE not found!"
  exit 1
fi

BASELINE=$(tr -d '[:space:]' < "$BASELINE_FILE")

# Count occurrences of ': any', 'as any', '<any>' excluding routeTree.gen.ts
COUNT=$(git grep -E "(: *any\b|\bas +any\b|<any>)" -- src ":!src/routeTree.gen.ts" 2>/dev/null | wc -l | tr -d '[:space:]')

echo "Current 'any' count: $COUNT (Baseline: $BASELINE)"

if [ "$COUNT" -gt "$BASELINE" ]; then
  echo "Error: 'any' count increased from $BASELINE to $COUNT! Ratchet failed."
  exit 1
fi

echo "Ratchet passed: $COUNT <= $BASELINE."
exit 0
