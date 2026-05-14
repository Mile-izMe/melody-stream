import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    RoleItem,
} from "./role-item"
import {
    PermissionItem,
} from "./permission-item"

@ObjectType()
export class RolePermissionItem {
    @Field(() => String)
        roleId: string

    @Field(() => String)
        permissionId: string

    @Field(() => RoleItem)
        role: RoleItem

    @Field(() => PermissionItem)
        permission: PermissionItem
}

export interface RolePermissionItemSource {
    roleId: string
    permissionId: string
    role: {
        id: string
        name: string
        createdAt: Date
        updatedAt: Date
    }
    permission: {
        id: string
        name: string
        createdAt: Date
        updatedAt: Date
    }
}

export function toRolePermissionItem(source: RolePermissionItemSource): RolePermissionItem {
    return {
        roleId: source.roleId,
        permissionId: source.permissionId,
        role: {
            id: source.role.id,
            name: source.role.name,
            createdAt: source.role.createdAt,
            updatedAt: source.role.updatedAt,
        },
        permission: {
            id: source.permission.id,
            name: source.permission.name,
            createdAt: source.permission.createdAt,
            updatedAt: source.permission.updatedAt,
        },
    }
}
