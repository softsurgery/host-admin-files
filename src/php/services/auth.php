<?php
include 'services/auth.service.php';

header('Content-Type: application/json');

$authService = new AuthService();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($authService->login($username, $password)) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid username or password'
        ]);
    }
    exit();
}

if (isset($_GET['logout'])) {
    $authService->logout();

    echo json_encode([
        'status' => 'success',
        'message' => 'Logged out successfully'
    ]);
    exit();
}
