import type { LucideIcon } from "lucide-react";
import { FileText, Ghost, RefreshCw, Waypoints } from "lucide-react";
import type { ReactNode } from "react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    title: "AI Architecture Generation",
    description:
      "Describe your system in plain English and watch it appear on the canvas.",
    icon: RefreshCw,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Design together with live cursors, presence, and shared editing.",
    icon: Waypoints,
  },
  {
    title: "Instant Spec Generation",
    description:
      "Turn your finished graph into a Markdown technical specification.",
    icon: FileText,
  },
];

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh font-sans text-copy-primary">
      <aside className="hidden w-1/2 flex-col border-r border-surface-border bg-surface lg:flex">
        <div className="flex items-center gap-2.5 px-10 pt-10">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-primary-foreground">
            <Ghost className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight text-copy-primary">
            Ghost AI
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center px-10 py-12">
          <h1 className="max-w-md text-4xl font-semibold tracking-tight text-copy-primary">
            Design systems at the speed of thought.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-copy-muted">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          <ul className="mt-10 max-w-md space-y-6">
            {FEATURES.map(({ title, description, icon: Icon }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-brand">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-copy-primary">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-copy-muted">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="px-10 pb-10 text-xs text-copy-faint">
          © 2026 Ghost AI. All rights reserved.
        </p>
      </aside>

      <main className="flex w-full flex-1 items-center justify-center bg-base px-6 py-10 lg:w-1/2">
        {children}
      </main>
    </div>
  );
}
