import {
    Field,
    ObjectType,
} from "@nestjs/graphql"

@ObjectType()
export class PermissionItem {
    @Field(() => String)
        id: string

    @Field(() => String)
        name: string

    @Field(() => Date)
        createdAt: Date

    @Field(() => Date)
        updatedAt: Date
}

export interface PermissionItemSource {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export function toPermissionItem(source: PermissionItemSource): PermissionItem {
    return {
        id: source.id,
        name: source.name,
        createdAt: source.createdAt,
        updatedAt: source.updatedAt,
    }
}
