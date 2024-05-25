import { Request, Response } from "express"
import multer from "multer"

export async function handle(req: Request, res: Response) {
    if (!req.file) {
        res.status(400)
        return { message: "No file uploaded" }
    }

    const storage = multer.diskStorage({
        destination: function (_, __, cb) {
            cb(null, "uploads/")
        },
        filename: (_, file, cb) => {
            const fileName =
                Math.random().toString(36).substring(7) +
                new Date().getTime() +
                "." +
                file.originalname.split(".").pop()

                console.log(fileName)
            cb(null, fileName)
        },
    })

    const upload = multer({ storage }).single("file")

    upload(req, res, (err) => {
        console.log(err)
    })

    return 1
}
