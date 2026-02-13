DEPLOYMENT_TIMESTAMP=$(date '+%Y-%m-%d_%H:%M:%S')
FRONTEND_DIR="/var/www/translations"
SOURCE_DIR="$FRONTEND_DIR/source"
LATEST_BUILD_DIR="$FRONTEND_DIR/builds/$DEPLOYMENT_TIMESTAMP"
CURRENT_SYMLINK="$FRONTEND_DIR/public"

[ -z "${VITE_API_URL:-}" ] && { echo "Error: VITE_API_URL is not set" >&2; exit 1; }

cd "$SOURCE_DIR"

rm -rf node_modules
git pull
npm ci
echo "VITE_API_URL=$VITE_API_URL" > .env
npm run build
mkdir "$LATEST_BUILD_DIR" || { echo "Error: Cannot create directory" >&2; exit 1; }
cp -R ./dist/* "$LATEST_BUILD_DIR"

ln -sfn "$LATEST_BUILD_DIR" "$CURRENT_SYMLINK"