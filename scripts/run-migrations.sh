#!/bin/bash

# Exit on error
set -e

# Set database connection details
DB_HOST="db.ixlfstwdmbgzpapomcci.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="NyikaTZ2077$"  # Your database password

# Directory containing migration files
MIGRATIONS_DIR="./supabase/migrations"

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "Error: Migrations directory not found at $MIGRATIONS_DIR"
  exit 1
fi

# List of migration files in order
MIGRATION_FILES=(
  "20240609000000_core_roles_permissions.sql"
  "20240609000001_booking_system.sql"
  "20240609000002_media_and_content.sql"
  "20240609000003_settings_reviews_notifications.sql"
)

# Export PGPASSWORD for psql commands
export PGPASSWORD="$DB_PASSWORD"

# Apply each migration
for MIGRATION_FILE in "${MIGRATION_FILES[@]}"; do
  MIGRATION_PATH="$MIGRATIONS_DIR/$MIGRATION_FILE"
  
  # Check if migration file exists
  if [ ! -f "$MIGRATION_PATH" ]; then
    echo "Error: Migration file not found: $MIGRATION_PATH"
    exit 1
  fi
  
  echo "\n🔧 Applying migration: $MIGRATION_FILE"
  
  # Execute the migration using psql
  psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -v ON_ERROR_STOP=1 \
    -f "$MIGRATION_PATH"
  
  # Check if the command was successful
  if [ $? -eq 0 ]; then
    echo "✅ Successfully applied: $MIGRATION_FILE"
  else
    echo "❌ Failed to apply: $MIGRATION_FILE"
    exit 1
  fi
done

echo "\n✨ All migrations applied successfully!"
