"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  const ownedProjects = dialogs.projects.filter((project) => project.owned);
  const sharedProjects = dialogs.projects.filter((project) => !project.owned);

  return (
    <div className="relative flex h-dvh min-h-0 flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <div className="relative min-h-0 flex-1">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onNewProject={dialogs.openCreate}
          onRename={dialogs.openRename}
          onDelete={dialogs.openDelete}
        />

        <main className="flex h-full w-full items-center justify-center bg-base px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-medium text-copy-primary">
                Create a project or open an existing one
              </h1>
              <p className="text-sm text-copy-muted">
                Start a new architecture workspace, or choose a project from the
                sidebar.
              </p>
            </div>
            <Button type="button" onClick={dialogs.openCreate}>
              <Plus className="h-4 w-4" data-icon="inline-start" />
              New Project
            </Button>
          </div>
        </main>
      </div>

      <ProjectDialogs {...dialogs} />
    </div>
  );
}
