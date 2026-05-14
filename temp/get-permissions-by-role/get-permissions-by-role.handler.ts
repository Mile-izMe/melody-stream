import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    PrismaService,
} from "@modules/databases"
import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler,
    QueryHandler,
} from "@nestjs/cqrs"
import {
    GetPermissionsByRoleQuery,
} from "./get-permissions-by-role.query"
import {
    GetPermissionsByRoleResponseData,
} from "./types"
import {
    toPermissionItem,
} from "../../types"

@QueryHandler(GetPermissionsByRoleQuery)
@Injectable()
export class GetPermissionsByRoleHandler
    extends ICQRSHandler<GetPermissionsByRoleQuery, GetPermissionsByRoleResponseData>
    implements IQueryHandler<GetPermissionsByRoleQuery, GetPermissionsByRoleResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        query: GetPermissionsByRoleQuery,
    ): Promise<GetPermissionsByRoleResponseData> {
        const permissions = await this.prisma.permission.findMany({
            where: {
                rolePermissions: {
                    some: {
                        roleId: query.params.roleId,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        })

        return {
            permissions: permissions.map(toPermissionItem),
        }
    }
}
