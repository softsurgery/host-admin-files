<?php

function jsonResponse(int $status, string $message, array $data = [])
{
    http_response_code($status);
    echo json_encode(array_merge(['status' => $status, 'message' => $message], $data));
    exit();
}