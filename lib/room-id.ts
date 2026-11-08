const ROOM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 48;
const MAX_ROOM_ID_LENGTH = 64;

export function slugifyProjectName(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, "");
}

export function createRoomSuffix(): string {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function isRoomId(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= MAX_ROOM_ID_LENGTH &&
    ROOM_ID_PATTERN.test(value)
  );
}

export function buildRoomId(name: string, suffix: string): string {
  if (!name.trim() || !isRoomId(suffix)) {
    return "";
  }

  const slug = slugifyProjectName(name) || "project";
  const roomId = `${slug}-${suffix}`;
  return isRoomId(roomId) ? roomId : "";
}
