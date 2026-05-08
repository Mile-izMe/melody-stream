import {
    InputType, Field 
} from "@nestjs/graphql"

@InputType({
    description: "Login request with credentials and device context.",
})
export class LoginRequest {
    @Field(() => String,
        {
            description: "User email.",
        })
        email: string

    @Field(() => String,
        {
            description: "User password.",
        })
        password: string

    @Field(() => String,
        {
            description: "Device identifier used for refresh token rotation.",
        })
        deviceId: string
}