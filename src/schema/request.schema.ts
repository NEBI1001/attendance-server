import { LeaveType, UserRole } from "@prisma/client";
import { z } from "zod";

const phoneNumberRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;


const Roles: UserRole[] = ["Admin", "Employee", "Hr"];
const LeaveTypes: LeaveType[] = ["Emergency", "Other", "Sick", "Vacation"];

export const LoginUserRequest = z.object({
    email: z.string().email(),
    password: z.string()
})


export const CreateUserRequest = LoginUserRequest.extend({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    // Add .max or .min to change the how long the password must be
    password: z.string(),
    phoneNumber: z.string().refine(val => phoneNumberRegex.test(val), {
        message: "Invalid phone number. Make sure you use the international phone number (e.g +<coutry-code><phone-number>)"
    }),
    role: z.string().refine(val => Roles.find(value => value == val) !== undefined, {
        message: "Enter a valid role"
    }),
    departmentId: z.number()
})



export const NormalUpdateUserRequest = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    // Add .max or .min to change the how long the password must be
    password: z.string().optional(),
    phoneNumber: z.string().refine(val => phoneNumberRegex.test(val), {
        message: "Invalid phone number. Make sure you use the international phone number (e.g +<coutry-code><phone-number>)"
    }).optional(),
})

export const AdminUserUpdateRequest = NormalUpdateUserRequest.extend({
    role: z.string().refine(val => Roles.find(value => value == val) !== undefined, {
        message: "Enter a valid role"
    }).optional(),
    departmentId: z.number().optional()
});

export const CreateLeaveRequest = z.object({
    type: z.string().refine(value => LeaveTypes.find(val => val === value) !== undefined, {
        message: "Invalid Leave Type"
    }),
    reason: z.string(),
    startDate: z.date(),
    endDate: z.date(),
})

export const ApproveLeaveRequest = z.object({
    approvedById: z.number(),
    feedback: z.string(),
    approved: z.boolean()
});



export const CreateDepartmentRequest = z.object({
    name: z.string()
})

export type CreateUserRequestType = z.infer<typeof CreateUserRequest> & { role: UserRole };

export type NormalUpdateUserRequestType = z.infer<typeof NormalUpdateUserRequest>

export type AdminUserUpdateRequestType = z.infer<typeof AdminUserUpdateRequest> & { role?: UserRole };

export type CreateLeaveRequestType = z.infer<typeof CreateLeaveRequest>;

export type ApproveLeaveRequestType = z.infer<typeof ApproveLeaveRequest>;

export type CreateDepartmentRequestType = z.infer<typeof CreateDepartmentRequest>;

export type LoginUserRequestType = z.infer<typeof LoginUserRequest>;

