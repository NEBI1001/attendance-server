import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { AttendanceResponse } from "../../schema/response.schema";
import { generateAttendanceResponse } from "../../helpers/generate_response";

const handler = async (request: Request<{ id: string }>, response: Response) => {
    const id = Number(request.params.id);
    const user = await validateJWT(request.cookies.token as string | undefined);
    if (!user || (user.id !== id && user.role === "Employee")) return unauthorizedResponse(response, "Invalid credentials");

    const attendances = await prisma.attendance.findMany({
        where: {
            id
        },
        orderBy: {
            date: "desc"
        }
    });

    return successResponse<{ attendance: AttendanceResponse[] }>(response, {
        attendance: attendances.map(attendance => generateAttendanceResponse(attendance))
    });
}

export default handler;