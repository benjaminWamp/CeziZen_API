#!/bin/sh
echo "Running entrypoint script..."
# if [ "$NODE_ENV" = "development" ]; then
  npm install
  npx prisma generate
  npx prisma migrate deploy
# fi

exec "$@"