import { Rol } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireRole(roles: Rol[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !roles.includes((session.user as any).role)) {
    return null;
  }
  return session;
}
