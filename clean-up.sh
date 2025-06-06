#!/bin/bash

echo "🧹 Starting cleanup..."

echo "🧼 Docker system prune..."
docker system prune -a --volumes -f

echo "📦 Cleaning up APT packages..."
apt clean && apt autoremove -y

# Truncate large system logs (optional, safe for Ubuntu)
echo "🗑️ Truncating system logs..."
truncate -s 0 /var/log/syslog 2>/dev/null
truncate -s 0 /var/log/auth.log 2>/dev/null
truncate -s 0 /var/log/kern.log 2>/dev/null

if command -v journalctl &> /dev/null; then
  echo "🧾 Vacuuming journal logs..."
  journalctl --vacuum-time=7d
fi

echo "💽 Disk usage after cleanup:"
df -h

echo "✅ Cleanup complete."