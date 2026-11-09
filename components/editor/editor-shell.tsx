"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { AiSidebar } from "@/components/editor/ai-sidebar";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectSummary } from "@/types/project";

interface EditorShellProps {
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
  activeRoomId?: string;
  projectName?: string;
}

export function EditorShell({
  ownedProjects,
  sharedProjects,
  activeRoomId,
  projectName,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const actions = useProjectActions(activeRoomId ?? null);
  const isWorkspace = Boolean(activeRoomId && projectName);

  return (
    <div className="relative flex h-dvh min-h-0 flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        projectName={projectName}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={
          isWorkspace ? () => setIsAiSidebarOpen((open) => !open) : undefined
        }
        onShare={isWorkspace ? () => undefined : undefined}
      />

      <div className="relative min-h-0 flex-1">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeRoomId={activeRoomId}
          onNewProject={actions.openCreate}
          onRename={actions.openRename}
          onDelete={actions.openDelete}
        />

        <main className="flex h-full w-full items-center justify-center bg-base px-4">
          {isWorkspace ? (
            <p className="text-sm text-copy-muted">
              Canvas workspace — design surface coming soon
            </p>
          ) : (
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
              <Button type="button" onClick={actions.openCreate}>
                <Plus className="h-4 w-4" data-icon="inline-start" />
                New Project
              </Button>
            </div>
          )}
        </main>

        {isWorkspace ? (
          <AiSidebar
            isOpen={isAiSidebarOpen}
            onClose={() => setIsAiSidebarOpen(false)}
          />
        ) : null}
      </div>

      <ProjectDialogs {...actions} />
    </div>
  );
}
