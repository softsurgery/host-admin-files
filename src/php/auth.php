<?php
include 'services/auth.service.php';
include 'connect.php';

header('Content-Type: application/json');

$authService = new AuthService($pdo);

// Handle Registration
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register'])) {
    $data = json_decode(file_get_contents("php://input"), true);

    $username = $data['username'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $result = $authService->register($username, $email, $password);
    
    if ($result === true) {
        echo json_encode([
            'status' => 201,
            'message' => 'User registered successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 400,
            'message' => $result
        ]);
    }
    exit();
}

// Handle Login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if ($authService->login($username, $password)) {
        echo json_encode([
            'status' => 200,
            'message' => 'Login successful'
        ]);
    } else {
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
    
    echo json_encode([
        'status' => 200,
        'message' => 'Logged out successfully'
    ]);
    exit();
}

echo json_encode([
    'status' => 405,
    'message' => 'Invalid request'
]);
exit();
