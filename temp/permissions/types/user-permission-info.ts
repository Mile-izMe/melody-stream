import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    PermissionItem,
} from "./permission-item"

@ObjectType()
export class UserPermissionInfo {
    @Field(() => String)
        userId: string

    @Field(() => String)
        username: string

    @Field(() => String)
        email: string

    @Field(() => [PermissionItem])
        permissions: Array<PermissionItem>
}

export interface UserPermissionInfoSource {
    id: string
    username: string
    email: string
    roles?: Array<{
        role: {
            permissions: Array<{
                permission: {
                    id: string
                    name: string
                    createdAt: Date
                    updatedAt: Date
                }
            }>
        }
    }>
}

export function toUserPermissionInfo(source: UserPermissionInfoSource): UserPermissionInfo {
    const permissionSet = new Set<string>()
    const permissions: PermissionItem[] = []

    if (source.roles) {
        for (const userRole of source.roles) {
            for (const rolePermission of userRole.role.permissions) {
                if (!permissionSet.has(rolePermission.permission.id)) {
                    permissionSet.add(rolePermission.permission.id)
                    permissions.push({
                        id: rolePermission.permission.id,
                        name: rolePermission.permission.name,
                        createdAt: rolePermission.permission.createdAt,
                        updatedAt: rolePermission.permission.updatedAt,
                    })
                }
            }
        }
    }

    return {
        userId: source.id,
        username: source.username,
        email: source.email,
        permissions,
    }
}
