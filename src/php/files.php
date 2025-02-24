<?php

require './autoload.php';
require $BASE_URL . '/utils/headers.php';
require $BASE_URL . '/utils/disconnect.php';

$fileService = new FileService($pdo);
$uploadService = new UploadService();

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['uuid']) && isset($_GET['ext'])) {
    try {
        $filePath = $uploadService->downloadFile($_GET['uuid'], $_GET['ext']);

        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Content-Length: ' . filesize($filePath));

        readfile($filePath);

        exit;
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files'])) {
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
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['uuid'])) {
    $uuid = $_GET['uuid'];

    $file = $fileService->findByUUID($uuid);
    if (!$file) {
        echo json_encode([
            'status' => 404,
            'message' => "File not found."
        ]);
        exit;
    }
    $filePath = $uploadService->downloadFile($file['uuid'], pathinfo($file['filename'], PATHINFO_EXTENSION));

    if ($uploadService->deleteFile($filePath)) {
        $fileService->deleteByUUID($uuid);

        echo json_encode([
            'status' => 200,
            'message' => "File deleted successfully.",
            'uuid' => $uuid
        ]);
    } else {
        echo json_encode([
            'status' => 400,
            'message' => "Failed to delete the file."
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'status' => 400,
        'message' => "Method not allowed or no files uploaded."
    ]);
}
