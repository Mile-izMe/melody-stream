import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GlobalSearchQuery,
} from "./global-search.query"
import {
    GlobalSearchResponseData,
    GlobalSearchRequest,
} from "./types"

@Injectable()
export class GlobalSearchService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(
        request: GlobalSearchRequest,
    ): Promise<GlobalSearchResponseData> {
        return this.queryBus.execute(
            new GlobalSearchQuery({
                request,
            }),
        )
    }
}
