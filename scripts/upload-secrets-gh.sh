ENV_NAME="staging"
ENV_FILE="${1:-.env.staging}"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: File '$ENV_FILE' not found."
  exit 1
fi

echo "🔑 Uploading secrets from $ENV_FILE to GitHub ENV: $ENV_NAME..."

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ "$line" =~ ^# || -z "$line" ]] && continue

  key="${line%%=*}"
  value="${line#*=}"

  printf "%s" "$value" | gh secret set "$key" --env "$ENV_NAME"
  echo "Set secret: $key"
done < "$ENV_FILE"

echo "✅ Done!"