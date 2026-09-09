import { describe, it, expect, mock, beforeEach } from "bun:test";
import { AuditRepository } from "../repository/audit.repository";
import { db } from "../../../prisma/db";

mock.module("../../../prisma/db", () => {
  return {
    db: {
      orm: {
        public: {
          AuditLog: {
            create: mock(),
          },
        },
      },
    },
  };
});

describe("AuditRepository", () => {
  let repository: AuditRepository;

  beforeEach(() => {
    repository = new AuditRepository();
    db.orm.public.AuditLog.create.mockClear();
  });

  describe("create", () => {
    it("should call db.orm.public.AuditLog.create with correct mapping", async () => {
      db.orm.public.AuditLog.create.mockResolvedValue({ id: "log1" } as any);

      const result = await repository.create({
        action: "SIGN_REQUEST_CREATED",
        actorUserId: "user1",
      });

      expect(db.orm.public.AuditLog.create).toHaveBeenCalledWith({
        signRequestId: null,
        actorUserId: "user1",
        action: "SIGN_REQUEST_CREATED",
        ipAddress: null,
        userAgent: null,
        metadata: undefined,
      });
      expect(result.id).toBe("log1");
    });
  });
});
