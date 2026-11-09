import { Lock } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccessDenied() {
  return (
    <div className="flex h-dvh min-h-0 flex-col items-center justify-center gap-4 bg-base px-4 text-center">
      <Lock className="h-8 w-8 text-copy-muted" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium text-copy-primary">Access denied</h1>
        <p className="text-sm text-copy-muted">
          This project doesn&apos;t exist or you don&apos;t have permission to open
          it.
        </p>
      </div>
      <Link href="/editor" className={cn(buttonVariants())}>
        Back to editor
      </Link>
    </div>
  );
}
