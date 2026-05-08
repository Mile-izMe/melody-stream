import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType
} from "@nestjs/graphql"



@ObjectType()
export class LoginResponseData {
    @Field(() => String,
        {
            description: "Issued access token.",
        })
        accessToken: string

    @Field(() => String,
        {
            description: "Issued refresh token.",
        })
        refreshToken: string
}

@ObjectType()
export class LoginResponse extends AbstractGraphQLResponse {
    @Field(() => LoginResponseData,
        {
            nullable: true,
        })
        data?: LoginResponseData | null
}
