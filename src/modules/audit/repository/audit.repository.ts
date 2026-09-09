import { db } from "../../../prisma/db";

export type AuditAction =
  | "SIGN_REQUEST_CREATED"
  | "APPROVAL_STARTED"
  | "APPROVAL_APPROVED"
  | "APPROVAL_REJECTED"
  | "PIN_VERIFICATION_SUCCESS"
  | "PIN_VERIFICATION_FAILED"
  | "SIGNATURE_PROFILE_CREATED"
  | "SIGNATURE_PROFILE_UPDATED"
  | "DOCUMENT_RECEIVED"
  | "DOCUMENT_HASHED"
  | "SIGNING_STARTED"
  | "SIGNING_COMPLETED"
  | "SIGNING_FAILED"
  | "SIGN_REQUEST_COMPLETED"
  | "SIGN_REQUEST_CANCELLED";

export type CreateAuditLogInput = {
  signRequestId?: string | null;
  actorUserId?: string | null;
  action: AuditAction;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: unknown;
};

export class AuditRepository {
  async create(data: CreateAuditLogInput) {
    return db.orm.public.AuditLog.create({
      signRequestId: data.signRequestId ?? null,
      actorUserId: data.actorUserId ?? null,
      action: data.action,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
      metadata: data.metadata ? (data.metadata as any) : undefined,
    });
  }
}

export const auditRepository = new AuditRepository();
