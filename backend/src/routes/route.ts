import * as authController from "../controllers/auth.controller"
import * as employerController from "../controllers/employer.controller"
import * as employeeController from "../controllers/employee.controller"
import * as employerLoginController from "../controllers/employerLogin.controller"
import * as bulkEmployeeImportController from "../controllers/bulkEmployeeImport.controller"
import * as meController from "../controllers/me.controller"
import Authenticated from "../middlewares/authenticated.middleware"
import HasRole from "../middlewares/hasRole.middleware"
import { controller } from "../utils"
import express from "express"

const router = express.Router();

router.post(
    "/login",
    controller(authController.login)
)
router.post(
    "/employer/login",
    controller(employerLoginController.handle)
)
router.get(
    "/me",
    Authenticated(),
    controller(meController.handle)
)
router.get(
    "/employers",
    Authenticated(),
    HasRole("admin"),
    controller(employerController.index)
)
router.post(
    "/employers",
    Authenticated(),
    HasRole("admin"),
    controller(employerController.store)
)
router.put(
    "/employers/:id",
    Authenticated(),
    HasRole("admin"),
    controller(employerController.update)
)
router.delete(
    "/employers/:id",
    Authenticated(),
    HasRole("admin"),
    controller(employerController.destroy)
)

router.get(
    "/employees/",
    Authenticated(),
    HasRole(["employer"]),
    controller(employeeController.index)
)

router.get(
    "/employees/:id",
    Authenticated(),
    HasRole(["employer", "employee"]),
    controller(employeeController.getSingleEmployee)
)

router.post(
    "/employees",
    Authenticated(),
    HasRole(["employer"]),
    controller(employeeController.store)
)

router.post(
    "/employees/bulk-import",
    Authenticated(),
    HasRole(["employer"]),
    controller(bulkEmployeeImportController.handle)
)

router.put(
    "/employees/:id",
    Authenticated(),
    HasRole(["employer", "employee"]),
    controller(employeeController.update)
)

router.delete(
    "/employees/:id",
    Authenticated(),
    HasRole(["admin", "employer"]),
    controller(employeeController.destroy)
)

export default router;
