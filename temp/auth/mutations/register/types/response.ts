import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"

@ObjectType()
export class RegisterResponseData {
    @Field(() => String)
        id: string

    @Field(() => String)
        username: string

    @Field(() => String)
        email: string
}

@ObjectType()
export class RegisterResponse extends AbstractGraphQLResponse {
    @Field(() => RegisterResponseData,
        {
            nullable: true,
        })
        data?: RegisterResponseData | null
}
