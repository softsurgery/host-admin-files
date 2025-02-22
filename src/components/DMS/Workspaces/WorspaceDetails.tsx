import ContentSection from "@/components/common/ContentSection";
import { Spinner } from "@/components/common/Spinner";
import Files from "@/components/Files/Files";
import useWorkspace from "@/hooks/content/useWorkspace";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

interface WorspaceDetailsProps {
  className?: string;
}

export const WorspaceDetails = ({ className }: WorspaceDetailsProps) => {
  const { id } = useParams();
  const { workspace, isWorkspacePending } = useWorkspace(Number(id));
  if (isWorkspacePending) return <Spinner className="w-full h-full" />;
  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <ContentSection
        title={`${workspace?.name}'s Workspace`}
        desc={workspace?.description || ""}
        className="flex-row"
      />
      <Files className="mt-4 p-2" workspaceId={id} />
    </div>
  );
};
