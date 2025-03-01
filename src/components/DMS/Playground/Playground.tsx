import { cn } from "@/lib/utils";
import { PlaygroundForm } from "./PlaygroundForm";
import { usePlaygroundStore } from "@/hooks/stores/usePlaygroundStore";
import { CodeBlock } from "@/components/ui/code-block";
import React from "react";
import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
    const baseUrl = `${window.location.protocol}//${
      window.location.hostname
    }/php/file-gateway.php?uuid=${playgroundStore.uuid || ""}`;

    return playgroundStore.actionId === 3
      ? baseUrl
      : `${baseUrl}&ext=${playgroundStore.fileExtension || ""}`;
  }, [
    playgroundStore.uuid,
    playgroundStore.fileExtension,
    playgroundStore.actionId,
  ]);

  const { mutate: downloadFile, isPending: isDownloadPending } = useMutation({
    mutationFn: async () => {
      await api.upload.downloadFileByURL(
        playgroundStore?.filename || "download",
        furl,
        playgroundStore.apiKey
      );
    },
    onSuccess: () => {
      toast.info("File downloaded successfully");
    },
    onError: (error) => {
      toast.error("Failed to download file: " + JSON.stringify(error));
    },
  });

  const { mutate: deleteFile, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      await api.upload.deleteFileByURL(furl, playgroundStore.apiKey);
    },
    onSuccess: () => {
      toast.info("File deleted successfully");
      playgroundStore.reset();
    },
    onError: (error) => {
      toast.error("Failed to delete file: " + JSON.stringify(error));
    },
  });

  const isPending = isDownloadPending || isDeletePending;

  return (
    <div className={cn("flex flex-col md:flex-row gap-10", className)}>
      <PlaygroundForm className="md:w-1/2" isPending={isPending} />
      <div className="md:w-1/2">
        <CodeBlock
          value={furl}
          language="url"
          onRun={
            canRun
              ? playgroundStore.actionId == 1
                ? downloadFile
                : playgroundStore.actionId == 3
                ? deleteFile
                : undefined
              : undefined
          }
        />
      </div>
    </div>
  );
};
