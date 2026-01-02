#!/usr/bin/env bash
set -u

RESULTS_DIR="test-results"
NUMBER_PATTERN='^[0-9]+([.][0-9]+)?$'

all_pass=true

echo "Contents of $RESULTS_DIR directory:"
ls -la "$RESULTS_DIR" || { echo "Error: $RESULTS_DIR directory missing."; exit 1; }

echo

check_file() {
  local file="$1"
  local comparator="$2"
  local fail_msg="$3"

  if [ ! -f "$file" ]; then
    echo "Error: $(basename "$file") is missing."
    all_pass=false
    return
  fi

  local value
  value=$(cat "$file")
  echo "$(basename "$file")=$value"

  if ! [[ "$value" =~ $NUMBER_PATTERN ]]; then
    echo "Invalid number in $(basename "$file"): $value"
    all_pass=false
    return
  fi

  if (( $(echo "$value $comparator" | bc -l) == 0 )); then
    echo "$fail_msg"
    all_pass=false
  fi
}

check_file "$RESULTS_DIR/lighthouse-score.txt" ">= 0.89" "Lighthouse score is below 0.89."
check_file "$RESULTS_DIR/loss.txt" "< 0.1" "Loss is not < 0.1."
check_file "$RESULTS_DIR/accuracy.txt" ">= 0.95" "Accuracy is below 0.95."

if [ ! -f "$RESULTS_DIR/lighthouse-report.html" ]; then
  echo "Error: lighthouse-report.html is missing."
  all_pass=false
else
  echo "Found lighthouse-report.html"
fi

if $all_pass; then
  echo "All metric checks passed."
  exit 0
else
  echo "Metric checks failed."
  exit 1
fi
