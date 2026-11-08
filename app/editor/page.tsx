import { auth } from "@clerk/nextjs/server";

import { EditorShell } from "@/components/editor/editor-shell";
import { getEditorProjects } from "@/lib/projects";

export default async function EditorPage() {
  await auth.protect();

  const { ownedProjects, sharedProjects } = await getEditorProjects();

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  );
}
