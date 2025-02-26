<?php

require './autoload.php';
require $BASE_URL . '/utils/headers.php';
require $BASE_URL . '/utils/disconnect.php';

// Route the request
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'GET' && isset($_GET['uuid']) && isset($_GET['ext'])) {
    $fileController->downloadFile($_GET['uuid'], $_GET['ext']);
} elseif ($requestMethod === 'POST' && isset($_FILES['files'])) {
    $workspaceId = isset($_POST['workspace_id']) ? intval($_POST['workspace_id']) : null;
    $fileController->uploadFiles($_FILES['files'], $workspaceId);
} elseif ($requestMethod === 'DELETE' && isset($_GET['uuid'])) {
    $fileController->deleteFile($_GET['uuid']);
} else {
    http_response_code(400);
    echo json_encode([
        'status' => 400,
        'message' => "Method not allowed or missing parameters."
    ]);
}