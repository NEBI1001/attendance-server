import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { LeaveResponse } from "../../schema/response.schema";
import { generateLeaveResponse } from "../../helpers/generate_response";

const handle = async (request: Request<{ id: string }>, response: Response) => {
    const id = Number(request.params.id);
    const user = await validateJWT(request.cookies.token as string | undefined);
    if (!user || (user.id !== id && user.role === "Employee")) return unauthorizedResponse(response, "Invalid Credentials");

    const leaves = await prisma.leave.findMany({
        where: {
            employeeId: id,
        },
        orderBy: {
            approved: { sort: "asc", nulls: "first" },
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

    return successResponse<{ leaves: LeaveResponse[] }>(response, {
        leaves: leaves.map(leave => generateLeaveResponse(leave))
    })
}

export default handle;