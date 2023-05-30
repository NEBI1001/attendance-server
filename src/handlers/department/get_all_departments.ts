import { Request, Response, response } from "express";
import { prisma } from "../../prisma";
import { successResponse } from "../../helpers/response_helpers";
import { DepartmentResponse } from "../../schema/response.schema";
import { generateDepartmentResponse } from "../../helpers/generate_response";

const handler = async (request: Request, resonse: Response) => {
    const departments = await prisma.department.findMany();
    return successResponse<{ departments: DepartmentResponse[] }>(response, {
        departments: departments.map(department => generateDepartmentResponse(department))
    })

}
export default handler;