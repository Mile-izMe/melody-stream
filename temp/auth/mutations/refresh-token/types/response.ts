import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType
} from "@nestjs/graphql"



@ObjectType()
export class RefreshTokenResponseData {
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
export class RefreshTokenResponse extends AbstractGraphQLResponse {
    @Field(() => RefreshTokenResponseData,
        {
            nullable: true,
        })
        data?: RefreshTokenResponseData | null
}
