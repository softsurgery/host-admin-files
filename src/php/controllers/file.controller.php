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

    // Download file without workspace ID check
    public function download($uuid, $ext)
    {
        $file = $this->fileService->findByUUID($uuid);

        if (!$file) {
            $this->respondWithError(404, "File not found.");
            return;
        }

        try {
            $filePath = $this->uploadService->downloadFile($uuid, $ext);
            if ($filePath !== null && file_exists($filePath)) {
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
                header('Content-Length: ' . filesize($filePath));
                readfile($filePath);
                exit;
            }
        } catch (Exception $e) {
            $this->respondWithError(500, $e->getMessage());
        }
    }

    // Download file with workspace ID check
    public function downloadWithWorkspaceCheck($uuid, $ext, $workspaceId)
    {
        $file = $this->fileService->findByUUID($uuid);

        if (!$file) {
            $this->respondWithError(404, "File not found.");
            return;
        }

        if ($file['workspace_id'] !== $workspaceId) {
            $this->respondWithError(403, "Access forbidden: File does not belong to the workspace.");
            return;
        }

        try {
            $filePath = $this->uploadService->downloadFile($uuid, $ext);
            if ($filePath !== null && file_exists($filePath)) {
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
                header('Content-Length: ' . filesize($filePath));
                readfile($filePath);
                exit;
            }
        } catch (Exception $e) {
            $this->respondWithError(500, $e->getMessage());
        }
    }

    // Upload files without workspace ID check
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

    // Delete file without workspace ID check
    public function delete($uuid)
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

    // Delete file with workspace ID check
    public function deleteWithWorkspaceCheck($uuid, $workspaceId)
    {
        $file = $this->fileService->findByUUID($uuid);
        if (!$file) {
            $this->respondWithError(404, "File not found.");
            return;
        }

        if ($file['workspace_id'] !== $workspaceId) {
            $this->respondWithError(403, "Access forbidden: File does not belong to the workspace.");
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

    // Reformat uploaded files array
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

    // Respond with error in JSON format
    private function respondWithError($status, $message)
    {
        jsonResponse($status, $message);
    }
}
