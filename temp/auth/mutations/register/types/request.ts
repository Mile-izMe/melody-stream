import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType({
    description: "Request for user registration.",
})
export class RegisterRequest {
    @Field(() => String,
        {
            description: "Username for the account.",
        })
        username: string

    @Field(() => String,
        {
            description: "User email address.",
        })
        email: string

    @Field(() => String,
        {
            description: "User password.",
        })
        password: string
}
