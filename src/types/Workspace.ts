export interface Workspace {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceUser {
  id: number;
  workspace_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}