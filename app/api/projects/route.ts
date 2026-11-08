import { NextResponse } from "next/server";

import { Prisma } from "@/app/generated/prisma/client";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isRoomId } from "@/lib/room-id";

interface CreateProjectBody {
  name?: unknown;
  description?: unknown;
  id?: unknown;
}

export async function GET() {
  const authResult = await requireUserId();
  if ("response" in authResult) {
    return authResult.response;
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: authResult.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const authResult = await requireUserId();
  if ("response" in authResult) {
    return authResult.response;
  }

  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const body: CreateProjectBody = parsed === null ? {} : (parsed as CreateProjectBody);

  const name =
    typeof body.name === "string" && body.name.trim().length > 0
      ? body.name.trim()
      : "Untitled Project";

  const description =
    typeof body.description === "string" ? body.description : undefined;

  let id: string | undefined;
  if (body.id !== undefined) {
    if (typeof body.id !== "string" || !isRoomId(body.id.trim())) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }
    id = body.id.trim();
  }

  try {
    const project = await prisma.project.create({
      data: {
        ...(id ? { id } : {}),
        ownerId: authResult.userId,
        name,
        description,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Room ID already exists" }, { status: 409 });
    }

    throw error;
  }
}
