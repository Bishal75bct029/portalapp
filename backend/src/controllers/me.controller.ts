import { Response } from "express"
import { AuthenticatedRequest } from "../types"
import prisma from "../../prisma"

export async function handle(req: AuthenticatedRequest, res: Response) {
    const user = req.user

    if (user.role == "employee") {
        const employeeData = await prisma.employee.findFirstOrThrow({
            where: { userId: user.id },
        })

        return {
            ...user,
            title: employeeData.title,
            salary: employeeData.salary,
        }
    }

    return user
}
