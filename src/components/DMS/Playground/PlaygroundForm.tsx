import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAPIKeys from "@/hooks/content/useAPIKeys";
import { usePlaygroundStore } from "@/hooks/stores/usePlaygroundStore";
import useFiles from "@/hooks/content/useFiles";
import { Label } from "@/components/ui/label";
import useWorkspaces from "@/hooks/content/useWorkspaces";
import { Skeleton } from "@/components/ui/skeleton";
import { FILE_GATEWAY_ACTIONS } from "@/constants/file-gateway-actions";

interface PlaygroundFormProps {
  className?: string;
  isPending?: boolean;
}

export const PlaygroundForm = ({
  className,
  isPending,
}: PlaygroundFormProps) => {
  const playgroundStore = usePlaygroundStore();

  // Fetch workspaces
  const { workspaces = [], isWorkspacesPending } = useWorkspaces();

  // Fetch API Keys filtered by the selected workspace
  const { apiKeys = [], isAPIKeysPending } = useAPIKeys({
    filter: `filter=workspace_id,eq,${playgroundStore.workspaceId}`,
    join: "join=workspaces",
  });

  // Fetch files filtered by the selected workspace
  const { files = [], isFilesPending } = useFiles({
    filter: `filter=workspace_id,eq,${playgroundStore.workspaceId}`,
  });

  /** Handles action selection */
  const handleActionChange = (value: string) => {
    playgroundStore.set("actionId", parseInt(value));
    console.log(playgroundStore.actionId);
    playgroundStore.resetByLevel(1);
  };

  /** Handles workspace selection */
  const handleWorkspaceChange = (value: string) => {
    playgroundStore.set("workspaceId", parseInt(value));
    playgroundStore.resetByLevel(2);
  };

  /** Handles API Key selection */
  const handleApiKeyValueChange = (value: string) => {
    const apiKeyId = parseInt(value);
    const apiKeyObj = apiKeys.find((key) => key.id === apiKeyId);

    playgroundStore.set("apiKeyId", apiKeyId);
    playgroundStore.set("apiKey", apiKeyObj?.key || "");
    playgroundStore.resetByLevel(3);
  };

  /** Handles file selection */
  const handleFileValueChange = (value: string) => {
    const fileId = parseInt(value);
    const fileObj = files.find((file) => file.id === fileId);

    playgroundStore.set("fileId", fileId);
    playgroundStore.set(
      "fileExtension",
      fileObj?.filename?.split(".").pop() || ""
    );
    playgroundStore.set("uuid", fileObj?.uuid);
    playgroundStore.set("filename", fileObj?.filename);
    playgroundStore.resetByLevel(4);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Action Selector */}
      <div>
        <Label>Action</Label>
        <Select
          name="action"
          key={playgroundStore.actionId?.toString() || "action"}
          onValueChange={handleActionChange}
          value={playgroundStore.actionId?.toString()}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Please select an action" />
          </SelectTrigger>
          <SelectContent>
            {FILE_GATEWAY_ACTIONS.map((action) => (
              <SelectItem key={action.id} value={action.id.toString()}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="font-thin text-sm m-1">
          Allows the user to select an action from a predefined list of file
          gateway actions
        </p>
      </div>

      {/* Workspace Selector */}
      <div>
        <Label>Workspace</Label>
        {isWorkspacesPending ? (
          <Skeleton className="h-10 mt-2" />
        ) : (
          <Select
            name="workspace"
            key={playgroundStore.workspaceId?.toString() || "workspace"}
            onValueChange={handleWorkspaceChange}
            value={playgroundStore.workspaceId?.toString()}
            disabled={
              !playgroundStore.actionId || workspaces.length === 0 || isPending
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue
                placeholder={
                  workspaces.length
                    ? "Please select a workspace"
                    : "No Workspaces Available"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id.toString()}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <p className="font-thin text-sm m-1">
          Allows the user to choose a workspace from available workspaces
        </p>
      </div>

      {/* API Key Selector */}
      <div>
        <Label>API Key</Label>
        {isAPIKeysPending ? (
          <Skeleton className="h-10 mt-2" />
        ) : (
          <Select
            name="api-key"
            key={playgroundStore.apiKeyId?.toString() || "api-key"}
            onValueChange={handleApiKeyValueChange}
            value={playgroundStore.apiKeyId?.toString()}
            disabled={
              !playgroundStore.workspaceId || apiKeys.length === 0 || isPending
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue
                placeholder={
                  apiKeys.length
                    ? "Please select an API Key"
                    : "No API Keys Available"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {apiKeys.map((key) => (
                <SelectItem key={key.id} value={key.id.toString()}>
                  {key.key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <p className="font-thin text-sm m-1">
          Allows the user to select an API key associated with the chosen
          workspace.
        </p>
      </div>

      {/* File Selector */}
      <div>
        <Label>File</Label>
        {isFilesPending ? (
          <Skeleton className="h-10 mt-2" />
        ) : (
          <Select
            name="file"
            key={playgroundStore.fileId?.toString() || "file"}
            onValueChange={handleFileValueChange}
            value={playgroundStore.fileId?.toString()}
            disabled={
              !playgroundStore.apiKeyId || files.length === 0 || isPending
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue
                placeholder={
                  files.length ? "Please select a file" : "No files available"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id.toString()}>
                  {file.filename}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <p className="font-thin text-sm m-1">
          Allows the user to select a file associated with the chosen workspace.
        </p>
      </div>
    </div>
  );
};
