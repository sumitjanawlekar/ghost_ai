import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EditorShell } from "@/components/editor/editor-shell";
import { getEditorProjects } from "@/lib/projects";

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  await auth.protect();

  const { projectId } = await params;
  const { ownedProjects, sharedProjects } = await getEditorProjects();
  const canOpen = [...ownedProjects, ...sharedProjects].some(
    (project) => project.id === projectId,
  );

  if (!canOpen) {
    redirect("/editor");
  }

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      activeProjectId={projectId}
    />
  );
}
