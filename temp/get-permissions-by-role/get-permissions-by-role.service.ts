import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    GetPermissionsByRoleQuery,
} from "./get-permissions-by-role.query"
import {
    GetPermissionsByRoleResponseData,
} from "./types"

@Injectable()
export class GetPermissionsByRoleService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(roleId: string): Promise<GetPermissionsByRoleResponseData> {
        return this.queryBus.execute(
            new GetPermissionsByRoleQuery({
                roleId,
            }),
        )
    }
}
