import os
import sys
import shutil
import subprocess

def load_env(env_file):
    """Load environment variables from a file."""
    if not os.path.isfile(env_file):
        print(f"Error: Environment file '{env_file}' not found!")
        sys.exit(1)

    print(f"Loading environment variables from {env_file}...")
    with open(env_file) as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, value = line.strip().split("=", 1)
                os.environ[key] = value

def replace_placeholders(src_file, dest_file):
    """Replace placeholders in a file with environment variables."""
    if not os.path.isfile(src_file):
        print(f"Skipping: {src_file} not found.")
        return

    print(f"Processing {src_file} -> {dest_file}")

    with open(src_file, "r") as f:
        content = f.read()

    # Replace placeholders with actual environment values
    placeholders = [
        "DB_HOST", "DB_NAME", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_CHARSET",
        "HTACCESS_ORIGIN", "VITE_APP_URL", 'JWT_SECRET_KEY'
    ]
    for key in placeholders:
        content = content.replace(f"{{{{{key}}}}}", os.getenv(key, f"{{{key}}}"))  # Default to keeping placeholder

    with open(dest_file, "w") as f:
        f.write(content)

def copy_php_files(src, dest):
    """Copy PHP files and directories from src to dest."""
    if not os.path.exists(src):
        print(f"PHP source folder '{src}' does not exist. Skipping copy.")
        return

    os.makedirs(dest, exist_ok=True)
    
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dest, item)
        
        if os.path.isdir(s):
            # If it's a directory, use copytree
            print(f"Copying directory {s} -> {d}...")
            shutil.copytree(s, d, dirs_exist_ok=True)  # Preserve structure
        else:
            # If it's a file, use copy
            print(f"Copying file {s} -> {d}...")
            shutil.copy(s, d)

def grant_permissions(directory):
    """Grant read/write/execute permissions to the specified directory."""
    print(f"Granting permissions to directory {directory}...")
    if os.path.exists(directory):
        os.chmod(directory, 0o775)
        print(f"Permissions granted: {directory}")
    else:
        print(f"Directory {directory} does not exist. Skipping permission update.")

def main():
    # Check for environment argument
    if len(sys.argv) < 2:
        print("Usage: python build.py [environment]")
        print("Example: python build.py prod")
        sys.exit(1)

    env = sys.argv[1]
    env_file = f".env.{env}"

    # Load environment variables
    load_env(env_file)

    # Define source and destination paths
    php_src = "src/php"
    dist_dir = "dist/php"
    dist_api = os.path.join(dist_dir, "api.php")
    dist_connect = os.path.join(dist_dir, "connect.php")
    dist_jwt_service = os.path.join(dist_dir, "services/jwt.service.php")
    dist_headers = os.path.join(dist_dir, "utils/headers.php")
    htaccess_src = "src/.htaccess"
    htaccess_dest = "dist/.htaccess"
    uploads_dir = "dist/uploads"  # Add this for uploads directory

    # Step 1: Grant permissions to the uploads directory (avoid permission issues during build)
    grant_permissions(uploads_dir)

    # Step 2: Build React Vite project (make sure the `uploads` folder is not affected)
    print("Building the React Vite project...")
    subprocess.run(["yarn", "build"], check=True)

    # Step 3: Copy PHP files (Handles both files and directories)
    copy_php_files(php_src, dist_dir)

    # Step 4: Copy .htaccess file
    if os.path.isfile(htaccess_src):
        print(f"Copying .htaccess file to '{htaccess_dest}'...")
        os.makedirs("dist", exist_ok=True)
        shutil.copy(htaccess_src, htaccess_dest)
    else:
        print(f"Source .htaccess file '{htaccess_src}' does not exist. Skipping copy.")

    # Step 5: Replace placeholders in copied files
    replace_placeholders(dist_api, dist_api)
    replace_placeholders(dist_connect, dist_connect)
    replace_placeholders(dist_jwt_service, dist_jwt_service)
    replace_placeholders(dist_headers, dist_headers)
    replace_placeholders(htaccess_dest, htaccess_dest)

    print("Build process complete!")

if __name__ == "__main__":
    main()
