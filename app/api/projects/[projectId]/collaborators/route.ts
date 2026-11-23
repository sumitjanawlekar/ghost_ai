import { NextResponse } from "next/server";

import { Prisma } from "@/app/generated/prisma/client";
import { getClerkProfilesByEmails } from "@/lib/clerk-users";
import { prisma } from "@/lib/prisma";
import {
  getCurrentIdentity,
  requireProjectMember,
  requireProjectOwner,
} from "@/lib/project-access";
import type { CollaboratorsResponse } from "@/types/collaborator";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

interface CollaboratorBody {
  email?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function parseEmail(body: CollaboratorBody | null): string | null {
  if (body === null || typeof body.email !== "string") {
    return null;
  }

  const email = normalizeEmail(body.email);
  if (!EMAIL_PATTERN.test(email)) {
    return null;
  }

  return email;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await requireProjectMember(
    projectId,
    identity.userId,
    identity.email,
  );

  if ("error" in access) {
    if (access.error === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true },
  });

  const profiles = await getClerkProfilesByEmails(rows.map((row) => row.email));

  const response: CollaboratorsResponse = {
    isOwner: access.isOwner,
    collaborators: rows.map((row) => {
      const profile = profiles.get(normalizeEmail(row.email));
      return {
        id: row.id,
        email: row.email,
        name: profile?.name ?? null,
        imageUrl: profile?.imageUrl ?? null,
      };
    }),
  };

  return NextResponse.json(response);
}

export async function POST(request: Request, { params }: RouteParams) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await requireProjectOwner(projectId, identity.userId);

  if ("error" in access) {
    if (access.error === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = parseEmail(parsed as CollaboratorBody | null);
  if (!email) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  if (identity.email && normalizeEmail(identity.email) === email) {
    return NextResponse.json(
      { error: "You already have access to this project" },
      { status: 400 },
    );
  }

  try {
    const collaborator = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email,
      },
      select: { id: true, email: true },
    });

    const profiles = await getClerkProfilesByEmails([collaborator.email]);
    const profile = profiles.get(normalizeEmail(collaborator.email));

    return NextResponse.json(
      {
        id: collaborator.id,
        email: collaborator.email,
        name: profile?.name ?? null,
        imageUrl: profile?.imageUrl ?? null,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "That email already has access" },
        { status: 409 },
      );
    }

    throw error;
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await requireProjectOwner(projectId, identity.userId);

  if ("error" in access) {
    if (access.error === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = parseEmail(parsed as CollaboratorBody | null);
  if (!email) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const result = await prisma.projectCollaborator.deleteMany({
    where: {
      projectId,
      email: { equals: email, mode: "insensitive" },
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
