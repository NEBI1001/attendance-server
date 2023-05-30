import { UserRole } from "@prisma/client";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

type UserPayload = { id?: number, role?: UserRole }

export const generateJWT = async <T extends UserPayload>(payload: T) => {
    // return jwt.sign(payload, JWT_SECRET!, { expiresIn: "30d" });
    const token = await new SignJWT({ id: payload.id, role: payload.role })
        .setExpirationTime("1d")
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .sign(JWT_SECRET);
    return token;
};

export const validateJWT = async (
    token: string | undefined | null
): Promise<(JWTPayload & UserPayload) | null> => {
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET, {
        algorithms: ["HS256"],
    });
    return payload;
};
