import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Int,
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    RoleItem,
    PermissionItem,
} from "../../../types"

@ObjectType()
export class RolePermissionsSummaryItem {
    @Field(() => RoleItem)
        role: RoleItem

    @Field(() => [PermissionItem])
        permissions: Array<PermissionItem>

    @Field(() => Int)
        permissionCount: number

    @Field(() => Int)
        userCount: number
}

@ObjectType()
export class GetPermissionsByRoleResponseDataObject {
    @Field(() => [RolePermissionsSummaryItem])
        roles: Array<RolePermissionsSummaryItem>
}

@ObjectType()
export class GetPermissionsByRoleResponse extends AbstractGraphQLResponse {
    @Field(() => GetPermissionsByRoleResponseDataObject, {
        nullable: true,
    })
        data?: GetPermissionsByRoleResponseData | null
}

export interface GetPermissionsByRoleResponseData {
    roles: Array<RolePermissionsSummaryItem>
}
