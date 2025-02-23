import os
import sys
import shutil
import subprocess

def load_env(env_file):
    """Load environment variables from a file."""
    if not os.path.isfile(env_file):
        print(f"❌ Error: Environment file '{env_file}' not found!")
        sys.exit(1)  # Stop execution if .env file is missing

    print(f"✅ Loading environment variables from {env_file}...")
    with open(env_file) as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, value = line.strip().split("=", 1)
                os.environ[key] = value

def replace_placeholders(src_file, dest_file):
    """Replace placeholders in a file with environment variables."""
    if not os.path.isfile(src_file):
        print(f"⚠️ Skipping: {src_file} not found.")
        return

    print(f"🔄 Processing {src_file} -> {dest_file}")

    with open(src_file, "r") as f:
        content = f.read()

    placeholders = [
        "DB_HOST", "DB_NAME", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_CHARSET",
        "HTACCESS_ORIGIN", "VITE_APP_URL", "JWT_SECRET_KEY"
    ]
    for key in placeholders:
        content = content.replace(f"{{{{{key}}}}}", os.getenv(key, f"{{{key}}}"))  # Keep placeholder if no value

    with open(dest_file, "w") as f:
        f.write(content)

def copy_php_files(src, dest):
    """Copy PHP files and directories from src to dest."""
    if not os.path.exists(src):
        print(f"⚠️ PHP source folder '{src}' does not exist. Skipping copy.")
        return

    os.makedirs(dest, exist_ok=True)

    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dest, item)

        if os.path.isdir(s):
            print(f"📂 Copying directory {s} -> {d}...")
            shutil.copytree(s, d, dirs_exist_ok=True)
        else:
            print(f"📄 Copying file {s} -> {d}...")
            shutil.copy(s, d)

def grant_permissions(directory):
    """Ensure directory exists before granting permissions."""
    if not os.path.exists(directory):
        print(f"📁 Creating missing directory: {directory}")
        os.makedirs(directory, exist_ok=True)

    print(f"🔑 Granting permissions to {directory}...")
    os.chmod(directory, 0o775)
    print(f"✅ Permissions granted: {directory}")

def main():
    # Check for environment argument
    if len(sys.argv) < 2:
        print("❌ Usage: python build.py [environment]")
        print("Example: python build.py prod")
        sys.exit(1)

    env = sys.argv[1]
    env_file = f".env.{env}"

    # Step 1: Load environment variables
    load_env(env_file)

    # Step 2: Define paths
    php_src = "src/php"
    dist_dir = "dist/php"
    dist_api = os.path.join(dist_dir, "api.php")
    dist_connect = os.path.join(dist_dir, "connect.php")
    dist_jwt_service = os.path.join(dist_dir, "services/jwt.service.php")
    dist_headers = os.path.join(dist_dir, "utils/headers.php")
    htaccess_src = "src/.htaccess"
    htaccess_dest = "dist/.htaccess"
    uploads_dir = "dist/uploads"  # Uploads directory

    # Step 3: Ensure `uploads` directory exists and has correct permissions
    grant_permissions(uploads_dir)

    # Step 4: Build React Vite project
    try:
        print("⚙️ Building the React Vite project...")
        subprocess.run(["yarn", "build"], check=True)
        print("✅ React Vite build completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: React build failed with code {e.returncode}.")
        sys.exit(1)

    # Step 5: Copy PHP files
    copy_php_files(php_src, dist_dir)

    # Step 6: Copy .htaccess file if it exists
    if os.path.isfile(htaccess_src):
        print(f"📄 Copying .htaccess file to '{htaccess_dest}'...")
        os.makedirs("dist", exist_ok=True)
        shutil.copy(htaccess_src, htaccess_dest)
    else:
        print(f"⚠️ Source .htaccess file '{htaccess_src}' does not exist. Skipping copy.")

    # Step 7: Replace placeholders in critical files
    critical_files = [dist_api, dist_connect, dist_jwt_service, dist_headers, htaccess_dest]

    for file in critical_files:
        if not os.path.isfile(file):
            print(f"⚠️ Warning: Expected file '{file}' not found! This may cause issues.")
        else:
            replace_placeholders(file, file)

    print("🎉 Build process complete!")

if __name__ == "__main__":
    main()
