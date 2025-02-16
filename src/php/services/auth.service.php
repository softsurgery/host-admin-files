<?php


class AuthService
{
    private $pdo;
    private $jwtService;

    public function __construct($pdo, $jwtService)
    {
        $this->pdo = $pdo;
        $this->jwtService = $jwtService;
    }

    /**
     * Register a new user
     *
     * @param string $username
     * @param string $email
     * @param string $password
     * @return string
     */
    public function register($username, $email, $password)
    {
        // Check if username or email already exists
        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE username = :username OR email = :email");
        $stmt->execute(['username' => $username, 'email' => $email]);
        if ($stmt->fetch()) {
            return "Username or Email already taken!";
        }

        // Hash the password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user
        $stmt = $this->pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password)");
        $stmt->execute([
            'username' => $username,
            'email' => $email,
            'password' => $passwordHash
        ]);

        return "Registration successful!";
    }

    /**
     * Login a user and generate JWT token
     *
     * @param string $usernameOrEmail
     * @param string $password
     * @return string|false
     */
    public function login($usernameOrEmail, $password)
    {
        // Retrieve user by username or email
        $stmt = $this->pdo->prepare("SELECT id, username, email, password_hash FROM users WHERE username = :usernameOrEmail OR email = :usernameOrEmail");
        $stmt->execute(['usernameOrEmail' => $usernameOrEmail]);
        $user = $stmt->fetch();

        // Verify password
        if ($user && password_verify($password, $user['password_hash'])) {
            // Generate JWT token
            $payload = [
                'user_id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'exp' => time() + 3600 // Token expires in 1 hour
            ];
            return $this->jwtService->generateToken($payload);
        }

        return false;
    }
}
