import { Workspace } from "./Workspace";

export interface ApiKey {
  id: number;
  name: string;
  key: string;
  workspace_id: number;
  workspace: Workspace
  created_at: string;
  updated_at: string;
}
