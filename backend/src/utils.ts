import jwt from "jsonwebtoken"
import { HASH_ROUNDS, JWT_LIFETIME, JWT_SECRET } from "./config"
import bcrypt from "bcrypt"
import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import { AuthenticatedRequest } from "./types"

export function generateJWTtoken(input: object) {
    return jwt.sign(input, JWT_SECRET, { expiresIn: JWT_LIFETIME })
}

export function verifyJWTtoken(token: string) {
    return jwt.verify(token, JWT_SECRET)
}

export async function hashText(text: string) {
    return bcrypt.hash(text, HASH_ROUNDS)
}

export class ValidationError extends Error {
    constructor(private _errors: Joi.ValidationErrorItem[]) {
        super("The given data is invalid")
    }

    get errors() {
        return this._errors.reduce((acc, error) => {
            // @ts-ignore
            acc[error.path[0]] = error.message
            return acc
        }, {})
    }
}

type controllerHandler = (
    request: Request | AuthenticatedRequest | any,
    response: Response
) => Promise<any>

export function controller(handler: controllerHandler) {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = await handler(request, response)

            if (!response.statusCode) {
                response.status(200)
            }

            response.json(data)
        } catch (e: any) {
            if (e instanceof ValidationError) {
                response.status(422).json({
                    message: e.message,
                    errors: e.errors,
                })
            }

            next(e)
        }
    }
}

export function validator(schema: object) {
    const instance = Joi.object(schema)

    return {
        validate(value: object) {
            const { error, value: validated } = instance.validate(value, {
                abortEarly: true,
            })

            if (error) {
                throw new ValidationError(error.details)
            }

            return validated
        },
    }
}
