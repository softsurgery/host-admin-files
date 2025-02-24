
<?php

$BASE_URL = __DIR__;

//connect
require_once $BASE_URL . "/connect.php";

//models
require_once $BASE_URL . "/models/file.model.php";

//services
require_once $BASE_URL . "/services/jwt.service.php";
$jwtService = new JWTService();

require_once $BASE_URL . "/services/auth.service.php";
$authService = new AuthService($pdo, $jwtService);

require_once $BASE_URL . "/services/file.service.php";
$fileService = new FileService($pdo);

require_once $BASE_URL . "/services/upload.service.php";
$uploadService = new UploadService();


