"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/types/project";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
  activeProjectId?: string;
  onNewProject: () => void;
  onRename: (project: ProjectSummary) => void;
  onDelete: (project: ProjectSummary) => void;
  className?: string;
}

function EmptyProjectsPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <p className="text-sm text-copy-muted">{label}</p>
      <p className="text-xs text-copy-faint">
        Projects you create will appear here.
      </p>
    </div>
  );
}

interface ProjectItemProps {
  project: ProjectSummary;
  isActive: boolean;
  onRename?: (project: ProjectSummary) => void;
  onDelete?: (project: ProjectSummary) => void;
}

function ProjectItem({ project, isActive, onRename, onDelete }: ProjectItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-subtle",
        isActive && "bg-subtle",
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        aria-current={isActive ? "page" : undefined}
        className="min-w-0 flex-1 truncate text-sm text-copy-secondary group-hover:text-copy-primary"
      >
        {project.name}
      </Link>
      {onRename && onDelete ? (
        <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onRename(project)}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onNewProject,
  onRename,
  onDelete,
  className,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-30 bg-base/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        aria-hidden={!isOpen}
        className={cn(
          "fixed top-12 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-surface-border bg-surface/95 backdrop-blur-sm transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
          className,
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-surface-border px-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close projects sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <div className="shrink-0 px-3 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <TabsContent
              value="my-projects"
              className="m-0 flex min-h-full flex-col"
            >
              {ownedProjects.length === 0 ? (
                <EmptyProjectsPlaceholder label="No projects yet" />
              ) : (
                <ul className="flex flex-col gap-0.5 p-2">
                  {ownedProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectItem
                        project={project}
                        isActive={project.id === activeProjectId}
                        onRename={onRename}
                        onDelete={onDelete}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
            <TabsContent
              value="shared"
              className="m-0 flex min-h-full flex-col"
            >
              {sharedProjects.length === 0 ? (
                <EmptyProjectsPlaceholder label="No shared projects" />
              ) : (
                <ul className="flex flex-col gap-0.5 p-2">
                  {sharedProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectItem
                        project={project}
                        isActive={project.id === activeProjectId}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="shrink-0 border-t border-surface-border p-3">
          <Button
            type="button"
            className="w-full"
            size="default"
            onClick={onNewProject}
          >
            <Plus className="h-4 w-4" data-icon="inline-start" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
