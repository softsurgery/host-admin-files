
<?php

$BASE_URL = __DIR__;

//connect
require_once $BASE_URL . "/connect.php";
require_once $BASE_URL . "/utils/json-response.php";

//models
require_once $BASE_URL . "/models/file.model.php";
require_once $BASE_URL . "/models/api-key.model.php";

//services
require_once $BASE_URL . "/services/jwt.service.php";
$jwtService = new JWTService();

require_once $BASE_URL . "/services/auth.service.php";
$authService = new AuthService($pdo, $jwtService);


require_once $BASE_URL . "/services/file.service.php";
$fileService = new FileService($pdo);

require_once $BASE_URL . "/services/upload.service.php";
$uploadService = new UploadService();

require_once $BASE_URL . "/services/api-key.service.php";
$apiKeyService = new ApiKeyService($pdo);

require_once $BASE_URL . "/services/api-key-auth.service.php";
$apiKeyAuthService = new ApiKeyAuth($apiKeyService);

//controller
require_once $BASE_URL . "/controllers/auth.controller.php";
$authController = new AuthController($authService);

require_once $BASE_URL . "/controllers/file.controller.php";
$fileController = new FileController($fileService, $uploadService);


