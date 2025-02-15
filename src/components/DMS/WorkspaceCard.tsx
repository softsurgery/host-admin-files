import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Workspace } from "@/types/Workspace";

interface WorkspaceCardProps {
  className?: string;
  workspace?: Workspace;
}

export const WorkspaceCard = ({ className, workspace }: WorkspaceCardProps) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{workspace?.name}</CardTitle>
        <CardDescription>{workspace?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Workspace</p>
      </CardContent>
      <CardFooter>
        <p>Workspace</p>
      </CardFooter>
    </Card>
  );
};
