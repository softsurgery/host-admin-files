import { cn } from "@/lib/utils";
import { PlaygroundForm } from "./PlaygroundForm";
import { usePlaygroundStore } from "@/hooks/stores/usePlaygroundStore";
import { CodeBlock } from "@/components/ui/code-block";
import React from "react";
import { api } from "@/api";

interface PlaygroundProps {
  className?: string;
}

export const Playground = ({ className }: PlaygroundProps) => {
  const playgroundStore = usePlaygroundStore();

  const canRun = React.useMemo(() => {
    return (
      playgroundStore.workspaceId &&
      playgroundStore.fileId &&
      playgroundStore.apiKeyId
    );
  }, [
    playgroundStore.workspaceId,
    playgroundStore.fileId,
    playgroundStore.apiKeyId,
  ]);

  const furl = React.useMemo(() => {
    return `${window.location.protocol}//${
      window.location.hostname
    }/php/file-gateway.php?uuid=${playgroundStore.uuid || ""}&ext=${
      playgroundStore.fileExtension || ""
    }`;
  }, [playgroundStore.uuid, playgroundStore.fileExtension]);

  return (
    <div className={cn("flex flex-col md:flex-row gap-10", className)}>
      <PlaygroundForm className="md:w-1/2" />
      <div className="md:w-1/2">
        <CodeBlock
          value={furl}
          language="url"
          onRun={
            canRun
              ? () =>
                  api.upload.downloadFileByURL(
                    playgroundStore?.filename || "download",
                    furl,
                    playgroundStore.apiKey
                  )
              : undefined
          }
        />
      </div>
    </div>
  );
};
