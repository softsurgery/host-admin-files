<?php
class FileService
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function create(File $file)
    {
        $stmt = $this->pdo->prepare("INSERT INTO files (filename, uuid, size, mime_type, workspace_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $file->getFilename(),
            $file->getUuid(),
            $file->getSize(),
            $file->getMimeType(),
            $file->getWorkspaceId()
        ]);
        return $this->pdo->lastInsertId();
    }

    public function find($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM files WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function findByUUID($uuid)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM files WHERE uuid = ?");
        $stmt->execute([$uuid]);
        return $stmt->fetch();
    }

    public function findAll()
    {
        $stmt = $this->pdo->query("SELECT * FROM files");
        return $stmt->fetchAll();
    }

    public function update(File $file)
    {
        $stmt = $this->pdo->prepare("UPDATE files SET filename = ?, uuid = ?, size = ?, mime_type = ?, workspace_id = ? WHERE id = ?");
        $stmt->execute([
            $file->getFilename(),
            $file->getUuid(),
            $file->getSize(),
            $file->getMimeType(),
            $file->getWorkspaceId(),
            $file->getId()
        ]);
    }

    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM files WHERE id = ?");
        $stmt->execute([$id]);
    }

    public function deleteByUUID($uuid)
    {
        $stmt = $this->pdo->prepare("DELETE FROM files WHERE uuid = ?");
        $stmt->execute([$uuid]);
    }
}
