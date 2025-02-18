<?php

class FileService
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
     * Upload a file
     *
     * @param array $file The uploaded file ($_FILES['file'])
     * @return string|false The file path onlsuccess, false on failure
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

        $fileName = uniqid() . '-' . basename($file['name']);
        $targetPath = $this->uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            return $targetPath;
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
