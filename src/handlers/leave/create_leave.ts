import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { badRequestResponse, createdResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { CreateLeaveRequest } from "../../schema/request.schema";
import { LeaveType } from "@prisma/client";
import { generateLeaveResponse } from "../../helpers/generate_response";

const handle = async (request: Request<{ id: string }>, response: Response) => {
    const id = Number(request.params.id);
    const user = await validateJWT(request.cookies.token);
    if (!user || user.id !== id) return unauthorizedResponse(response, "Invalid credentials");

    try {
        const leaveData = await CreateLeaveRequest.parseAsync(request.body);

        try {
            const leave = await prisma.leave.create({
                data: {
                    employee: { connect: { id } },
                    ...leaveData,
                    type: leaveData.type as LeaveType
                },
                include: {
                    employee: {
                        select: { firstName: true, lastName: true }
                    }
                }
            });

            return createdResponse(response, generateLeaveResponse(leave))
        } catch (e) {
            console.error(e);
            return badRequestResponse(response, "Already requested for a leave for start date")
        }
    } catch (e) {
        console.error(e);
        return badRequestResponse(response, "Request data was in the wrong format")
    }
}

export default handle;