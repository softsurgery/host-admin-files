<?php

require_once "./utils/headers.php";

require_once './services/upload.service.php';
require_once './services/file.service.php';
require_once './models/file.model.php';
require_once 'connect.php';

$fileService = new FileService($pdo);
$uploadService = new UploadService();


// Check if files are uploaded
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files'])) {
    $uploadedFiles = $_FILES['files'];
    $uploadResults = [];

    $filesArray = [];

    if (is_array($uploadedFiles['name'])) {
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
        $filesArray[] = $uploadedFiles;
    }

    foreach ($filesArray as $file) {
        $uploadResult = $uploadService->uploadFile($file);
        if ($uploadResult) {
            $newFile = new File();
            $newFile->setFilename($uploadResult['name']);
            $newFile->setUuid($uploadResult['uuid']);
            $newFile->setSize($file['size']);
            $newFile->setMimeType($file['type']);
            $newFile->setWorkspaceId(1); // Example workspace_id, adjust accordingly

            $fileId = $fileService->create($newFile);

            $uploadResults[] = [
                'status' => 200,
                'message' => "File uploaded and saved successfully",
                'uuid' => $uploadResult['uuid'],
                'name' => $uploadResult['name'],
                'file_id' => $fileId
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