import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GetRolesQuery,
} from "./get-roles.query"
import {
    GetRolesResponseData,
} from "./types"

@Injectable()
export class GetRolesService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(): Promise<GetRolesResponseData> {
        return this.queryBus.execute(
            new GetRolesQuery(),
        )
    }
}
