<?php

require './autoload.php';

class FileController
{
    private $fileService;
    private $uploadService;

    public function __construct($fileService, $uploadService)
    {
        $this->fileService = $fileService;
        $this->uploadService = $uploadService;
    }

    public function downloadFile($uuid, $ext)
    {
        try {
            $filePath = $this->uploadService->downloadFile($uuid, $ext);

            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
            header('Content-Length: ' . filesize($filePath));
            if ($filePath !== null) {
                readfile($filePath);
                exit;
            }
        } catch (Exception $e) {
            $this->respondWithError(500, $e->getMessage());
        }
    }

    public function uploadFiles($files, $workspaceId)
    {
        if (!$workspaceId) {
            $this->respondWithError(400, "Workspace ID is required.");
            return;
        }

        $filesArray = is_array($files['name']) ? $this->reformatFilesArray($files) : [$files];
        $uploadResults = [];

        foreach ($filesArray as $file) {
            $uploadResult = $this->uploadService->uploadFile($file);
            if ($uploadResult) {
                $newFile = new File();
                $newFile->setFilename($uploadResult['name']);
                $newFile->setUuid($uploadResult['uuid']);
                $newFile->setSize($file['size']);
                $newFile->setMimeType($file['type']);
                $newFile->setWorkspaceId($workspaceId);

                $fileId = $this->fileService->create($newFile);

                $uploadResults[] = [
                    'status' => 200,
                    'message' => "File uploaded and saved successfully",
                    'uuid' => $uploadResult['uuid'],
                    'name' => $uploadResult['name'],
                    'file_id' => $fileId,
                    'workspace_id' => $workspaceId
                ];
            } else {
                $uploadResults[] = [
                    'status' => 400,
                    'message' => "File upload failed",
                    'file' => $file['name']
                ];
            }
        }

        jsonResponse(200, "", $uploadResults);
    }

    public function deleteFile($uuid)
    {
        $file = $this->fileService->findByUUID($uuid);
        if (!$file) {
            $this->respondWithError(404, "File not found.");
            return;
        }

        $filePath = $this->uploadService->downloadFile($file['uuid'], pathinfo($file['filename'], PATHINFO_EXTENSION));

        if ($filePath === null || !file_exists($filePath)) {
            $this->fileService->deleteByUUID($uuid);
            jsonResponse(200, "File not found, but database record removed.", ['uuid' => $uuid]);
            return;
        }

        if ($this->uploadService->deleteFile($filePath)) {
            $this->fileService->deleteByUUID($uuid);
            jsonResponse(200, "File deleted successfully.", ['uuid' => $uuid]);
        } else {
            $this->respondWithError(400, "Failed to delete the file.");
        }
    }

    private function reformatFilesArray($uploadedFiles)
    {
        $filesArray = [];
        foreach ($uploadedFiles['name'] as $index => $name) {
            $filesArray[] = [
                'name' => $name,
                'type' => $uploadedFiles['type'][$index],
                'tmp_name' => $uploadedFiles['tmp_name'][$index],
                'error' => $uploadedFiles['error'][$index],
                'size' => $uploadedFiles['size'][$index]
            ];
        }
        return $filesArray;
    }

    private function respondWithError($status, $message)
    {
        jsonResponse($status, $message);
    }
}
