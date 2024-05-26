import { Request, Response } from "express"
import prisma from "../../prisma"
import { client } from "../services/google"
import { GOOGLE_CLIENT_ID } from "../config"
import { generateJWTtoken } from "../utils"

export async function handle(req: Request, res: Response) {
    const { token } = req.body

    try {
        if (!token) throw new Error("Token is missing")

        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()

        if (!payload) throw new Error()

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: payload.email,
            },
        })

        if (user.role !== 'employer') throw new Error;

        const newToken = generateJWTtoken({
            id: user.id,
            email: user.email,
            role: user.role,
        })
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: newToken,
        }
    } catch (error: any) {
        res.status(400)
        return { error: error.message || "Invalid email or role" }
    }
}
