import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType({
    description: "Request for assigning a permission to a role.",
})
export class CreateRolePermissionRequest {
    @Field(() => String, {
        description: "Role identifier.",
    })
        roleId: string

    @Field(() => String, {
        description: "Permission identifier.",
    })
        permissionId: string
}
