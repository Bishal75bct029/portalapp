import { NextFunction, Request, Response } from "express"
import { verifyJWTtoken } from "../utils"
import prisma from "../../prisma"
import { AuthenticatedUser } from "../types"

export default function Authenticated() {
    return async (
        req: Request & { user?: AuthenticatedUser },
        res: Response,
        next: NextFunction
    ) => {
        let token = req.headers.authorization
        try {

            if (
                !token ||
                !token.startsWith("Bearer") ||
                token.split(" ").length !== 2
            ) {
                throw new Error("Unauthorized")
            }

            token = token.split(" ")[1]

            const payload = verifyJWTtoken(token)

            if (typeof payload !== "object" || !("id" in payload)) {
                throw new Error("Unauthorized")
            }

            const { password, ...user } = await prisma.user.findFirstOrThrow({
                where: { id: payload.id },
            })

            req.user = user
        } catch (e: any) {
            return res.status(401).json({
                message: "Unauthorized",
            })
        }

        next()
    }
}
