<?php

$authHeader = $_SERVER['HTTP_X_AUTHORIZATION'] ?? '';
if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
    http_response_code(401);
    echo json_encode([
        'status' => '401',
        'message' => 'Missing or invalid Authorization header'
    ]);
    exit();
}
$jwt = substr($authHeader, 7);
$tokenValidation = $jwtService->validateToken($jwt);
if (!$tokenValidation) {
    http_response_code(401);
    echo json_encode([
        'status' => '401',
        'message' => 'Invalid or expired token'
    ]);
    exit();
}