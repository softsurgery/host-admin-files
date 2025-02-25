import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useWorkspaces from "@/hooks/content/useWorkspaces";
import { useAPIKeyStore } from "@/hooks/stores/useAPIKeyStore";
import { generateApiKey } from "@/lib/key.utils";
import { cn } from "@/lib/utils";
import React from "react";

interface APIKeyFormProps {
  className?: string;
}

export const APIKeyForm = ({ className }: APIKeyFormProps) => {
  const apiKeyStore = useAPIKeyStore();
  const { workspaces, isWorkspacesPending } = useWorkspaces();
  const keyPlaceholder = React.useMemo(() => {
    return `Ex. ${generateApiKey()}`;
  },[]);
  if (isWorkspacesPending) return <Spinner className="w-full h-full" />;
  return (
    <div className={cn("flex flex-col gap-4 px-1", className)}>
      {/* Name */}
      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          className={cn("mt-1", apiKeyStore?.errors?.name && "border-red-500")}
          placeholder="Ex. X API Key"
          value={apiKeyStore?.name}
          onChange={(e) => {
            apiKeyStore.set("name", e.target.value);
            apiKeyStore.set("errors", {
              ...apiKeyStore.errors,
              name: undefined,
            });
          }}
        />
        {apiKeyStore?.errors?.name && (
          <span className="text-xs font-bold text-red-500 m-1">
            {apiKeyStore?.errors?.name?.[0]}
          </span>
        )}
        <p className="text-xs font-thin mt-2">
          A unique name to identify this API key. This helps distinguish it from
          other keys in your workspace.
        </p>
      </div>
      {/* Key */}
      <div>
        <Label htmlFor="key" required>
          Key
        </Label>
        <div className="flex flex-row gap-2">
          <Input
            type="text"
            id="key"
            className={cn("mt-1", apiKeyStore?.errors?.key && "border-red-500")}
            placeholder={keyPlaceholder}
            name="key"
            value={apiKeyStore?.key}
          />
          <Button
            variant={"outline"}
            onClick={() => {
              apiKeyStore.set("key", generateApiKey());
              apiKeyStore.set("errors", {
                ...apiKeyStore.errors,
                key: undefined,
              });
            }}
          >
            Generate
          </Button>
        </div>
        {apiKeyStore?.errors?.key && (
          <span className="text-xs font-bold text-red-500 m-1">
            {apiKeyStore?.errors?.key?.[0]}
          </span>
        )}
        <p className="text-xs font-thin mt-2">
          The system-generated API key. This key is used to authenticate
          requests and should be kept secure.
        </p>
      </div>
      {/* Workspace */}
      <div>
        <Label htmlFor="workspace" required>
          Workspace
        </Label>
        <Select
          name="workspace"
          key={apiKeyStore?.workspace_id?.toString() || "currencyId"}
          onValueChange={(e) => {
            apiKeyStore.set("workspace_id", parseInt(e));
            apiKeyStore.set("errors", {
              ...apiKeyStore.errors,
              workspace_id: undefined,
            });
          }}
          value={apiKeyStore?.workspace_id?.toString() || undefined}
        >
          <SelectTrigger
            className={cn(
              "mt-2",
              apiKeyStore?.errors?.workspace_id && "border-red-500"
            )}
          >
            <SelectValue placeholder="Please Select a Workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.map((w) => (
              <SelectItem key={w.id} value={w?.id?.toString() || ""}>
                {w?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {apiKeyStore?.errors?.workspace_id && (
          <span className="text-xs font-bold text-red-500 m-1">
            {apiKeyStore?.errors?.workspace_id?.[0]}
          </span>
        )}
        <p className="text-xs font-thin mt-2">
          The workspace to which this API key belongs. API keys are scoped to a
          specific workspace for better access control.
        </p>
      </div>
    </div>
  );
};
