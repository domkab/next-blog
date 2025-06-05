echo "🔁 Cloning repo..."
git clone https://github.com/domkab/next-blog.git
cd next-blog || exit 1

echo "📦 Building and launching containers (app + Caddy)..."
docker compose up -d --build nextblog caddy

echo "✅ App should now be live at: https://laurynogargasoapiserver.xyz"
