import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { prisma } from "../../prisma";
import { notFoundResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { generateLeaveResponse } from "../../helpers/generate_response";

const handler = async (request: Request<{ leaveId: string }>, response: Response) => {
    const leaveId = Number(request.params.leaveId);
    const leave = await prisma.leave.findUnique({
        where: {
            id: leaveId
        },
        include: {
            employee: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    if (!leave) return notFoundResponse(response, "Leave Request not found");

    const user = await validateJWT(request.cookies.token);
    if (!user || (user.role === "Employee" && user.id !== leave.employeeId)) return unauthorizedResponse(response, "Invalid Credentials were provided");

    return successResponse(response, generateLeaveResponse(leave))
}

export default handler;