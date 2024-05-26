import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { PORT } from "./config"
import fileupload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger/swagger.json';

import cluster from "cluster"
import os from 'os'
import router from "./routes/route"

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {

    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use(fileupload())

    app.use('/', router)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use((err: any, _: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(err)
        }

        if (err.stack && process.env.NODE_ENV === "development") {
            console.error(err.stack)
        }

        res.status(500).json({ error: "Internal Server Error" })
    })

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on http://localhost:${PORT}`)
    })
}