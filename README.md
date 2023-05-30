# Leave Attendance Management System
____
This is the leave attendance management system. This readme is meant to show you how to run the server, how the requests are structured and how the responses are structred.

## Initial Set Up
There are some things that you would need to setup initally in order to use the server

1. Download postgres ([link](https://www.postgresql.org/download/)) and set it up

2. You would have to create a `.env` file in the server's root directory. This meant to hold the config variables that we would use throughout the program

3. You would need to create the `DATABASE_URL` variable in the `.env` file below
    ```bash
    DATABASE_URL="postgresql://<username>:<postgres-password>@localhost:5432/<database_name>?schema=public"
    ```
    Replace <a-random-name> with the appropriate value
    Also the default user is known as `postgres`

4. Create the `JWT_SECRET` variable in the `.env` file
    ```bash
    JWT_SECRET="<Your-secret>"
    ```
    The secret can be anything that you want. You can literally type anything

5. Create the `PORT` variable in the `.env` file
    ```bash
    PORT="<Any-port>"
    ```
    The port can be anything from 1024 to 65536 but common ones used are `3000`, `8000`, `8888`, etc

The final `.env` file should look something like this:

```bash
DATABASE_URL="postgresql://<username>:<postgres-password>@localhost:5432/<database_name>?schema=public"
JWT_SECRET="<Your-secret>"
PORT="<Any-port>"
```
Please fill in all the templated values oooo


## API Routes
Here is a list of all the API routes that the server supports with their HTTP methods

### User Routes
- `POST /user/login` - To log users in
- `POST /user/create` - To create a new user.
- `GET /user/:id` - To get the information about a user
- `PUT /user/:id ` - To update the information associated with a user
- `DELETE /user/:id ` - To delete a user
- `GET /user` - To get all the users in the database

### Attendance Handlers
- `GET /user/:id/attedance` - To get all the attendance record for a user
- `POST /user/:id/attendance` - To take attendance for that day

### Leave Handlers
- `POST /user/:id/leave` - To create a leave request
- `GET /user/:id/leave` - To get all the leave request by a user
- `GET /leave` - To get all leave requests in the database
- `GET /leave/:leaveId/approve` - To either approve/reject a leave request
- `GET /leave/:leaveId` - To get the information associated with a leave request

### Department Handlers
- `GET /department/:departmentId` - Get all the details about a department
- `GET /department/:departmentId/full` - Get all the details about a department including info about all the users in that department
- `GET /department/full` - Get all the departments in the database including all the users associated with that department
- `GET /department` - Get all the departments in the database 
- `POST /department` - To create a new department

## Request Objects
This is a list of all the request objects that would need to be sent to a route in order to perform that route's action. Note some routes don't have request objects at all.

### User Response Objects
-  Create User Request Object
    ```json
    {
        firstName:"<firstname>",
        lastName: "<LastName>",
        email: "<email>",
        password: "<password>",
        phoneNumber: "<phone-number>",
        role: "<user-role>" // This can either be Admin, HR, or Employee,
        departmentId: <department-id>
    }
    ```
- Login User Request Object
    ```json
    {
        email: "<email>",
        passowrd: "<password>
    }
    ```

- Update User Request Object
    There are two types of update user request (Normal, Admin). The Admin update request is the same as the normal request but you can change the role of a user and the department that they are in

    - Normal Update User Request
        ```json
        {
            firstName:"<firstname>",
            lastName: "<LastName>",
            email: "<email>",
            password: "<password>",
            phoneNumber: "<phone-number>",
        }
        ```
    - Admin Update User request
        ```json
        {
            firstName:"<firstname>",
            lastName: "<LastName>",
            email: "<email>",
            password: "<password>",
            phoneNumber: "<phone-number>",
            role: "<user-role>" // This can either be Admin, HR, or Employee,
            departmentId: <department-id>
        }
        ```

### Leave Request Object

- Create Leave Request Object
    ```json
    {
        type: "<type of leave>", // We have 4 types of leaves "Sick, "Emergency", "Other", "Vacation"
        reason: "<reason for leave>",
        startDate: "<date>" // This is a javascript Date Object,
        endDate: "<date>" // This is also a javascript Date object
    }
    ```

- Approve Leave Request Object
    ```json
    {
        approvedById: <id> // This is the user id of the Hr,
        feedback: "<feedback>",
        approved: true | false 
    }
    ```

### Department Request Object
- Create Department Request Object
    ```json
    {
        name: "<deparment-name>"
    }
    ```

## Response Object
This is the object that is returned when you run a request. Basically this is the data the server sends back.

### User Response Object

```json
{
    id: <id> // This is the user Id,
    firstName:"<firstname>",
    lastName: "<LastName>",
    email: "<email>",
    phoneNumber: "<phone-number>",
    role: "<user-role>" // This can either be Admin, HR, or Employee,
    departmentId: <department-id>
    updatedAt: <date> // This is a javascript Date Object,
    createdAt: <date> 
}
```

### Leave Response Object
```json
{
    type: "<type of leave>", // We have 4 types of leaves "Sick, "Emergency", "Other", "Vacation"
    reason: "<reason for leave>",
    startDate: "<date>" // This is a javascript Date Object,
    endDate: "<date>" // This is also a javascript Date object
    approvedById: <id> // This is the user id of the Hr,
    feedback: "<feedback>",
    approved: true | false ,
    employeeId: <id>,
    employeeFirstName: "<First-name>",
    employeeLastName: "<Last-name>"
}
```

### Department Response Object
```json
{
    name: "<deparment-name>"
    id: <id>
}
```

### Departament Full Response Object
```json
{
    name: "<deparment-name>"
    id: <id>,
    users: UserResponseObject[] // This is a list of user responses
}
```

### Attendance Response Object
```json
{
    employeeId: <id>,
    date: <Date> // This is a javascript date object
}
```

And that's it 
That's everything the server does