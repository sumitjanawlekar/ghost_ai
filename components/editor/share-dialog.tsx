"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Trash2, UserRound, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  CollaboratorSummary,
  CollaboratorsResponse,
} from "@/types/collaborator";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  projectName: string;
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error.length > 0) {
      return body.error;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function CollaboratorAvatar({
  name,
  email,
  imageUrl,
}: {
  name: string | null;
  email: string;
  imageUrl: string | null;
}) {
  const label = name ?? email;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subtle text-copy-muted"
      aria-hidden="true"
    >
      {label.trim() ? (
        <span className="text-xs font-medium uppercase">
          {label.trim().charAt(0)}
        </span>
      ) : (
        <UserRound className="h-4 w-4" />
      )}
    </div>
  );
}

export function ShareDialog({
  open,
  onOpenChange,
  roomId,
  projectName,
}: ShareDialogProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorSummary[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setEmail("");
      setCopied(false);

      try {
        const response = await fetch(`/api/projects/${roomId}/collaborators`);
        if (!response.ok) {
          if (!cancelled) {
            setError(
              await readErrorMessage(response, "Could not load collaborators."),
            );
            setCollaborators([]);
            setIsOwner(false);
          }
          return;
        }

        const data = (await response.json()) as CollaboratorsResponse;
        if (!cancelled) {
          setIsOwner(Boolean(data.isOwner));
          setCollaborators(Array.isArray(data.collaborators) ? data.collaborators : []);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load collaborators.");
          setCollaborators([]);
          setIsOwner(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [open, roomId]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const projectLink =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/editor/${roomId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectLink);
      setCopied(true);
    } catch {
      setError("Could not copy the project link.");
    }
  };

  const invite = async () => {
    if (!isOwner || inviting) return;

    const nextEmail = email.trim();
    if (!nextEmail) {
      setError("Enter an email address.");
      return;
    }

    setInviting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${roomId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail }),
      });

      if (!response.ok) {
        setError(await readErrorMessage(response, "Could not invite collaborator."));
        return;
      }

      const collaborator = (await response.json()) as CollaboratorSummary;
      setCollaborators((current) => [...current, collaborator]);
      setEmail("");
    } catch {
      setError("Could not invite collaborator.");
    } finally {
      setInviting(false);
    }
  };

  const remove = async (collaborator: CollaboratorSummary) => {
    if (!isOwner || removingEmail) return;

    setRemovingEmail(collaborator.email);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${roomId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: collaborator.email }),
      });

      if (!response.ok) {
        setError(
          await readErrorMessage(response, "Could not remove collaborator."),
        );
        return;
      }

      setCollaborators((current) =>
        current.filter((item) => item.id !== collaborator.id),
      );
    } catch {
      setError("Could not remove collaborator.");
    } finally {
      setRemovingEmail(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? `Invite people to collaborate on “${projectName}”.`
              : `People with access to “${projectName}”.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {isOwner ? (
            <>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={projectLink}
                  aria-label="Project link"
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyLink}
                  aria-label={copied ? "Copied" : "Copy project link"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" data-icon="inline-start" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" data-icon="inline-start" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Invite by email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void invite();
                    }
                  }}
                  disabled={inviting}
                />
                <Button
                  type="button"
                  onClick={() => void invite()}
                  disabled={!email.trim() || inviting}
                >
                  {inviting ? "Inviting…" : "Invite"}
                </Button>
              </div>
            </>
          ) : null}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-copy-muted">
              <Users className="h-3.5 w-3.5" />
              <span>Collaborators</span>
            </div>

            <ScrollArea className="max-h-56">
              {loading ? (
                <p className="px-1 py-6 text-center text-sm text-copy-muted">
                  Loading…
                </p>
              ) : collaborators.length === 0 ? (
                <p className="px-1 py-6 text-center text-sm text-copy-muted">
                  No collaborators yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-1 pr-2">
                  {collaborators.map((collaborator) => (
                    <li
                      key={collaborator.id}
                      className="flex items-center gap-3 rounded-xl px-2 py-2"
                    >
                      <CollaboratorAvatar
                        name={collaborator.name}
                        email={collaborator.email}
                        imageUrl={collaborator.imageUrl}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-copy-primary">
                          {collaborator.name ?? collaborator.email}
                        </p>
                        {collaborator.name ? (
                          <p className="truncate text-xs text-copy-muted">
                            {collaborator.email}
                          </p>
                        ) : null}
                      </div>
                      {isOwner ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => void remove(collaborator)}
                          disabled={removingEmail === collaborator.email}
                          aria-label={`Remove ${collaborator.email}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </div>

          {error ? <p className="text-xs text-state-error">{error}</p> : null}

          {!isOwner && !loading ? (
            <p className="text-xs text-copy-muted">
              Only the project owner can invite or remove collaborators.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
