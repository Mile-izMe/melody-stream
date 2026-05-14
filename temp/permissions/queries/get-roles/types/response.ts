import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    RoleItem,
} from "../../../types"

@ObjectType()
export class GetRolesResponseDataObject {
    @Field(() => [RoleItem])
        roles: Array<RoleItem>
}

@ObjectType()
export class GetRolesResponse extends AbstractGraphQLResponse {
    @Field(() => GetRolesResponseDataObject, {
        nullable: true,
    })
        data?: GetRolesResponseData | null
}

export interface GetRolesResponseData {
    roles: Array<RoleItem>
}
