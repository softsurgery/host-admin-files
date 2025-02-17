import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from "@/hooks/stores/useWorkspaceStore";
import { cn } from "@/lib/utils";

interface WorkspaceFormProps {
  className?: string;
}

export const WorkspaceForm = ({ className }: WorkspaceFormProps) => {
  const workspaceStore = useWorkspaceStore();
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div>
        <Label htmlFor="name" required>
          Workspace Name
        </Label>
        <Input
          type="text"
          id="name"
          className={cn(
            "mt-1",
            workspaceStore?.errors?.name && "border-red-500"
          )}
          placeholder="Ex. Marketing Team Workspace"
          name="name"
          value={workspaceStore?.name}
          onChange={(e) => workspaceStore.set("name", e.target.value)}
        />
        {workspaceStore?.errors?.name && (
          <span className="text-xs font-bold text-red-500 m-1">
            {workspaceStore?.errors?.name}
          </span>
        )}
        <p className="text-xs font-thin mt-2">
          Enter a unique name for your workspace. This name will be used to
          identify the workspace in dashboards and navigation menus.
        </p>
      </div>
      <div>
        <Label htmlFor="description">Workspace Description</Label>
        <Textarea
          id="description"
          className={cn(
            "mt-1 resize-none",
            workspaceStore?.errors?.description && "border-red-500"
          )}
          placeholder="Ex. A workspace dedicated to managing marketing campaigns and strategies."
          name="description"
          value={workspaceStore?.description}
          onChange={(e) => workspaceStore.set("description", e.target.value)}
        />
        {workspaceStore?.errors?.description && (
          <span className="text-xs font-bold text-red-500 m-1">
            {workspaceStore?.errors?.description}
          </span>
        )}
        <p className="text-xs font-thin mt-2">
          Provide a brief overview of the workspace's purpose. Include relevant
          details about the team, projects, or goals associated with this
          workspace.
        </p>
      </div>
    </div>
  );
};
