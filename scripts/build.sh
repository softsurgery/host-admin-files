#!/bin/bash

# Exit on error
set -e

# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Usage: ./build.sh [environment]"
  echo "Example: ./build.sh prod"
  exit 1
fi

# Set the environment file based on the argument
ENV_FILE=".env.$1"

# Check if the specified environment file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Environment file '$ENV_FILE' not found!"
  exit 1
fi

# Load environment variables from the file
echo "Loading environment variables from $ENV_FILE..."
set -o allexport
source "$ENV_FILE"
set +o allexport

# Function to safely replace placeholders using awk
replace_placeholders() {
  local src_file="$1"
  local dest_file="$2"
  echo "Processing $src_file -> $dest_file"
  
  awk -v DB_HOST="${DB_HOST}" \
      -v DB_NAME="${DB_NAME}" \
      -v DB_PORT="${DB_PORT}" \
      -v DB_USER="${DB_USER}" \
      -v DB_PASSWORD="${DB_PASSWORD}" \
      -v DB_CHARSET="${DB_CHARSET}" \
      -v HTACCESS_ORIGIN="${HTACCESS_ORIGIN}" '
      {
        gsub(/{{DB_HOST}}/, DB_HOST)
        gsub(/{{DB_NAME}}/, DB_NAME)
        gsub(/{{DB_PORT}}/, DB_PORT)
        gsub(/{{DB_USER}}/, DB_USER)
        gsub(/{{DB_PASSWORD}}/, DB_PASSWORD)
        gsub(/{{DB_CHARSET}}/, DB_CHARSET)
        gsub(/{{HTACCESS_ORIGIN}}/, HTACCESS_ORIGIN)
        print
      }
  ' "$src_file" > "$dest_file"
}

# Step 1: Build the React Vite project
echo "Building the React Vite project..."
yarn build

# Define source and destination paths
PHP_SRC="src/php"
DIST_DIR="dist/php"
DIST_FILE="$DIST_DIR/api.php"
HTACCESS_SRC="src/.htaccess"
HTACCESS_DEST="dist/.htaccess"

# Step 2: Copy PHP files to the dist directory
if [ -d "$PHP_SRC" ]; then
  echo "Copying PHP files from '$PHP_SRC' to '$DIST_DIR'..."
  mkdir -p "$DIST_DIR"
  cp -r "$PHP_SRC/"* "$DIST_DIR/"
else
  echo "PHP source folder '$PHP_SRC' does not exist. Skipping copy."
fi

# Step 3: Copy and validate the .htaccess file
if [ -f "$HTACCESS_SRC" ]; then
  echo "Copying .htaccess file to '$HTACCESS_DEST'..."
  mkdir -p "dist"
  cp "$HTACCESS_SRC" "$HTACCESS_DEST"
else
  echo "Source .htaccess file '$HTACCESS_SRC' does not exist. Skipping copy."
fi

# Step 4: Replace placeholders in the copied files
if [ -f "$DIST_FILE" ]; then
  echo "Replacing environment variables in copied api.php..."
  replace_placeholders "$DIST_FILE" "$DIST_FILE.tmp"
  mv "$DIST_FILE.tmp" "$DIST_FILE"
  echo "Environment variables replaced in $DIST_FILE."
else
  echo "api.php not found in $DIST_DIR. Skipping placeholder replacement."
fi

if [ -f "$HTACCESS_DEST" ]; then
  echo "Replacing environment variables in .htaccess..."
  replace_placeholders "$HTACCESS_DEST" "$HTACCESS_DEST.tmp"
  mv "$HTACCESS_DEST.tmp" "$HTACCESS_DEST"
  echo "Environment variables replaced in $HTACCESS_DEST."
else
  echo "Destination .htaccess file '$HTACCESS_DEST' not found. Skipping placeholder replacement."
fi

echo "Build process complete!"
