import { NextFunction, Request, Response } from "express"

export default function HasRole(role: string | string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {

        const match = Array.isArray(role)
            ? // @ts-ignore
            role.includes(req?.user?.role)
            : // @ts-ignore
            req?.user?.role === role

        if (match) {
            return next()
        }

        return res.status(403).json({
            message: "You are not allowed to access this resource",
        })
    }
}
