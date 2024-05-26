import { Queue } from "bullmq"
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../config"
import xlsx from "xlsx"
import prisma from "../../prisma"
import { hashText } from "../utils"
import { Job, Worker } from "bullmq"

const connection = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
}

export const queue = new Queue("import-employees", { connection })

const handlers = {
    InitiateImportEmployees: async (job: Job) => {
        const data = job.data as {
            filename: string
            employerId: number
        }

        const workbook = xlsx.readFile(data.filename)

        let entries = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
        )

        entries = entries.filter(
            (entry: any) =>
                entry.Name && entry.Email && entry.Title && entry.Salary
        )

        while (entries.length) {
            queue.add("ImportEmployees", {
                employees: entries.splice(0, 1),
                employerId: data.employerId,
            })
        }
    },
    ImportEmployees: async (job: Job) => {
        const data = job.data as {
            employees: {
                Name: string
                Email: string
                Password: string
                Title: string
                Salary: number
            }[]
            employerId: number
        }

        for (const employee of data.employees) {
            const existing = await prisma.user.findFirst({
                where: { email: employee.Email },
            })

            if (!existing) {
                await prisma.$transaction(async () => {
                    const user = await prisma.user.create({
                        data: {
                            name: employee.Name,
                            email: employee.Email,
                            password: await hashText(employee.Password),
                            role: "employee",
                        },
                    })

                    await prisma.employee.create({
                        data: {
                            title: employee.Title,
                            salary: employee.Salary,
                            userId: user.id,
                            employerId: job.data.employerId,
                        },
                    })
                })
                continue
            }

            const employeeRecord = await prisma.employee.findFirst({
                where: { userId: existing.id },
            })

            if (
                !employeeRecord ||
                employeeRecord.employerId !== job.data.employerId
            ) {
                continue
            }

            await prisma.user.update({
                where: { id: existing.id },
                data: {
                    name: employee.Name,
                    ...(employee.Password.length
                        ? { password: await hashText(employee.Password) }
                        : {}),
                },
            })
        }
    },
}

export const worker = new Worker(
    "import-employees",
    async (job) => {
        const handler = handlers[job.name as keyof typeof handlers] || null

        if (!handler) {
            return
        }

        await handler(job)
    },
    { connection }
)

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`)
})

worker.on("failed", (job, err) => {
    console.log(`${job?.id || "N/A"} - has failed with ${err.message}`)
})