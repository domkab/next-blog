set -e

echo "🚀 Updating and installing dependencies..."
sudo apt update
sudo apt install -y curl wget gnupg build-essential debian-keyring debian-archive-keyring apt-transport-https

echo "📦 Installing NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

echo "📦 Installing latest LTS Node.js..."
nvm install --lts
nvm use --lts
node -v
npm -v

echo "⚙️ Installing PM2..."
npm install -g pm2
pm2 startup
pm2 save

echo "🌐 Installing latest Caddy (via GitHub)..."
CADDY_DEB_URL=$(curl -s https://api.github.com/repos/caddyserver/caddy/releases/latest \
  | grep browser_download_url \
  | grep 'linux_amd64.deb"' \
  | cut -d '"' -f 4)

wget "$CADDY_DEB_URL" -O caddy_latest.deb
sudo dpkg -i caddy_latest.deb
rm caddy_latest.deb
caddy version

echo "✅ Done! PM2 and Caddy installed, Node ready via NVM."

echo -e "\n📌 NEXT STEPS:"
echo "- Use 'pm2 start npm --name \"next-app\" -- run start' to launch your app"
echo "- Use 'sudo nano /etc/caddy/Caddyfile' to configure your domain"
echo "- Use 'sudo systemctl reload caddy' to apply Caddy changes"