<?php

class ApiKeyService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function create(ApiKey $apiKey): bool
    {
        $query = "INSERT INTO api_keys (name, `key`, workspace_id) VALUES (:name, :key, :workspace_id)";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute([
            ':name' => $apiKey->getName(),
            ':key' => $apiKey->getKey(),
            ':workspace_id' => $apiKey->getWorkspaceId(),
        ]);
    }

    public function getById(int $id): ?ApiKey
    {
        $query = "SELECT * FROM api_keys WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':id' => $id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new ApiKey($data['name'], $data['key'], $data['workspace_id'], $data['id'], $data['created_at'], $data['updated_at']) : null;
    }

    public function getByKey(string $key): ?ApiKey
    {
        $query = "SELECT * FROM api_keys WHERE `key` = :key";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':key' => $key]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new ApiKey($data['name'], $data['key'], $data['workspace_id'], $data['id'], $data['created_at'], $data['updated_at']) : null;
    }

    public function getAll(): array
    {
        $query = "SELECT * FROM api_keys";
        $stmt = $this->pdo->query($query);
        $apiKeys = [];

        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $apiKeys[] = new ApiKey($data['name'], $data['key'], $data['workspace_id'], $data['id'], $data['created_at'], $data['updated_at']);
        }

        return $apiKeys;
    }

    public function update(ApiKey $apiKey): bool
    {
        $query = "UPDATE api_keys SET name = :name, workspace_id = :workspace_id WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute([
            ':id' => $apiKey->getId(),
            ':name' => $apiKey->getName(),
            ':workspace_id' => $apiKey->getWorkspaceId(),
        ]);
    }

    public function delete(int $id): bool
    {
        $query = "DELETE FROM api_keys WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute([':id' => $id]);
    }
}
