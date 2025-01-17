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

# Step 1: Build the React Vite project
echo "Building the React Vite project..."
yarn build

# Define source and destination paths
PHP_SRC="src/php"
DIST_DIR="dist/php"
DIST_FILE="$DIST_DIR/api.php"

# Step 2: Copy PHP files to the dist directory
if [ -d "$PHP_SRC" ]; then
  echo "Copying PHP files from '$PHP_SRC' to '$DIST_DIR'..."
  mkdir -p "$DIST_DIR"
  cp -r "$PHP_SRC/"* "$DIST_DIR/"
else
  echo "PHP source folder '$PHP_SRC' does not exist. Skipping copy."
fi

# Step 3: Replace placeholders in the copied Database.php file
if [ -f "$DIST_FILE" ]; then
  echo "Replacing environment variables in copied Database.php..."
  sed -i -e "s/{{DB_HOST}}/${DB_HOST}/g" \
         -e "s/{{DB_NAME}}/${DB_NAME}/g" \
         -e "s/{{DB_PORT}}/${DB_PORT}/g" \
         -e "s/{{DB_USER}}/${DB_USER}/g" \
         -e "s/{{DB_PASSWORD}}/${DB_PASSWORD}/g" \
         -e "s/{{DB_CHARSET}}/${DB_CHARSET}/g" \
         "$DIST_FILE"
  echo "Environment variables replaced in $DIST_FILE."
else
  echo "api.php not found in $DIST_DIR. Skipping placeholder replacement."
fi

echo "Build process complete!"
