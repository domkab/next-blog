#!/bin/bash

echo "🚀 Starting Monitoring Setup..."

# Resolve script's actual directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CADDYFILE_PATH="$SCRIPT_DIR/../Caddyfile"
GOACCESS_SERVICE_PATH="/etc/systemd/system/goaccess.service"

# 1. Check Caddyfile exists
if [[ -f "$CADDYFILE_PATH" ]]; then
  echo "📄 Found Caddyfile at: $CADDYFILE_PATH"
else
  echo "❌ Caddyfile not found at: $CADDYFILE_PATH"
  exit 1
fi

# 2. Update & install tools
apt update && apt upgrade -y
apt install -y goaccess fail2ban curl htop logrotate

# 3. Install Netdata (non-interactive)
echo "🧠 Installing Netdata..."
bash <(curl -SsL https://my-netdata.io/kickstart.sh) --dont-wait --disable-telemetry

# 4. Inject access log config into Caddyfile
echo "📄 Ensuring Caddyfile has access logging..."
if ! grep -q "log {" "$CADDYFILE_PATH"; then
  cat <<EOL >> "$CADDYFILE_PATH"

log {
  output file /var/log/caddy/access.log
  format single_field common_log
}
EOL
  echo "✅ Appended logging block to Caddyfile"
else
  echo "ℹ️ Caddyfile already has a log block"
fi

# 5. Configure logrotate
echo "🧹 Configuring logrotate for Caddy logs..."
cat <<EOF > /etc/logrotate.d/caddy
/var/log/caddy/*.log {
  daily
  missingok
  rotate 14
  compress
  delaycompress
  notifempty
  create 0640 root adm
  sharedscripts
  postrotate
    docker compose restart caddy > /dev/null 2>&1 || true
  endscript
}
EOF

# 6. Setup GoAccess live dashboard (first run only)
echo "🎯 Setting up GoAccess HTML output..."
mkdir -p /var/www/html
mkdir -p "$SCRIPT_DIR/../caddy-logs"
touch "$SCRIPT_DIR/../caddy-logs/access.log"

# 7. Create GoAccess systemd service
if [[ ! -f "$GOACCESS_SERVICE_PATH" ]]; then
  echo "⚙️ Creating GoAccess systemd service..."
  cat <<EOF > "$GOACCESS_SERVICE_PATH"
[Unit]
Description=GoAccess real-time HTML dashboard
After=network.target docker.service

[Service]
ExecStart=/usr/bin/goaccess $SCRIPT_DIR/../caddy-logs/access.log \\
  --log-format=COMBINED \\
  --real-time-html \\
  -o /var/www/html/report.html
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable goaccess
  systemctl start goaccess
  echo "✅ GoAccess systemd service installed and started!"
else
  echo "ℹ️ GoAccess systemd service already exists"
fi

echo "✅ Monitoring stack installed!"
echo "➡ Netdata: http://$(hostname -I | awk '{print $1}'):19999"
echo "➡ GoAccess report: http://$(hostname -I | awk '{print $1}')/report.html"