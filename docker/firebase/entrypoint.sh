#!/bin/sh
set -e

DATA_DIR="/data"
PROJECT_ID="${FIREBASE_PROJECT_ID:-demo-torneio}"

echo "=================================================="
echo " Starting Firebase Emulator Suite"
echo " Project: ${PROJECT_ID}"
echo " Database Emulator:  http://0.0.0.0:9000"
echo " Auth Emulator:      http://0.0.0.0:9099"
echo " Emulator Suite UI:  http://0.0.0.0:4000"
echo "=================================================="

# Run seed script in the background once emulator is online
(
  for i in $(seq 1 30); do
    if curl -s http://127.0.0.1:9000/ > /dev/null 2>&1 && curl -s http://127.0.0.1:9099/ > /dev/null 2>&1; then
      sleep 1
      if [ -f "/usr/local/bin/seed.mjs" ]; then
        node /usr/local/bin/seed.mjs || true
      fi
      break
    fi
    sleep 1
  done
) &

CMD="firebase emulators:start --project ${PROJECT_ID}"

# If data folder exists and contains export metadata, import it
if [ -f "${DATA_DIR}/firebase-export-metadata.json" ]; then
  echo "Found existing export metadata. Importing data from ${DATA_DIR}..."
  CMD="${CMD} --import=${DATA_DIR}"
else
  echo "No existing data found in ${DATA_DIR}. Starting clean."
fi

# Configure export on exit so state is preserved between container restarts
mkdir -p "${DATA_DIR}"
CMD="${CMD} --export-on-exit=${DATA_DIR}"

# Execute emulators
exec ${CMD} "$@"
