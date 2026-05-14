import {
    CreatePermissionRequest,
} from "./types"

export interface CreatePermissionCommandParams {
    request: CreatePermissionRequest
    userId: string
}

export class CreatePermissionCommand {
    constructor(
        readonly params: CreatePermissionCommandParams,
    ) {}
}
