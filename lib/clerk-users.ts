import { clerkClient } from "@clerk/nextjs/server";

export interface ClerkEmailProfile {
  name: string | null;
  imageUrl: string | null;
}

export async function getClerkProfilesByEmails(
  emails: string[],
): Promise<Map<string, ClerkEmailProfile>> {
  const uniqueEmails = [
    ...new Set(
      emails
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 0),
    ),
  ];

  const profiles = new Map<string, ClerkEmailProfile>();

  if (uniqueEmails.length === 0) {
    return profiles;
  }

  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList({
      emailAddress: uniqueEmails,
      limit: Math.min(uniqueEmails.length, 100),
    });

    for (const user of data) {
      const profile: ClerkEmailProfile = {
        name: user.fullName?.trim() || user.username?.trim() || null,
        imageUrl: user.imageUrl || null,
      };

      for (const address of user.emailAddresses ?? []) {
        const key = address.emailAddress.trim().toLowerCase();
        if (uniqueEmails.includes(key)) {
          profiles.set(key, profile);
        }
      }
    }
  } catch (error) {
    console.error("Failed to look up Clerk user profiles by email:", error);
  }

  return profiles;
}
