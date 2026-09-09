import { UnauthorizedError } from "../errors/unauthorized.error";

type AuthPayload = {
  userId?: string;
  sub?: string;
  permissions?: string[];
};

export const getAuthUserId = (auth: unknown) => {
  const payload = auth as AuthPayload;
  const userId = payload.userId ?? payload.sub;

  if (!userId) {
    throw new UnauthorizedError("Authenticated user is missing");
  }

  return userId;
};

export const hasPermission = (auth: unknown, permission: string) => {
  const permissions = (auth as AuthPayload).permissions;

  return !permissions || permissions.includes(permission);
};
