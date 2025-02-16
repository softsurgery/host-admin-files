<?php

class JWTService
{
    private string $secretKey;
    private string $algorithm;

    public function __construct()
    {
        $this->secretKey = '{{JWT_SECRET_KEY}}'; 
        $this->algorithm = 'HS256';
    }

    /**
     * Base64 URL Encode
     *
     * @param string $data
     * @return string
     */
    private function base64UrlEncode(string $data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    /**
     * Base64 URL Decode
     *
     * @param string $data
     * @return string
     */
    private function base64UrlDecode(string $data): string
    {
        $urlSafeData = str_replace(['-', '_'], ['+', '/'], $data);
        return base64_decode($urlSafeData);
    }

    /**
     * Generate JWT Token
     *
     * @param array $payload
     * @return string
     */
    public function generateToken(array $payload): string
    {
        $header = $this->base64UrlEncode(json_encode(['alg' => $this->algorithm, 'typ' => 'JWT']));
        $payload = $this->base64UrlEncode(json_encode($payload));
        $signature = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $this->secretKey, true));

        return "$header.$payload.$signature";
    }

    /**
     * Validate JWT Token
     *
     * @param string $token
     * @return array|false
     */
    public function validateToken(string $token)
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return false;
        }

        [$header, $payload, $signature] = $parts;

        $validSignature = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $this->secretKey, true));

        if ($signature !== $validSignature) {
            return false;
        }

        $decodedPayload = json_decode($this->base64UrlDecode($payload), true);

        // Check token expiration if set
        if (isset($decodedPayload['exp']) && time() >= $decodedPayload['exp']) {
            return false;
        }

        return $decodedPayload;
    }
}
