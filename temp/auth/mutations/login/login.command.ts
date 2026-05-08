import {
    LoginRequest 
} from "./types"


export interface LoginParams {
    request: LoginRequest
}

export class LoginCommand {
    constructor(
        readonly params: LoginParams,
    ) {}
}
