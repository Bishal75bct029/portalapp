import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { PORT } from "./config"
import * as authController from "./controllers/auth.controller"
import * as employerController from "./controllers/employer.controller"
import * as employeeController from "./controllers/employee.controller"
import * as employerLoginController from "./controllers/employerLogin.controller"
import * as bulkEmployeeImportController from "./controllers/bulkEmployeeImport.controller"
import * as meController from "./controllers/me.controller"
import Authenticated from "./middlewares/authenticated.middleware"
import HasRole from "./middlewares/hasRole.middleware"
import { controller } from "./utils"
import fileupload from 'express-fileupload';

const app = express()

app.use(cors())
app.use(express.json())
app.use(fileupload())

app.post("/login", controller(authController.login))
app.post("/employer/login", controller(employerLoginController.handle))
app.get("/me", Authenticated(), controller(meController.handle))

app.get(
    "/employers",
    Authenticated(),
    HasRole("admin"),
    controller(employerController.index)
)
app.post(
    "/employers",
    Authenticated(),
    HasRole("admin"),
    controller(employerController.store)
)
app.put(
    "/employers/:id",
    Authenticated(),
    HasRole("admin"),
    controller(employerController.update)
)
app.delete(
    "/employers/:id",
    Authenticated(),
    HasRole("admin"),
    controller(employerController.destroy)
)

app.get(
    "/employees/",
    Authenticated(),
    HasRole(["employer"]),
    controller(employeeController.index)
)

app.get(
    "/employees/:id",
    Authenticated(),
    HasRole(["employer","employee"]),
    controller(employeeController.getSingleEmployee)
)

app.post(
    "/employees",
    Authenticated(),
    HasRole(["employer"]),
    controller(employeeController.store)
)

app.post(
    "/employees/bulk-import",
    Authenticated(),
    HasRole(["employer"]),
    controller(bulkEmployeeImportController.handle)
)

app.put(
    "/employees/:id",
    Authenticated(),
    HasRole(["employer","employee"]),
    controller(employeeController.update)
)

app.delete(
    "/employees/:id",
    Authenticated(),
    HasRole(["admin", "employer"]),
    controller(employeeController.destroy)
)

app.use((err: any, _: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }

    if (err.stack && process.env.NODE_ENV === "development") {
        console.error(err.stack)
    }

    res.status(500).json({ error: "Internal Server Error" })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
