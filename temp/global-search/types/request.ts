import {
    Field,
    InputType,
} from "@nestjs/graphql"

@InputType({
    description: "Request for global search across songs, playlists.",
})
export class GlobalSearchRequest {
    @Field(() => String, {
        description: "Keyword to search for.",
    })
        keyword: string

    @Field(() => Number, {
        nullable: true,
        description: "Maximum number of results per entity.",
    })
        limit?: number
}