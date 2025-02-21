<?php

class UploadService
{
    private $uploadDir;
    private $allowedTypes;
    private $maxSize;

    public function __construct($uploadDir = '../uploads/', $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'], $maxSize = 2097152)
    {
        $this->uploadDir = rtrim($uploadDir, '/') . '/';
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
        $this->allowedTypes = $allowedTypes;
        $this->maxSize = $maxSize;
    }

    /**
     * Generate a UUID
     *
     * @return string A UUID v4 string
     */
    private function generateUUID()
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // version 4
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // variant 10
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    /**
     * Upload a file
     *
     * @param array $file The uploaded file ($_FILES['file'])
     * @return array|false An array with 'uuid' and 'name' on success, false on failure
     */
    public function uploadFile($file)
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return false;
        }

        if (!in_array($file['type'], $this->allowedTypes)) {
            return false;
        }

        if ($file['size'] > $this->maxSize) {
            return false;
        }

        // Get file extension
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);

        // Generate a UUID for the filename
        $uuid = $this->generateUUID();
        $fileName = $uuid . '.' . $fileExtension;
        $targetPath = $this->uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            // Return both the UUID and the original file name
            return [
                'uuid' => $uuid,
                'name' => $file['name']
            ];
        }

        return false;
    }


    /**
     * Read a file's content
     *
     * @param string $filePath The path to the file
     * @return string|false The file content on success, false on failure
     */
    public function readFile($filePath)
    {
        if (file_exists($filePath) && is_readable($filePath)) {
            return file_get_contents($filePath);
        }
        return false;
    }

    /**
     * Delete a file
     *
     * @param string $filePath The path to the file
     * @return bool True on success, false on failure
     */
    public function deleteFile($filePath)
    {
        if (file_exists($filePath) && is_writable($filePath)) {
            return unlink($filePath);
        }
        return false;
    }

    /**
     * List all files in the upload directory
     *
     * @return array An array of file paths
     */
    public function listFiles()
    {
        $files = glob($this->uploadDir . '*');
        return array_map('basename', $files);
    }
}
