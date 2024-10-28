#!/bin/bash
set -e

# Remove um arquivo de servidor antigo, se existir
rm -f /app/tmp/pids/server.pid

# Executa migrations
bundle exec rails db:create db:migrate

# Inicia o servidor
exec "$@"
