import { Request, Response } from "express"
import prisma from "../../prisma"
import { hashText, validator } from "../utils";
import Joi from "joi";

export async function index(req: Request, res: Response) {
    const empId = req.query.employerId as string;
    const page = Number(req.query.page || 1);

    const PER_PAGE = 10;

    const employer = await prisma.employer.findFirstOrThrow({
        where: {
            //@ts-ignore
            userId: req?.user?.id
        }
    })

    const employees = await prisma.employee.findMany({
        where: {
            employerId: employer.id
        },
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
        include: {
            user: true
        },
    }
    )

    const data = employees.map(item => {
        const { user, ...employee } = item
        const { password, ...formattedUser } = user

        return {
            ...employee,
            ...formattedUser,
        };
    })

    return {
        employees: data,
        pagination: {
            page,
            totalNumberOfPage: Math.ceil(await prisma.employee.count() / 10)
        }
    }
}

export async function getSingleEmployee(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })

    if (!user) {
        res.status(400)
        return ({ message: "User not found" });
    }

    const employee = await prisma.employee.findFirst({ where: { userId: parseInt(req.params.id) } })

    return {
        userId: user.id,
        username: user.name,
        email: user.email,
        role: user.role,
        salary: employee?.salary,
        title: employee?.title,
    }
}

export async function store(req: Request, res: Response) {
    validator({
        email: Joi.string().email().required().label("email"),
        name: Joi.string().required().label("name"),
        title: Joi.string().required().label("title"),
        salary: Joi.number().required().label("salary"),
        password: Joi.string().required().label("password"),

    }).validate(req.body)

    let user = await prisma.user.findUnique({ where: { email: req.body.email } });

    if (user) {
        res.status(400)
        return { message: "Employee already exists" }
    }
    //@ts-ignore
    let employer = await prisma.employer.findFirstOrThrow({
        where: {
            //@ts-ignore
            userId: req?.user?.id
        }
    })
    user = await prisma.$transaction(async (_) => {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                role: 'employee',
                password: await hashText(req.body.password),
            },
        });

        const employee = await prisma.employer.findFirstOrThrow({
            where: {
                //@ts-ignore
                userId: req.user.id
            }
        })

        const employeeData = await prisma.employee.create({
            data: {
                userId: user.id,
                title: req.body.title,
                salary: req.body.salary,
                employerId: employee.id
            }
        })

        return { ...user, ...employeeData };
    })

    return user;
}

export async function update(req: Request, res: Response) {
    try {
        validator({
            email: Joi.string().email().required().label("email"),
            name: Joi.string().required().label("name"),
            salary: Joi.number().allow('').label("salary"),
            title: Joi.string().allow('').label("title"),
        }).validate(req.body)

        let user = await prisma.user.findUnique({ where: { email: req.body.email } });

        if (user && user.id != Number(req.params.id)) {
            res.status(400)
            return { message: "Given email already exists" }
        }

        let data: {
            email: string;
            name: string;
            password?: string;
        } = {
            email: req.body.email,
            name: req.body.name,
        }
        if (req.body.password) {
            data.password = await hashText(req.body.password)
        }

        const employeeData: { title?: string, salary?: number } = {}
        if (req.body.title) employeeData.title = req.body.title;
        if (req.body.salary) employeeData.salary = Number(req.body.salary);

        user = await prisma.$transaction(async (_) => {
            const user = await prisma.user.update({
                where: {
                    id: Number(req.params.id)
                },
                data
            });
            const employee = await prisma.employee.update({
                where: {
                    userId: Number(req.params.id)
                },
                data: employeeData
            })
            return user
        })

        return user;
    }
    catch (e) {
    }
}

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
