#!/bin/bash

# Usage: ./deploy.sh <directory_to_upload> [environment]
# Example: ./deploy.sh ./build prod

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <directory_to_upload> [environment]"
    exit 1
fi

DIRECTORY=$1
ENV=${2:-dev}  # Default to 'dev' if no environment is provided

# Determine the environment file
ENV_FILE=".env.$ENV"

# Check if the environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file '$ENV_FILE' not found."
    exit 1
fi

yarn php-build $ENV

# Load environment variables from the selected .env file
export $(grep -v '^#' "$ENV_FILE" | xargs)

# Validate required variables
if [ -z "$FTP_SERVER" ] || [ -z "$FTP_USERNAME" ] || [ -z "$FTP_PASSWORD" ] || [ -z "$REMOTE_DIR" ]; then
    echo "Error: Missing required environment variables in '$ENV_FILE'."
    exit 1
fi

# If FTP_PORT is not set, default to port 21
FTP_PORT=${FTP_PORT:-21}

# Check if the directory exists
if [ ! -d "$DIRECTORY" ]; then
    echo "Error: Directory '$DIRECTORY' does not exist."
    exit 1
fi

# Upload the directory to the FTP server using lftp
echo "Uploading $DIRECTORY to $FTP_SERVER:$REMOTE_DIR..."

lftp -e "
set ssl:verify-certificate no;
open -u $FTP_USERNAME,$FTP_PASSWORD ftp://$FTP_SERVER:$FTP_PORT;
mirror -R $DIRECTORY $REMOTE_DIR;
bye
" || {
    echo "Error: Failed to upload $DIRECTORY to $FTP_SERVER."
    exit 1
}

echo "Upload completed successfully."
exit 0
