import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { badRequestResponse, forbiddenResponse, notFoundResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { ApproveLeaveRequest } from "../../schema/request.schema";
import { generateLeaveResponse } from "../../helpers/generate_response";

const handler = async (request: Request<{ leaveId: string }>, response: Response) => {
    const leaveId = Number(request.params.leaveId);
    const user = await validateJWT(request.cookies.token);
    if (!user || user.role !== "Hr") return unauthorizedResponse(response, "Only Hr's can approve leaves")

    try {
        const updateLeaveData = await ApproveLeaveRequest.parseAsync(request.body);

        const leave = await prisma.leave.findUnique({
            where: {
                id: updateLeaveData.approvedById,
            },
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });
        if (!leave) return notFoundResponse(response, "Leave not found");

        if (leave.approved == null) {
            const updateLeave = await prisma.leave.update({
                where: {
                    id: leaveId,
                },
                data: {
                    approvedBy: { connect: { id: updateLeaveData.approvedById } },
                    feedback: updateLeaveData.feedback,
                    approved: updateLeaveData.approved,
                    approveDate: new Date(),
                },
                include: {
                    employee: { select: { firstName: true, lastName: true } }
                }
            });
            return successResponse(response, generateLeaveResponse(updateLeave))
        } else {
            return forbiddenResponse(response, `Leave request has already been handled by ${leave.employee.firstName} ${leave.employee.lastName}`)
        }
    } catch (e) {
        return badRequestResponse(response, "Request data was in the wrong format")
    }
}

export default handler;