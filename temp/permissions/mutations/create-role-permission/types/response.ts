import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    RolePermissionItem,
} from "../../../types"

@ObjectType()
export class CreateRolePermissionResponseDataObject {
    @Field(() => RolePermissionItem)
        rolePermission: RolePermissionItem
}

@ObjectType()
export class CreateRolePermissionResponse extends AbstractGraphQLResponse {
    @Field(() => CreateRolePermissionResponseDataObject, {
        nullable: true,
    })
        data?: CreateRolePermissionResponseData | null
}

export interface CreateRolePermissionResponseData {
    rolePermission: RolePermissionItem
}
