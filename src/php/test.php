<?php
header('Content-Type: application/json');

$data = [
    "status" => "success",
    "message" => "This is a simple JSON response",
    "data" => [
        "id" => 1,
        "name" => "John Doe",
        "email" => "johndoe@example.com"
    ]
];

echo json_encode($data);
