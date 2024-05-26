import dotenv from "dotenv"

dotenv.config()

const ENVIRONMENT = process.env.NODE_ENV || "local"
const PORT = Number(process.env.PORT || 8000)

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""

const JWT_SECRET = process.env.JWT_SECRET || ""
const JWT_LIFETIME = "365d"

const HASH_ROUNDS = 11

const REDIS_HOST = process.env.REDIS_HOST || "localhost"
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379)
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''

export {
    ENVIRONMENT,
    PORT,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    JWT_LIFETIME,
    JWT_SECRET,
    HASH_ROUNDS,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
}
