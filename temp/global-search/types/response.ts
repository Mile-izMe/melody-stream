import {
    AbstractGraphQLResponse,
} from "@modules/api"
import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    SongsResponseDataObject,
} from "../../songs/queries/songs/types"
import {
    PlaylistItem,
} from "../../playlists/types"
import {
    UserItem,
} from "../../user/queries/shared/user-item"

@ObjectType()
export class GlobalSearchResultDataObject {
    @Field(() => [SongsResponseDataObject], {
        description: "List of songs found",
    })
        songs: SongsResponseDataObject[]

    @Field(() => [PlaylistItem], {
        description: "List of playlists found",
    })
        playlists: PlaylistItem[]

    @Field(() => [UserItem], {
        description: "List of users found",
    })
        users: UserItem[]
}

@ObjectType()
export class GlobalSearchResponse extends AbstractGraphQLResponse {
    @Field(() => GlobalSearchResultDataObject, {
        nullable: true,
    })
        data?: GlobalSearchResultDataObject | null
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GlobalSearchResponseData {
    songs: Array<any>
    playlists: Array<any>
    users: Array<any>
}