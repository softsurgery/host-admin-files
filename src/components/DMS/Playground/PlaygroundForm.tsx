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

interface PlaygroundFormProps {
  className?: string;
}

export const PlaygroundForm = ({ className }: PlaygroundFormProps) => {
  const playgroundStore = usePlaygroundStore();

  const { workspaces, isWorkspacesPending } = useWorkspaces();
  const { apiKeys, isAPIKeysPending } = useAPIKeys({
    filter: `filter=workspace_id,eq,${playgroundStore.workspaceId}`,
    join: "join=workspaces",
  });
  const { files, isFilesPending } = useFiles({
    filter: `filter=workspace_id,eq,${playgroundStore.workspaceId}`,
  });


  const handleApiKeyValueChange = (e: string) => {
    const apiKeyId = parseInt(e);
    const apiKeyObj = apiKeys.find((k) => k.id === apiKeyId);
    playgroundStore.set("apiKeyId", apiKeyId);
    playgroundStore.set("uuid","");
    playgroundStore.set("fileExtension","");
    playgroundStore.set("apiKey", apiKeyObj?.key);
    playgroundStore.set("fileId", undefined);
  };

  const handleFileValueChange = (e: string) => {
    const fileId = parseInt(e);
    const fileObj = files.find((f) => f.id === fileId);
    playgroundStore.set("fileId", parseInt(e));
    playgroundStore.set("fileExtension", fileObj?.filename?.split(".")[1] || "");
    playgroundStore.set("filename", fileObj?.filename);
    playgroundStore.set("uuid", fileObj?.uuid || "");
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Workspace */}
      <div>
        <Label>Workspace</Label>
        {!isWorkspacesPending ? (
          <Select
            name="workspace"
            key={playgroundStore?.workspaceId?.toString() || "workspace"}
            onValueChange={(e) => {
              playgroundStore.set("workspaceId", parseInt(e));
              playgroundStore.set("uuid","");
              playgroundStore.set("fileExtension","");
              playgroundStore.set("apiKeyId", undefined);
              playgroundStore.set("fileId", undefined);
            }}
            value={playgroundStore?.workspaceId?.toString() || undefined}
            disabled={workspaces?.length === 0}
          >
            <SelectTrigger className="mt-2">
              <SelectValue
                placeholder={
                  workspaces?.length != 0
                    ? "Please select a workspace"
                    : "No Workspaces Available"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {workspaces?.map((w) => (
                <SelectItem key={w.id} value={w?.id?.toString() || ""}>
                  {w?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Skeleton className="h-10 mt-2" />
        )}
      </div>
      {/* API Key */}
      <div>
        <Label>API Key</Label>
        {!isAPIKeysPending ? (
          <Select
            name="api-key"
            key={playgroundStore?.apiKeyId?.toString() || "api-key"}
            onValueChange={handleApiKeyValueChange}
            value={playgroundStore?.apiKeyId?.toString() || undefined}
            disabled={!playgroundStore.workspaceId || apiKeys?.length == 0}
          >
            <SelectTrigger className="mt-2">
              <SelectValue
                placeholder={
                  apiKeys?.length != 0
                    ? "Please select an API Key"
                    : "No API Keys Available"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {apiKeys?.map((k) => (
                <SelectItem key={k.id} value={k?.id?.toString() || ""}>
                  {k?.key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Skeleton className="h-10 mt-2" />
        )}
      </div>
      {/* File */}
      <div>
        <Label>File</Label>
        {!isFilesPending ? (
          <Select
            name="file"
            key={playgroundStore?.fileId?.toString() || "file"}
            onValueChange={handleFileValueChange}
            value={playgroundStore?.fileId?.toString() || undefined}
            disabled={!playgroundStore.apiKeyId || files?.length == 0}
          >
            <SelectTrigger className="mt-2">
              <SelectValue
                placeholder={
                  files?.length != 0
                    ? "Please select a file"
                    : "No files available"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {files?.map((f) => (
                <SelectItem key={f.id} value={f?.id?.toString() || ""}>
                  {f?.filename}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Skeleton className="h-10 mt-2" />
        )}
      </div>
    </div>
  );
};
