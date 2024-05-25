import { Request, Response } from "express"
import prisma from "../../prisma"

export async function destroy(req: Request, res: Response) {
    const id = Number(req.params.id)

    await prisma.$transaction(async () => {
        await prisma.employee.delete({
            where: {
                userId: id,
            },
        })

        await prisma.user.delete({
            where: { id },
        })
    })

    return {
        message: "Employee deleted successfully!",
    }
}
