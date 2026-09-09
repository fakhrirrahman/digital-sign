import Elysia from "elysia";
import { authMiddleware } from "../../../commons/middleware/auth.middleware";
import { successResponse } from "../../../commons/response";
import { getAuthUserId } from "../../../commons/utils/auth";
import { ApprovalProcessModel } from "../model/approval-process.model";
import { approvalProcessService } from "../service/approval-process.service";

const getRequestIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  ?? request.headers.get("x-real-ip");

export const approvalProcessHandler = new Elysia({
  prefix: "/approval-process",
})
  .use(authMiddleware)
  .get("", async () => {
    const requests = await approvalProcessService.findAll();

    return successResponse({ requests });
  })
  .post(
    "",
    async (context) => {
      const actorUserId = getAuthUserId((context as any).auth);
      const { body } = context;
      const result = await approvalProcessService.create(body, actorUserId);

      return successResponse(result, "Approval process has been created");
    },
    {
      body: ApprovalProcessModel.createBody,
    },
  )
  .post(
    "/:referenceId/approve",
    async (context) => {
      const auth = (context as any).auth;
      const { body, params, request } = context;
      const userId = getAuthUserId(auth);
      const result = await approvalProcessService.approve({
        referenceId: params.referenceId,
        userId,
        auth,
        pin: body.pin,
        letterNumber: body.letterNumber,
        letterDate: body.letterDate,
        ipAddress: getRequestIp(request),
        userAgent: request.headers.get("user-agent"),
      });

      return successResponse(result, "Approval has been recorded successfully");
    },
    {
      params: ApprovalProcessModel.referenceParams,
      body: ApprovalProcessModel.approveBody,
    },
  )
  .post(
    "/:referenceId/final-sign",
    async (context) => {
      const auth = (context as any).auth;
      const { body, params, request } = context;
      const userId = getAuthUserId(auth);
      const result = await approvalProcessService.finalSign({
        referenceId: params.referenceId,
        userId,
        fileKey: body.fileKey,
        documentHash: body.documentHash,
        mimeType: body.mimeType,
        fileSize: body.fileSize,
        certificateSerial: body.certificateSerial,
        certificateIssuer: body.certificateIssuer,
        ipAddress: getRequestIp(request),
        userAgent: request.headers.get("user-agent"),
      });

      return successResponse(result, "Document has been signed successfully");
    },
    {
      params: ApprovalProcessModel.referenceParams,
      body: ApprovalProcessModel.finalSignBody,
    },
  );
