<?php

require './autoload.php';
require_once "./utils/headers.php";

$requestMethod = $_SERVER['REQUEST_METHOD'];

if (isset($_SERVER['HTTP_X_API_KEY'])) {
    $apiKey = $_SERVER['HTTP_X_API_KEY'];
} else {
    http_response_code(400);
    echo json_encode([
        'status' => '400',
        'message' => 'API key missing'
    ]);
    exit();
}

$apiKeyData = $apiKeyAuthService->validateApiKey($apiKey);
$workspaceId = $apiKeyData->getWorkspaceId();

if ($requestMethod === 'GET' && isset($_GET['uuid']) && isset($_GET['ext'])) {
    $fileController->downloadWithWorkspaceCheck($_GET['uuid'], $_GET['ext'], $workspaceId);
} elseif ($requestMethod === 'POST' && isset($_FILES['files'])) {
    $fileController->uploadFiles($_FILES['files'], $workspaceId);
} elseif ($requestMethod === 'DELETE' && isset($_GET['uuid'])) {
    $fileController->deleteWithWorkspaceCheck($_GET['uuid'], $workspaceId);
} else {
    http_response_code(400);
    echo json_encode([
        'status' => 400,
        'message' => "Method not allowed or missing parameters."
    ]);
}
