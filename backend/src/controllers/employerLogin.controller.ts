import { Request, Response } from "express"
import prisma from "../../prisma"
import { client } from "../services/google"

export async function handle(req: Request, res: Response) {
    const { token } = req.body

    try {
        if (!token) throw new Error("Token is missing")

        const ticket = await client.verifyIdToken(token)

        const payload = ticket.getPayload()

        if (!payload) throw new Error()

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: payload.email,
            },
        })

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        }
    } catch (error: any) {
        res.status(400)
        return { error: error.message || "Invalid token" }
    }
}
