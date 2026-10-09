"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function EmptyProjectsPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <p className="text-sm text-copy-muted">{label}</p>
      <p className="text-xs text-copy-faint">Projects you create will appear here.</p>
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  className,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed top-12 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-surface-border bg-surface/95 backdrop-blur-sm transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
        className
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

      <Tabs defaultValue="my-projects" className="flex min-h-0 flex-1 flex-col gap-0">
        <div className="shrink-0 px-3 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <TabsContent value="my-projects" className="m-0 flex min-h-full flex-col">
            <EmptyProjectsPlaceholder label="No projects yet" />
          </TabsContent>
          <TabsContent value="shared" className="m-0 flex min-h-full flex-col">
            <EmptyProjectsPlaceholder label="No shared projects" />
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <div className="shrink-0 border-t border-surface-border p-3">
        <Button type="button" className="w-full" size="default">
          <Plus className="h-4 w-4" data-icon="inline-start" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
