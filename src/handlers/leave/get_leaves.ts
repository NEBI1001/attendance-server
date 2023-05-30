import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { LeaveResponse } from "../../schema/response.schema";
import { generateLeaveResponse } from "../../helpers/generate_response";

const handler = async (request: Request, response: Response) => {
    const user = await validateJWT(request.cookies.token);
    if (!user || user.role === "Employee") return unauthorizedResponse(response, "")

    const leaves = await prisma.leave.findMany({
        orderBy: { approved: { sort: "asc", nulls: "first" } },
        include: {
            employee: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        }

    })

    return successResponse<{ leaves: LeaveResponse[] }>(response, {
        leaves: leaves.map(leave => generateLeaveResponse(leave))
    })
}

export default handler;