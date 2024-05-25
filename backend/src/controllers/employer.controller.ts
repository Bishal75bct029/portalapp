import { Request, Response } from "express"
import { hashText, validator } from "../utils"
import Joi from "joi"
import crypto from "crypto"
import prisma from "../../prisma"

export async function index(req: Request, _: Response) {
    const page = Number(req.query.page || 1)

    const PER_PAGE = 10

    const employers = await prisma.employer.findMany({
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
        include: {
            user: true,
        },
    })

    const data = employers.map((item) => {
        const { password, ...user } = item.user

        return user
    })

    return {
        employers: data,
        pagination: {
            active: page,
            totalPages: Math.ceil((await prisma.employer.count()) / PER_PAGE),
        },
    }
}

export async function store(req: Request, res: Response) {
    validator({
        name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
    }).validate(req.body)

    if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
        res.status(422)
        return {
            message: "The given data is invalid",
            errors: {
                email: "Email already exists",
            },
        }
    }

    const user = await prisma.$transaction(async () => {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                role: "employer",
                password: await hashText(
                    crypto.randomBytes(16).toString("hex")
                ),
            },
        })

        await prisma.employer.create({
            data: {
                userId: user.id,
            },
        })

        return user
    })

    const { password, ...employer } = user

    return {
        message: "Employer created successfully",
        employer,
    }
}

export async function update(req: Request, res: Response) {
    validator({
        name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
    }).validate(req.body)

    const existing = await prisma.user.findUnique({
        where: { email: req.body.email },
    })

    if (existing && existing.id !== Number(req.params.id)) {
        res.status(422)
        return {
            message: "The given data is invalid",
            errors: {
                email: "Email already exists",
            },
        }
    }

    const user = await prisma.$transaction(async () => {
        const user = await prisma.user.update({
            data: {
                name: req.body.name,
                email: req.body.email,
            },
            where: {
                id: Number(req.params.id),
            },
        })

        return user
    })

    const { password, ...employer } = user

    return {
        message: "Employer updated successfully",
        employer,
    }
}

export async function destroy(req: Request, res: Response) {
    const id = Number(req.params.id)

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    })

    if (!user) {
        res.status(404)
        return {
            message: "Employer not found",
        }
    }

    await prisma.$transaction(async () => {
        await prisma.employer.delete({
            where: {
                userId: id,
            },
        })

        await prisma.user.delete({
            where: { id },
        })
    })

    return {
        message: "Employer deleted successfully!",
    }
}
