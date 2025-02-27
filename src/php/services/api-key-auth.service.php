<?php
class ApiKeyAuth
{
    private $apiKeyService;

    public function __construct($apiKeyService)
    {
        $this->apiKeyService = $apiKeyService;
    }

    public function validateApiKey($key)
    {
        // Fetch the API key data from the database
        $apiKey = $this->apiKeyService->getByKey($key);

        if (!$apiKey) {
            http_response_code(401);
            echo json_encode([
                'status' => '401',
                'message' => 'Invalid API key'
            ]);
            exit();
        }

        return $apiKey;
    }
}
