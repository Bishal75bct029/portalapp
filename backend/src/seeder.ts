import prisma from "../prisma"
import { hashText } from "./utils"
;(async () => {
    const users: {
        name: string
        email: string
        role: string
        password?: string
        employee?: {
            employer: string
            title: string
            salary: number
        }
    }[] = [
        {
            name: "Admin",
            email: "admin@gmail.com",
            role: "admin",
        },
        {
            name: "Rakesh Thapa",
            email: "bishallc175@gmail.com",
            role: "employer",
        },
        {
            name: "Vc76it23",
            email: "vc76it231@vedascollege.edu.np",
            role: "employer",
        },
        {
            name: "Ram Sita",
            email: "namaste2@gmail.com",
            role: "employee",
            employee: {
                employer: "vc76it231@vedascollege.edu.np",
                title: "Software Engineer",
                salary: 100000,
            },
        },
        {
            name: "Nepali Babu",
            email: "nepal@gmail.com",
            role: "employee",
            employee: {
                employer: "bishallc17@gmail.com",
                title: "QA",
                salary: 50000,
            },
        },
    ]

    for (const user of users) {
        if (!(await prisma.user.findUnique({ where: { email: user.email } }))) {
            const _user = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    password: await hashText(user.password || "password"),
                },
            })

            if (user.role === "employer") {
                await prisma.employer.create({
                    data: {
                        userId: _user.id,
                    },
                })
            }

            if (user.role === "employee" && user.employee) {
                const employerUser = await prisma.user.findFirstOrThrow({
                    where: {
                        email: user.employee.employer,
                    },
                    include: {
                        employer: true,
                    },
                })

                await prisma.employee.create({
                    data: {
                        userId: _user.id,
                        employerId: Number(employerUser.employer?.id),
                        title: user.employee.title,
                        salary: user.employee.salary,
                    },
                })
            }

            console.log(`Successfully seeded ${user.email}`)
        } else {
            console.log(`${user.email} already exists`)
        }
    }
})()
