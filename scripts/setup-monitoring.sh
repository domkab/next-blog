echo "🚀 Starting Monitoring Setup..."

# 1. Update & install tools
apt update && apt upgrade -y
apt install -y goaccess fail2ban curl htop logrotate

# 2. Install Netdata (non-interactive)
echo "🧠 Installing Netdata..."
bash <(curl -SsL https://my-netdata.io/kickstart.sh) --dont-wait --disable-telemetry

# 3. Inject access log config into Caddyfile (if not already present)
echo "📄 Ensuring Caddyfile has access logging..."
CADDYFILE_PATH="./Caddyfile"
if [[ -f "$CADDYFILE_PATH" ]]; then
  if ! grep -q "log {" "$CADDYFILE_PATH"; then
    echo "
log {
  output file /var/log/caddy/access.log
  format single_field common_log
}" >> "$CADDYFILE_PATH"
    echo "✅ Appended logging block to Caddyfile"
  else
    echo "ℹ️ Caddyfile already has a log block"
  fi
else
  echo "❌ Caddyfile not found in current directory: $PWD"
  exit 1
fi

# 4. Configure logrotate for Caddy logs
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

# 5. Setup GoAccess live dashboard
echo "🎯 Setting up GoAccess HTML output..."
mkdir -p /var/www/html
goaccess ./caddy-logs/access.log \
  --log-format=COMBINED \
  --real-time-html -o /var/www/html/report.html &

echo "✅ Monitoring stack installed!"
echo "➡ Netdata: http://$(hostname -I | awk '{print $1}'):19999"
echo "➡ GoAccess report: http://$(hostname -I | awk '{print $1}')/report.html"