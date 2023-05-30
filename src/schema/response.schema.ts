import { CreateLeaveRequestType, CreateUserRequestType, ApproveLeaveRequestType, CreateDepartmentRequestType } from "./request.schema";

type DateType = Date;

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

export type UserResponse = Omit<CreateUserRequestType, "password"> & { id: number, updatedAt: DateType, createdAt: DateType };

export type LeaveResponse = CreateLeaveRequestType & Nullable<ApproveLeaveRequestType> & { employeeId: number, employeeFirstName: string, employeeLastName: string };

export type DepartmentResponse = CreateDepartmentRequestType & { id: number }
export type DepartmentFullResponse = CreateDepartmentRequestType & { id: number } & { users: UserResponse[] };

export type AttendanceResponse = {
    employeeId: number,
    date: DateType
};
