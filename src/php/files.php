<?php

require_once "./utils/headers.php";

require_once './services/file.service.php';

$fileService = new FileService();

// Check if files are uploaded
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files'])) {
    $uploadedFiles = $_FILES['files'];
    $uploadResults = [];

    // Normalize $_FILES array for both single and multiple files
    $filesArray = [];

    if (is_array($uploadedFiles['name'])) {
        // Multiple files
        foreach ($uploadedFiles['name'] as $index => $name) {
            $filesArray[] = [
                'name' => $name,
                'type' => $uploadedFiles['type'][$index],
                'tmp_name' => $uploadedFiles['tmp_name'][$index],
                'error' => $uploadedFiles['error'][$index],
                'size' => $uploadedFiles['size'][$index]
            ];
        }
    } else {
        // Single file (not an array)
        $filesArray[] = $uploadedFiles;
    }

    // Loop through normalized files array and upload each file
    foreach ($filesArray as $file) {
        $uploadResult = $fileService->uploadFile($file);
        if ($uploadResult) {
            $uploadResults[] = [
                'status' => 200,
                'message' => "File uploaded successfully",
                'file' => $uploadResult
            ];
        } else {
            $uploadResults[] = [
                'status' => 400,
                'message' => "File upload failed",
                'file' => $file['name']
            ];
        }
    }

    http_response_code(200);
    echo json_encode([
        'status' => 200,
        'results' => $uploadResults
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        'status' => 400,
        'message' => "Method not allowed or no files uploaded."
    ]);
}
