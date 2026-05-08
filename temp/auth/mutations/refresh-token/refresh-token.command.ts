import {
    RefreshTokenRequest 
} from "./types"


export interface RefreshTokenParams {
    request: RefreshTokenRequest
}

export class RefreshTokenCommand {
    constructor(
        readonly params: RefreshTokenParams,
    ) {}
}
