import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler,
    QueryHandler,
} from "@nestjs/cqrs"
import {
    ElasticsearchService,
} from "@modules/elasticsearch/elasticsearch.service"
import {
    PrismaService,
} from "@modules/databases"
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    GlobalSearchQuery,
} from "./global-search.query"
import {
    GlobalSearchResponseData,
} from "./types"

@QueryHandler(GlobalSearchQuery)
@Injectable()
export class GlobalSearchHandler
    extends ICQRSHandler<GlobalSearchQuery, GlobalSearchResponseData>
    implements IQueryHandler<GlobalSearchQuery, GlobalSearchResponseData> {
    constructor(
        private readonly elasticsearchService: ElasticsearchService,
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        query: GlobalSearchQuery,
    ): Promise<GlobalSearchResponseData> {
        const {
            request,
        } = query.params
        const {
            keyword,
            limit = 5,
        } = request

        // Return empty if keyword is empty
        if (!keyword || keyword.trim() === "") {
            return {
                songs: [],
                playlists: [],
                users: [],
            }
        }

        // Search songs, playlists, and users in parallel
        const [songsResult,
            playlistsResult,
            usersResult] = await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.elasticsearchService.search<any>(
                "Song",
                {
                    query: {
                        multi_match: {
                            query: keyword,
                            fields: [
                                "title",
                                "artist",
                                "album",
                            ],
                        },
                    },
                    from: 0,
                    size: limit,
                },
            ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.elasticsearchService.search<any>(
                "Playlist",
                {
                    query: {
                        multi_match: {
                            query: keyword,
                            fields: [
                                "name",
                            ],
                        },
                    },
                    from: 0,
                    size: limit,
                },
            ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.elasticsearchService.search<any>(
                "User",
                {
                    query: {
                        multi_match: {
                            query: keyword,
                            fields: [
                                "username",
                                "email",
                            ],
                        },
                    },
                    from: 0,
                    size: limit,
                },
            ),
        ])

        return {
            songs: songsResult.data,
            playlists: playlistsResult.data,
            users: usersResult.data,
        }
    }
}
