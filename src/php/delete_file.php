<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (file_exists("./uploads/" . $_POST['action'])) {
        unlink("./uploads/" . $_POST['action']);
        $response = array(
            'status' => $_POST['action'],
            'message' => "Thank you for submitting the form!"
        );

        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
