"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function AiSidebar({ isOpen, onClose, className }: AiSidebarProps) {
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
        aria-label="AI chat"
        className={cn(
          "fixed top-12 right-0 bottom-0 z-40 flex w-80 flex-col border-l border-surface-border bg-surface/95 backdrop-blur-sm transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none",
          className,
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-surface-border px-3">
          <h2 className="text-sm font-medium text-copy-primary">AI</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close AI sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 text-center">
          <p className="text-sm text-copy-muted">AI chat coming soon</p>
        </div>
      </aside>
    </>
  );
}
