"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { buildRoomId, createRoomSuffix } from "@/lib/room-id";
import type { ProjectSummary } from "@/types/project";

export type DialogType = "create" | "rename" | "delete" | null;

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

export function useProjectActions(activeProjectId: string | null = null) {
  const router = useRouter();
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [targetProject, setTargetProject] = useState<ProjectSummary | null>(null);
  const [name, setName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomId = dialogType === "create" ? buildRoomId(name, suffix) : "";

  const openCreate = () => {
    setName("");
    setSuffix(createRoomSuffix());
    setTargetProject(null);
    setError(null);
    setDialogType("create");
  };

  const openRename = (project: ProjectSummary) => {
    setName(project.name);
    setTargetProject(project);
    setError(null);
    setDialogType("rename");
  };

  const openDelete = (project: ProjectSummary) => {
    setTargetProject(project);
    setError(null);
    setDialogType("delete");
  };

  const close = () => {
    if (loading) return;
    setDialogType(null);
    setTargetProject(null);
    setName("");
    setSuffix("");
    setError(null);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setError(null);
  };

  const submit = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      if (dialogType === "create") {
        const id = buildRoomId(name, suffix);
        if (!id) {
          setError("Enter a project name.");
          return;
        }

        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), id }),
        });

        if (!response.ok) {
          setError(await readErrorMessage(response, "Could not create the project."));
          return;
        }

        const project = (await response.json()) as { id?: unknown };
        if (typeof project.id !== "string" || project.id.length === 0) {
          setError("Could not create the project.");
          return;
        }

        setDialogType(null);
        router.push(`/editor/${project.id}`);
        return;
      }

      if (dialogType === "rename" && targetProject) {
        const nextName = name.trim();
        if (!nextName) {
          setError("Enter a project name.");
          return;
        }

        const response = await fetch(`/api/projects/${targetProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nextName }),
        });

        if (!response.ok) {
          setError(await readErrorMessage(response, "Could not rename the project."));
          return;
        }

        setDialogType(null);
        router.refresh();
        return;
      }

      if (dialogType === "delete" && targetProject) {
        const response = await fetch(`/api/projects/${targetProject.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          setError(await readErrorMessage(response, "Could not delete the project."));
          return;
        }

        const deletedId = targetProject.id;
        setDialogType(null);

        if (activeProjectId && activeProjectId === deletedId) {
          router.replace("/editor");
          return;
        }

        router.refresh();
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    dialogType,
    targetProject,
    name,
    roomId,
    loading,
    error,
    openCreate,
    openRename,
    openDelete,
    close,
    handleNameChange,
    submit,
  };
}
