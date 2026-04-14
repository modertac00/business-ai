#!/bin/sh
# Creates backend/.env with local dev defaults if it is missing or broken.

ENV_FILE="backend/.env"
PLACEHOLDER="HOST"

needs_setup() {
  # True if file missing or still contains placeholder values
  [ ! -f "$ENV_FILE" ] || grep -q "$PLACEHOLDER" "$ENV_FILE"
}

if needs_setup; then
  echo "Writing $ENV_FILE with local dev defaults..."
  cat > "$ENV_FILE" <<'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/business_ai?schema=public"
PORT=3001
EOF
  echo "Done."
else
  echo "$ENV_FILE already configured — skipping."
fi
