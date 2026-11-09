import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface ClerkIdentity {
  userId: string;
  email: string | null;
}

export async function getCurrentIdentity(): Promise<ClerkIdentity | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const primary =
    user.emailAddresses.find(
      (address) => address.id === user.primaryEmailAddressId,
    ) ?? user.emailAddresses[0];

  const email = primary?.emailAddress.trim() || null;

  return {
    userId: user.id,
    email,
  };
}

export async function getAccessibleProject(
  projectId: string,
  userId: string,
  email: string | null,
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      collaborators: email
        ? {
            where: {
              email: { equals: email, mode: "insensitive" as const },
            },
            select: { id: true },
            take: 1,
          }
        : false,
    },
  });

  if (!project) {
    return null;
  }

  const isOwner = project.ownerId === userId;
  const isCollaborator =
    Array.isArray(project.collaborators) && project.collaborators.length > 0;

  if (!isOwner && !isCollaborator) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
  };
}

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
