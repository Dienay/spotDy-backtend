import { BaseError } from "./BaseError"

export class UnknownError extends BaseError {
    constructor(message: string) {
        super(message, 500)
    }
}