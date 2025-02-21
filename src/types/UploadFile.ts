export interface UploadFile {
  id: number;
  filename: string;
  uuid: string;
  size: number;
  mime_type: string;
  workspace_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUploadFileDto {
  filename: string;
  uuid: string;
  size: number;
  mime_type: string;
  workspace_id: number;
}