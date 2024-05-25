import { Request, Response } from "express"
import prisma from "../../prisma"
import bcrypt from "bcrypt"
import Joi from "joi"
import { generateJWTtoken, validator } from "../utils"

export async function login(req: Request, res: Response) {
    validator({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().min(8).required().label("Password"),
    }).validate(req.body)

    let user = await prisma.user.findUnique({
        where: { email: req.body.email },
    })

    if (!(user && (await bcrypt.compare(req.body.password, user.password)))) {
        res.status(401)
        return {
            message: "Invalid email or password",
        }
    }

    const token = generateJWTtoken({
        id: user.id,
        email: user.email,
        role: user.role,
    })

    if (user.role == "employee") {
        const employee = await prisma.employee.findFirst({
            where: { userId: user.id },
        })

        if (!employee) {
            res.status(401)
            return {
                message: "Invalid email or password",
            }
        }

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                salary: employee.salary,
                title: employee.title,
            },
            token,
        }
    }

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    }
}
