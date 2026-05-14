import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    UserPermissionInfo,
} from "../../../types"

@ObjectType()
export class GetUserPermissionsResponseDataObject {
    @Field(() => [UserPermissionInfo])
        usersPermissions: Array<UserPermissionInfo>
}

@ObjectType()
export class GetUserPermissionsResponse extends AbstractGraphQLResponse {
    @Field(() => GetUserPermissionsResponseDataObject, {
        nullable: true,
    })
        data?: GetUserPermissionsResponseData | null
}

export interface GetUserPermissionsResponseData {
    usersPermissions: Array<UserPermissionInfo>
}
