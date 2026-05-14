import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType({
    description: "Request for creating a new permission.",
})
export class CreatePermissionRequest {
    @Field(() => String, {
        description: "Permission name.",
    })
        name: string
}
