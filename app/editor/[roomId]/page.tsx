import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorShell } from "@/components/editor/editor-shell";
import {
  getAccessibleProject,
  getCurrentIdentity,
} from "@/lib/project-access";
import { getEditorProjects } from "@/lib/projects";

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const { roomId } = await params;
  const project = await getAccessibleProject(
    roomId,
    identity.userId,
    identity.email,
  );

  if (!project) {
    return <AccessDenied />;
  }

  const { ownedProjects, sharedProjects } = await getEditorProjects();

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      activeRoomId={roomId}
      projectName={project.name}
    />
  );
}
