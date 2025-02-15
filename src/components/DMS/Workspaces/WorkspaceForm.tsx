import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from "@/hooks/stores/useWorkspaceStore";
import { cn } from "@/lib/utils";

export const WorkspaceForm = () => {
  const workspaceStore = useWorkspaceStore();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name" required>Name</Label>
        <Input
          type="text"
          id="name"
          className={cn(
            "mt-1",
            workspaceStore?.errors?.name && "border-red-500"
          )}
          placeholder="Ex. Workspace 1"
          name="name"
          value={workspaceStore?.name}
          onChange={(e) => workspaceStore.set("name", e.target.value)}
        />
        <p className="text-sm font-thin mt-1">This is a required field</p>
        {workspaceStore?.errors?.name && (
          <span className="text-xs font-bold text-red-500 m-1">
            {workspaceStore?.errors?.name}
          </span>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          className={cn(
            "mt-1 resize-none",
            workspaceStore?.errors?.description && "border-red-500"
          )}
          placeholder="Ex. Workspace 1 Description"
          name="description"
          value={workspaceStore?.description}
          onChange={(e) => workspaceStore.set("description", e.target.value)}
        />
        <p className="text-sm font-thin mt-1">This is a required field</p>
        {workspaceStore?.errors?.description && (
          <span className="text-xs font-bold text-red-500 m-1">
            {workspaceStore?.errors?.description}
          </span>
        )}
      </div>
    </div>
  );
};
