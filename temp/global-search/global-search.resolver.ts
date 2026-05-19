import {
    Args,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    Locale,
} from "@modules/databases"
import {
    UseInterceptors,
} from "@nestjs/common"
import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    GlobalSearchRequest,
} from "./types"
import {
    GlobalSearchResponse,
    GlobalSearchResponseData,
} from "./types"
import {
    GlobalSearchService,
} from "./global-search.service"

@Resolver()
export class GlobalSearchResolver {
    constructor(
        private readonly globalSearchService: GlobalSearchService,
    ) {}

    @GraphQLSuccessMessage({
        [Locale.En]: "Search results fetched successfully",
        [Locale.Vi]: "Tìm kiếm thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => GlobalSearchResponse,
        {
            name: "globalSearch",
            description: "Search for songs and playlists globally.",
        },
    )
    async globalSearch(
        @Args(
            "request",
            {
                description: "Search query with keyword and limit.",
            },
        )
            request: GlobalSearchRequest,
    ): Promise<GlobalSearchResponseData> {
        return this.globalSearchService.execute(request)
    }
}
