import {
    InputType, Field 
} from "@nestjs/graphql"

@InputType({
    description: "Refresh token request.",
})
export class RefreshTokenRequest {
    @Field(() => String,
        {
            description: "The refresh token to be used for obtaining a new access token.",
        })
        refreshToken: string

    @Field(() => String,
        {
            description: "Device identifier used for refresh token rotation.",
        })
        deviceId: string
}