<?php

require './autoload.php';
require $BASE_URL . '/utils/headers.php';


// Function to validate API key
function validateApiKey() {
    global $apiKeyService;

    $authHeader = $_SERVER['HTTP_X_AUTHORIZATION'] ?? '';
    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        jsonResponse(401, "Missing or invalid Authorization header.");
    }

    $apiKey = $matches[1];
    $apiKeyObj = $apiKeyService->getByKey($apiKey);
    
    if (!$apiKeyObj) {
        jsonResponse(403, "Invalid API Key.");
    }

    return $apiKeyObj->getWorkspaceId();
}

// Handle GET request (Download file)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['uuid']) && isset($_GET['ext'])) {
    try {
        $workspaceId = validateApiKey();
        $fileUuid = $_GET['uuid'];

        // Retrieve file details
        $file = $fileService->findByUUID($fileUuid);
        if (!$file) {
            jsonResponse(404, "File not found.");
        }

        // Ensure the file belongs to the workspace
        if ($file['workspace_id'] !== $workspaceId) {
            jsonResponse(403, "Access denied. File does not belong to your workspace.");
        }

        $filePath = $uploadService->downloadFile($fileUuid, $_GET['ext']);
        if (!file_exists($filePath)) {
            jsonResponse(404, "File does not exist on server.");
        }

        // Serve the file
        header("Content-Type: application/octet-stream");
        header("Content-Disposition: attachment; filename=\"" . basename($filePath) . "\"");
        header("Content-Length: " . filesize($filePath));
        readfile($filePath);
        exit;
    } catch (Exception $e) {
        jsonResponse(500, "Server error: " . $e->getMessage());
    }
}

// Handle POST request (Upload file)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files'])) {
    $workspaceId = validateApiKey();
    $uploadedFiles = $_FILES['files'];
    $filesArray = [];
    $uploadResults = [];

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
            $newFile->setWorkspaceId($workspaceId);

            $fileId = $fileService->create($newFile);

            $uploadResults[] = [
                'uuid' => $uploadResult['uuid'],
                'name' => $uploadResult['name'],
                'file_id' => $fileId,
                'workspace_id' => $workspaceId
            ];
        } else {
            jsonResponse(400, "File upload failed.", ["file" => $file['name']]);
        }
    }

    jsonResponse(200, "Files uploaded successfully.", ["results" => $uploadResults]);
}

// Handle DELETE request (Delete file)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['uuid'])) {
    $workspaceId = validateApiKey();
    $fileUuid = $_GET['uuid'];

    $file = $fileService->findByUUID($fileUuid);
    if (!$file) {
        jsonResponse(404, "File not found.");
    }

    if ($file['workspace_id'] !== $workspaceId) {
        jsonResponse(403, "Access denied. File does not belong to your workspace.");
    }

    $filePath = $uploadService->downloadFile($fileUuid, pathinfo($file['filename'], PATHINFO_EXTENSION));

    if ($uploadService->deleteFile($filePath)) {
        $fileService->deleteByUUID($fileUuid);
        jsonResponse(200, "File deleted successfully.", ["uuid" => $fileUuid]);
    } else {
        jsonResponse(400, "Failed to delete the file.");
    }
}

// If the request method is invalid
jsonResponse(400, "Method not allowed or invalid parameters.");
