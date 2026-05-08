import {
    RegisterRequest,
} from "./types"

export interface RegisterParams {
    request: RegisterRequest
}

export class RegisterCommand {
    constructor(
        readonly params: RegisterParams,
    ) {}
}
