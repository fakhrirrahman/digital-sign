import { UnauthorizedError } from "../errors/unauthorized.error";

type AuthPayload = {
  id?: string;
  userId?: string;
  sub?: string;
  permissions?: string[];
};

export const getAuthUserId = (auth: unknown) => {
  if (!auth || typeof auth !== "object") {
    throw new UnauthorizedError("Authenticated user is missing");
  }

  const payload = auth as AuthPayload & Record<string, any>;
  
  // Try to find the user ID from common fields including custom ones
  const userId = payload.userId ?? payload.sub ?? payload.id ?? payload.nik ?? payload.user_id ?? payload.telepon ?? payload.username;

  if (!userId) {
    console.error("Authenticated user is missing in JWT payload:", payload);
    throw new UnauthorizedError("Authenticated user is missing");
  }

  return userId;
};

export const hasPermission = (auth: unknown, permission: string) => {
  if (!auth || typeof auth !== "object") {
    return false;
  }

  const permissions = (auth as AuthPayload).permissions;

  return !permissions || permissions.includes(permission);
};
