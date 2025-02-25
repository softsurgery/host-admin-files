<?php

class AuthController
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $username = $data['username'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($username) || empty($email) || empty($password)) {
            jsonResponse(400, "All fields are required.");
        }

        $result = $this->authService->register($username, $email, $password);

        if ($result === "Registration successful!") {
            jsonResponse(201, "User registered successfully.");
        } else {
            jsonResponse(400, $result);
        }
    }

    public function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $usernameOrEmail = $data['usernameOrEmail'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($usernameOrEmail) || empty($password)) {
            jsonResponse(400, "Username/Email and password are required.");
        }

        $token = $this->authService->login($usernameOrEmail, $password);

        if ($token) {
            jsonResponse(200, "Login successful.", ['token' => $token]);
        } else {
            jsonResponse(401, "Invalid username or password.");
        }
    }
}
