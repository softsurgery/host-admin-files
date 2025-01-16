<?php

function getDatabaseConnection()
{
    $host = '{{DB_HOST}}';
    $dbname = '{{DB_NAME}}';
    $username = '{{DB_USER}}';
    $password = '{{DB_PASSWORD}}';
    $charset = '{{DB_CHARSET}}';

    $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

    try {
        // Create a PDO instance
        return new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch associative arrays by default
            PDO::ATTR_EMULATE_PREPARES => false, // Disable emulation of prepared statements
        ]);
    } catch (PDOException $e) {
        die("Database connection failed: " . $e->getMessage());
    }
}

?>
