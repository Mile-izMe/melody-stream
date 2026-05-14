import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    PermissionItem,
} from "../../../types"

@ObjectType()
export class GetPermissionsByRoleResponseDataObject {
    @Field(() => [PermissionItem])
        permissions: Array<PermissionItem>
}

@ObjectType()
export class GetPermissionsByRoleResponse extends AbstractGraphQLResponse {
    @Field(() => GetPermissionsByRoleResponseDataObject, {
        nullable: true,
    })
        data?: GetPermissionsByRoleResponseData | null
}

export interface GetPermissionsByRoleResponseData {
    permissions: Array<PermissionItem>
}
