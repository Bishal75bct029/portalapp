export type AuthenticatedUser = {
    id: number
    name: string
    email: string
    role: string
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser
}
