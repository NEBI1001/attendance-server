import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { createdResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { generateAttendanceResponse } from "../../helpers/generate_response";
import { isSameDay } from "../../helpers/helpers";

const handler = async (request: Request<{ id: string }>, response: Response) => {
    const id = Number(request.params.id);
    const user = await validateJWT(request.cookies.token as string | undefined);
    if (!user || user.id !== id) return unauthorizedResponse(response, "Invalid Credentials");

    const lastAttendance = await prisma.attendance.findMany({
        where: {
            employeeId: id
        },
        orderBy: {
            date: "desc"
        },
        take: 1
    })

    if (!isSameDay(lastAttendance[0].date, new Date())) {
        const attendance = await prisma.attendance.create({
            data: {
                date: new Date(),
                employee: { connect: { id } }
            },
        });
        return createdResponse(response, generateAttendanceResponse(attendance));
    } else {
        return successResponse(response, { message: "Already taken attendance for today" })
    }
}

export default handler