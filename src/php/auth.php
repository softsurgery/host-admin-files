<?php
include 'services/auth.service.php';
include 'connect.php';

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$authService = new AuthService($pdo);

// Handle Registration
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register'])) {
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $result = $authService->register($username, $email, $password);
    
    if ($result === true) {
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
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($authService->login($username, $password)) {
        http_response_code(200); // OK
        echo json_encode([
            'status' => 200,
            'message' => 'Login successful'
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

// Handle Logout
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['logout'])) {
    $authService->logout();
    
    http_response_code(200); // OK
    echo json_encode([
        'status' => 200,
        'message' => 'Logged out successfully'
    ]);
    exit();
}

// Invalid Request
http_response_code(405); // Method Not Allowed
echo json_encode([
    'status' => 405,
    'message' => 'Invalid request'
]);
exit();
