import { OAuth2Client } from "google-auth-library"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config"

export const client = new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
})
