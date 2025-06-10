#!/bin/bash

# Exit on error
set -e

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ] && [ -z "$SUPABASE_DB_URL" ]; then
  echo "Error: DATABASE_URL or SUPABASE_DB_URL environment variable is not set"
  echo "Please set one of these variables with your Supabase database connection string"
  echo "Example: postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres"
  exit 1
fi

# Use DATABASE_URL if set, otherwise use SUPABASE_DB_URL
DB_URL=${DATABASE_URL:-$SUPABASE_DB_URL}

# Directory containing migration files
MIGRATIONS_DIR="./supabase/migrations"

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "Error: Migrations directory not found at $MIGRATIONS_DIR"
  exit 1
fi

# Get list of migration files in order
MIGRATION_FILES=(
  "20240609000000_core_roles_permissions.sql"
  "20240609000001_booking_system.sql"
  "20240609000002_media_and_content.sql"
  "20240609000003_settings_reviews_notifications.sql"
)

# Apply each migration
for MIGRATION_FILE in "${MIGRATION_FILES[@]}"; do
  MIGRATION_PATH="$MIGRATIONS_DIR/$MIGRATION_FILE"
  
  # Check if migration file exists
  if [ ! -f "$MIGRATION_PATH" ]; then
    echo "Error: Migration file not found: $MIGRATION_PATH"
    exit 1
  fi
  
  echo "\nApplying migration: $MIGRATION_FILE"
  
  # Execute the migration using psql
  psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$MIGRATION_PATH"
  
  # Check if the command was successful
  if [ $? -eq 0 ]; then
    echo "✅ Successfully applied: $MIGRATION_FILE"
  else
    echo "❌ Failed to apply: $MIGRATION_FILE"
    exit 1
  fi
done

echo "\n✅ All migrations applied successfully!"
