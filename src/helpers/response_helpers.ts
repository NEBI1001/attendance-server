import { CookieOptions, Response } from "express";

type ErrorMessage = { message: string };

export const successResponse = <T>(response: Response<T>, message: T, cookie?: { name: string, value: string, options?: CookieOptions }) => {
    if (cookie) {
        response = response.cookie(cookie.name, cookie.value, cookie.options ?? {});
    }
    response.status(200).json(message)
}

export const createdResponse = <T>(response: Response<T>, message: T, cookie?: { name: string, value: string, options?: CookieOptions }) => {
    if (cookie) {
        response.cookie(cookie.name, cookie.value, cookie.options ?? {});
    }
    response.status(201).json(message)
}

export const unauthorizedResponse = (response: Response<ErrorMessage>, message: string) => {
    response.status(401).json({
        message
    });
}

export const forbiddenResponse = (response: Response<ErrorMessage>, message: string) => {
    response.status(403).json({ message });
}

export const notFoundResponse = (response: Response<ErrorMessage>, message: string) => {
    response.status(404).json({ message })
}

export const badRequestResponse = (reponse: Response<ErrorMessage>, message: string) => {
    reponse.status(422).json({ message });
}

export const serverErrorResponse = (response: Response<ErrorMessage>, message: string) => {
    response.status(500).json({ message })
}
