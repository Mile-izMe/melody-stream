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
export class CreatePermissionResponseDataObject {
    @Field(() => PermissionItem)
        permission: PermissionItem
}

@ObjectType()
export class CreatePermissionResponse extends AbstractGraphQLResponse {
    @Field(() => CreatePermissionResponseDataObject, {
        nullable: true,
    })
        data?: CreatePermissionResponseData | null
}

export interface CreatePermissionResponseData {
    permission: PermissionItem
}
