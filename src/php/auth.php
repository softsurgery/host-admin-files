<?php

require_once "./autoload.php";
require_once "./utils/headers.php";

// Get request method
$requestMethod = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['action'] ?? '';

// Route requests
if ($requestMethod === 'POST' && $endpoint === 'register') {
    $authController->register();
} elseif ($requestMethod === 'POST' && $endpoint === 'login') {
    $authController->login();
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 405,
        'message' => 'Invalid request'
    ]);
    exit();
}
