<?php

include 'services/jwt.service.php';
include 'services/auth.service.php';
include 'connect.php';

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

$jwtService = new JWTService();
$authService = new AuthService($pdo, $jwtService);

// Handle Registration
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register'])) {
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $result = $authService->register($username, $email, $password);

    if ($result === "Registration successful!") {
        http_response_code(201); // Created
        echo json_encode([
            'status' => 201,
            'message' => 'User registered successfully'
        ]);
    } else {
        http_response_code(400); // Bad Request
        echo json_encode([
            'status' => 400,
            'message' => $result
        ]);
    }
    exit();
}

// Handle Login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $usernameOrEmail = $_POST['usernameOrEmail'] ?? '';
    $password = $_POST['password'] ?? '';

    $token = $authService->login($usernameOrEmail, $password);

    if ($token) {
        http_response_code(200); // OK
        echo json_encode([
            'status' => 200,
            'message' => 'Login successful',
            'token' => $token // Return JWT token
        ]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode([
            'status' => 401,
            'message' => 'Invalid username or password'
        ]);
    }
    exit();
}

// Invalid Request
http_response_code(405); // Method Not Allowed
echo json_encode([
    'status' => 405,
    'message' => 'Invalid request'
]);
exit();
