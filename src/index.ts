import Express, { response } from "express";
import CookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";

// -------------User Handler Imports-------------
import createUserHandler from "./handlers/user/create_user";
import loginUserHandler from "./handlers/user/login_user";
import updateUserHandler from "./handlers/user/update_user";
import deleteUserHandler from "./handlers/user/delete_user";
import getAllUsersHandler from "./handlers/user/get_all_users";
import getUserHandler from "./handlers/user/get_user";

// -------------Attendance Handler Imports-------------
import takeAttendanceHandler from "./handlers/attendance/take_attendance";
import getAttendanceHandler from "./handlers/attendance/get_attendance";

// -------------Leave Handler Imports-------------
import createLeaveHandler from "./handlers/leave/create_leave";
import getUserLeavesHandler from "./handlers/leave/get_user_leaves";
import getAllLeavesHandler from "./handlers/leave/get_leaves";
import getLeaveHandler from "./handlers/leave/get leave";
import approveLeaveHandler from "./handlers/leave/approve_leave";

// -------------Department Handler Imports-------------
import getDepartmentHandler from "./handlers/department/get_department";
import getDepartmentFullHandler from "./handlers/department/get_department_full";
import getAllDepartmentHandler from "./handlers/department/get_all_departments";
import getAllDepartmentFullHandler from "./handlers/department/get_all_department_full";
import createDepartmentHandler from "./handlers/department/create_department";
import makeAdminHandler from "./handlers/user/make_admin";


config();

const app = Express();
const port = process.env.PORT;
if (!port) {
    console.log("Need to set PORT environment variable");
    // Quit the Server
    process.exit(1);
}

app.use(CookieParser())
app.use(bodyParser.json())
app.use(cors({
    origin: true,
}))

// -----------User Handlers-----------
app.post("/user/login", loginUserHandler)
app.post("/user/create", createUserHandler)
app.delete("/user/:id", deleteUserHandler)
app.put("/user/:id", updateUserHandler)
app.get("/user/:id", getUserHandler)
app.get("/user", getAllUsersHandler)
app.post("/make/admin", makeAdminHandler)


// -----------Attendance Handlers-----------
app.post("/user/:id/attendance", takeAttendanceHandler);
app.get("/user/:id/attendance", getAttendanceHandler);


// -----------Leave Handlers-----------
app.post("/user/:id/leave", createLeaveHandler)
app.get("/user/:id/leave", getUserLeavesHandler)
app.get("/leave", getAllLeavesHandler)
app.get("/leave/:leaveId/approve", approveLeaveHandler)
app.get("/leave/:leaveId", getLeaveHandler)

// -----------Department Handlers-----------
app.get("/department/:departmentId", getDepartmentHandler);
app.get("/department/:departmentId/full", getDepartmentFullHandler);
app.get("/department", getAllDepartmentHandler);
app.get("/department/full", getAllDepartmentFullHandler);
app.post("/department", createDepartmentHandler);


app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`)
});