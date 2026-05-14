import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GetUserPermissionsQuery,
} from "./get-user-permissions.query"
import {
    GetUserPermissionsResponseData,
} from "./types"

@Injectable()
export class GetUserPermissionsService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(): Promise<GetUserPermissionsResponseData> {
        return this.queryBus.execute(
            new GetUserPermissionsQuery(),
        )
    }
}
