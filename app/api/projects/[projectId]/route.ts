import { NextResponse } from "next/server";

import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-access";

interface RenameProjectBody {
  name?: unknown;
}

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const authResult = await requireUserId();
  if ("response" in authResult) {
    return authResult.response;
  }

  const { projectId } = await params;
  const access = await requireProjectOwner(projectId, authResult.userId);

  if ("error" in access) {
    if (access.error === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: RenameProjectBody;
  try {
    body = (await request.json()) as RenameProjectBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 },
    );
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name: body.name.trim() },
  });

  return NextResponse.json(project);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authResult = await requireUserId();
  if ("response" in authResult) {
    return authResult.response;
  }

  const { projectId } = await params;
  const access = await requireProjectOwner(projectId, authResult.userId);

  if ("error" in access) {
    if (access.error === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return NextResponse.json({ success: true });
}
