import { NextResponse } from "next/server";

import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface CreateProjectBody {
  name?: unknown;
  description?: unknown;
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

  let body: CreateProjectBody = {};
  try {
    body = (await request.json()) as CreateProjectBody;
  } catch {
    body = {};
  }

  const name =
    typeof body.name === "string" && body.name.trim().length > 0
      ? body.name.trim()
      : "Untitled Project";

  const description =
    typeof body.description === "string" ? body.description : undefined;

  const project = await prisma.project.create({
    data: {
      ownerId: authResult.userId,
      name,
      description,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
