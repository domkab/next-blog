# BUILD
npm run build

# SYNC
rsync -avz --delete \
  .next \
  public \
  package.json \
  package-lock.json \
  node_modules \
  $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# RESTART
ssh $REMOTE_USER@$REMOTE_HOST \
  "pm2 restart $APP_NAME || (cd $REMOTE_DIR && npm run start)"