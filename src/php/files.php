<?php

require_once "./utils/headers.php";
require_once './services/upload.service.php';
require_once './services/file.service.php';
require_once './models/file.model.php';
require_once 'connect.php';

$fileService = new FileService($pdo);
$uploadService = new UploadService();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files'])) {
    $uploadedFiles = $_FILES['files'];
    $uploadResults = [];

    // Get workspace_id from formData
    $workspaceId = isset($_POST['workspace_id']) ? intval($_POST['workspace_id']) : null;

    if (!$workspaceId) {
        http_response_code(400);
        echo json_encode([
            'status' => 400,
            'message' => "Workspace ID is required."
        ]);
        exit;
    }

    $filesArray = [];

    // Convert uploaded files into an array
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

    // Process each file
    foreach ($filesArray as $file) {
        $uploadResult = $uploadService->uploadFile($file);
        if ($uploadResult) {
            $newFile = new File();
            $newFile->setFilename($uploadResult['name']);
            $newFile->setUuid($uploadResult['uuid']);
            $newFile->setSize($file['size']);
            $newFile->setMimeType($file['type']);
            $newFile->setWorkspaceId($workspaceId);

            $fileId = $fileService->create($newFile);

            $uploadResults[] = [
                'status' => 200,
                'message' => "File uploaded and saved successfully",
                'uuid' => $uploadResult['uuid'],
                'name' => $uploadResult['name'],
                'file_id' => $fileId,
                'workspace_id' => $workspaceId
            ];
        } else {
            $uploadResults[] = [
                'status' => 400,
                'message' => "File upload failed",
                'file' => $file['name']
            ];
        }
    }

    // Return JSON response
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
