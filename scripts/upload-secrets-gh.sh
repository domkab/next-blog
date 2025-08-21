# Default: .env.production

ENV_FILE="${1:-.env.production}"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: File '$ENV_FILE' not found."
  exit 1
fi

echo "🔑 Uploading secrets from $ENV_FILE to GitHub..."

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ "$line" =~ ^# || -z "$line" ]] && continue

  key="${line%%=*}"
  value="${line#*=}"

  # Upload secret
  printf "%s" "$value" | gh secret set "$key"
  echo "Set secret: $key"
done < "$ENV_FILE"

echo "✅ Done!"