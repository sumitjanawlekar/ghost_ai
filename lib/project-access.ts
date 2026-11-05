import { prisma } from "@/lib/prisma";

export async function requireProjectOwner(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return { error: "not_found" as const };
  }

  if (project.ownerId !== userId) {
    return { error: "forbidden" as const };
  }

  return { project };
}
