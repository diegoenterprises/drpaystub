#!/bin/bash
# Dr Paystub - Azure startup script
# Start the app FIRST (so health checks pass), then install Playwright in background

export PLAYWRIGHT_BROWSERS_PATH=/home/pw-browsers

# Background: install Playwright Chromium + system deps if not already present
(
  if ! ls "$PLAYWRIGHT_BROWSERS_PATH"/chromium-* 1>/dev/null 2>&1; then
    echo "[bg] Installing Playwright Chromium browser..."
    apt-get update -qq 2>/dev/null
    apt-get install -yqq libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
      libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
      libpango-1.0-0 libcairo2 libasound2 libxshmfence1 \
      fonts-liberation fonts-noto-color-emoji 2>/dev/null || true
    npx playwright install chromium 2>&1 || true
    echo "[bg] Playwright Chromium installed."
  else
    echo "[bg] Playwright Chromium already present."
  fi
) &

echo "Starting Dr Paystub server..."
node app.js
