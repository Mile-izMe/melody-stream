export interface GetPermissionsByRoleQueryParams {
    roleId: string
}

export class GetPermissionsByRoleQuery {
    constructor(
        readonly params: GetPermissionsByRoleQueryParams,
    ) {}
}
