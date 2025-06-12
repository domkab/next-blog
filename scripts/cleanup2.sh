echo "🧹 Starting cleanup..."

echo "💽 Disk usage before cleanup:"
df -h

echo "📦 Cleaning up APT packages..."
apt clean && apt autoremove -y

# Truncate large system logs (safe on Ubuntu/Debian)
echo "🗑️ Truncating system logs..."
truncate -s 0 /var/log/syslog 2>/dev/null
truncate -s 0 /var/log/auth.log 2>/dev/null
truncate -s 0 /var/log/kern.log 2>/dev/null

# Journal logs cleanup
if command -v journalctl &> /dev/null; then
  echo "🧾 Vacuuming journal logs..."
  journalctl --vacuum-time=7d
fi

# Clean temporary directories
echo "♻️ Cleaning /tmp and /var/tmp..."
rm -rf /tmp/* /var/tmp/* 2>/dev/null

# Clean user cache directories
echo "🧼 Cleaning user cache directories..."
rm -rf ~/.cache/* ~/.npm/* ~/.yarn/* ~/.pnpm-store/* 2>/dev/null

# Optional: Clean PM2 logs
echo "🧼 Cleaning PM2 logs..."
pm2 flush

echo "⏳ Waiting for disk usage to reflect cleanup..."
sync
sleep 3

echo "💽 Disk usage after cleanup:"
df -h

echo "✅ Cleanup complete."