import { Request, Response } from "express"
import { queue } from "../queues/importEmployees.queue";
import { AuthenticatedRequest, AuthenticatedUser } from "../types";
import prisma from "../../prisma";

export async function handle(req: Request & { user: AuthenticatedUser }, res: Response) {
    if (!req.files?.file) {
        res.status(400)
        return { message: "No file uploaded" }
    }

    const excelFile = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;

    const uploadPath = __dirname + '/../../uploads/abc.xlsx'

    const employer = await prisma.employer.findFirstOrThrow({
        where: {
            userId: req.user.id
        }
    });

    excelFile.mv(uploadPath, function (err) {
        if (err) {
            res.status(400).json({ message: err.message || "Something went wrong while uploading file" })
        }

        queue.add('InitiateImportEmployees', {
            filename: uploadPath,
            employerId: employer.id
        })

    });
}
