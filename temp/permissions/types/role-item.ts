import {
    Field,
    ObjectType,
} from "@nestjs/graphql"

@ObjectType()
export class RoleItem {
    @Field(() => String)
        id: string

    @Field(() => String)
        name: string

    @Field(() => Date)
        createdAt: Date

    @Field(() => Date)
        updatedAt: Date
}

export interface RoleItemSource {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export function toRoleItem(source: RoleItemSource): RoleItem {
    return {
        id: source.id,
        name: source.name,
        createdAt: source.createdAt,
        updatedAt: source.updatedAt,
    }
}
