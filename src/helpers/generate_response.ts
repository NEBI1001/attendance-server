import { Prisma } from "@prisma/client";
import { AttendanceResponse, DepartmentFullResponse, DepartmentResponse, LeaveResponse, UserResponse } from "../schema/response.schema";

export const generateUserResponse = (userData: Prisma.UserGetPayload<{}>): UserResponse => {
    return {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        departmentId: userData.departmentId
    }
}

export const generateAttendanceResponse = (attendance: Prisma.AttendanceGetPayload<{}>): AttendanceResponse => {
    return {
        date: attendance.date,
        employeeId: attendance.employeeId,

    }

}

export const generateLeaveResponse = (leave: Prisma.LeaveGetPayload<{
    include: {
        employee: {
            select: {
                firstName: true,
                lastName: true,
            }
        }
    }
}>): LeaveResponse => {
    return {
        approvedById: leave.approvedById,
        approved: leave.approved,
        endDate: leave.endDate,
        feedback: leave.feedback,
        employeeId: leave.employeeId,
        employeeFirstName: leave.employee.firstName,
        employeeLastName: leave.employee.lastName,
        reason: leave.reason,
        startDate: leave.startDate,
        type: leave.type
    }
}

export const generateDepartmentResponse = (department: Prisma.DepartmentGetPayload<{}>): DepartmentResponse => {
    return {
        id: department.id,
        name: department.name
    }
}

export const generateDepartmentFullResponse = (department: Prisma.DepartmentGetPayload<{ include: { User: true } }>): DepartmentFullResponse => {
    return {
        id: department.id,
        name: department.name,
        users: department.User.map(user => generateUserResponse(user)),
    }
}
