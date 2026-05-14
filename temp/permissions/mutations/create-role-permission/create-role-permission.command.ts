import {
    CreateRolePermissionRequest,
} from "./types"

export interface CreateRolePermissionCommandParams {
    request: CreateRolePermissionRequest
    userId: string
}

export class CreateRolePermissionCommand {
    constructor(
        readonly params: CreateRolePermissionCommandParams,
    ) {}
}
