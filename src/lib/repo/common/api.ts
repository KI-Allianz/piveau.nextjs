export function canAccessObject(isPublic: boolean, session: any) {
  const isAuthed =
    !!session?.user || process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

  return {
    allowed: isPublic || isAuthed,
    isPublic,
  };
}
