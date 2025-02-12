<?php

session_start();

$users = [
    'admin' => 'password123',
    'user' => 'userpass'
];

class AuthService
{
    public function login($username, $password)
    {
        global $users;
        if (isset($users[$username]) && $users[$username] === $password) {
            $_SESSION['user'] = $username;
            return true;
        }
        return false;
    }

    public function is_logged_in()
    {
        return isset($_SESSION['user']);
    }

    public function logout()
    {
        session_unset();
        session_destroy();
    }

}
