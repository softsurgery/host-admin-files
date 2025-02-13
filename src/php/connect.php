<?php
$host = '{{DB_HOST}}';
$port = '{{DB_PORT}}';
$dbname = '{{DB_NAME}}';
$username = '{{DB_USER}}';
$password = '{{DB_PASSWORD}}';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
