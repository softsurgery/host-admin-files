<?php

class File
{
    private $id;
    private $filename;
    private $uuid;
    private $size;
    private $mimeType;
    private $workspaceId;
    private $createdAt;
    private $updatedAt;

    public function __construct($filename = '', $uuid = '', $size = 0, $mimeType = '', $workspaceId = 0)
    {
        $this->filename = $filename;
        $this->uuid = $uuid;
        $this->size = $size;
        $this->mimeType = $mimeType;
        $this->workspaceId = $workspaceId;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getFilename()
    {
        return $this->filename;
    }

    public function getUuid()
    {
        return $this->uuid;
    }

    public function getSize()
    {
        return $this->size;
    }

    public function getMimeType()
    {
        return $this->mimeType;
    }

    public function getWorkspaceId()
    {
        return $this->workspaceId;
    }

    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function setFilename($filename)
    {
        $this->filename = $filename;
    }

    public function setUuid($uuid)
    {
        $this->uuid = $uuid;
    }

    public function setSize($size)
    {
        $this->size = $size;
    }

    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;
    }

    public function setWorkspaceId($workspaceId)
    {
        $this->workspaceId = $workspaceId;
    }
}
