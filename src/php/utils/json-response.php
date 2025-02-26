<?php

function jsonResponse(int $status, string $message, array $data = [])
{
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode(array_merge(['status' => $status, 'message' => $message], $data));
    exit();
}
