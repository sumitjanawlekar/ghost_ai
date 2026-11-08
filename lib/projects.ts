import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import type { ProjectSummary } from "@/types/project";

export interface EditorProjects {
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
}

export async function getEditorProjects(): Promise<EditorProjects> {
  const user = await currentUser();

  if (!user) {
    return { ownedProjects: [], sharedProjects: [] };
  }

  const emails = (user.emailAddresses ?? [])
    .filter((address) => address.verification?.status === "verified")
    .map((address) => address.emailAddress.trim())
    .filter((email) => email.length > 0);

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
    emails.length === 0
      ? Promise.resolve([])
      : prisma.project.findMany({
          where: {
            ownerId: { not: user.id },
            OR: emails.map((email) => ({
              collaborators: {
                some: {
                  email: { equals: email, mode: "insensitive" as const },
                },
              },
            })),
          },
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true },
        }),
  ]);

  return { ownedProjects, sharedProjects };
}
