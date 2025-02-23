<?php
class UploadService
{
    private $uploadDir;
    private $allowedTypes;
    private $maxSize;

    public function __construct($uploadDir = '../uploads/', $allowedTypes = [], $maxSize = 4294967296)
    {
        $this->uploadDir = rtrim($uploadDir, '/') . '/';
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
        $this->allowedTypes = $allowedTypes;
        $this->maxSize = $maxSize;
    }

    private function generateUUID()
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // version 4
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // variant 10
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public function uploadFile($file)
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return [
                'status' => 400,
                'message' => "File upload error: " . $this->getUploadErrorMessage($file['error']),
                'file' => $file['name']
            ];
        }

        // Remove the file type restriction check
        if ($file['size'] > $this->maxSize) {
            return [
                'status' => 400,
                'message' => "File exceeds max size of " . ($this->maxSize / (1024 * 1024 * 1024)) . "GB",
                'file' => $file['name']
            ];
        }

        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $uuid = $this->generateUUID();
        $fileName = $uuid . '.' . $fileExtension;
        $targetPath = $this->uploadDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            return [
                'status' => 400,
                'message' => "Failed to move uploaded file. Check folder permissions.",
                'file' => $file['name']
            ];
        }

        return [
            'uuid' => $uuid,
            'name' => $file['name']
        ];
    }

    private function getUploadErrorMessage($errorCode)
    {
        $errors = [
            UPLOAD_ERR_INI_SIZE => "The uploaded file exceeds the upload_max_filesize directive in php.ini.",
            UPLOAD_ERR_FORM_SIZE => "The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form.",
            UPLOAD_ERR_PARTIAL => "The uploaded file was only partially uploaded.",
            UPLOAD_ERR_NO_FILE => "No file was uploaded.",
            UPLOAD_ERR_NO_TMP_DIR => "Missing a temporary folder.",
            UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk.",
            UPLOAD_ERR_EXTENSION => "A PHP extension stopped the file upload."
        ];
        return $errors[$errorCode] ?? "Unknown error.";
    }

    public function readFile($filePath)
    {
        if (file_exists($filePath) && is_readable($filePath)) {
            return file_get_contents($filePath);
        }
        return false;
    }

    public function deleteFile($filePath)
    {
        if (file_exists($filePath) && is_writable($filePath)) {
            return unlink($filePath);
        }
        return false;
    }

    public function listFiles()
    {
        $files = glob($this->uploadDir . '*');
        return array_map('basename', $files);
    }

    public function downloadFile($uuid, $extension = null)
    {
        $fileExtension = $extension ?: 'pdf';
        $filePath = $this->uploadDir . $uuid . '.' . $fileExtension;
        if (!file_exists($filePath)) {
            throw new Exception("File not found.");
        }

        return $filePath;
    }
}
