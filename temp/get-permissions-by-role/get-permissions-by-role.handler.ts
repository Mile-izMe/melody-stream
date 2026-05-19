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
    toRoleItem,
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
    ): Promise<GetPermissionsByRoleResponseData> {
        const roles = await this.prisma.role.findMany({
            orderBy: {
                name: "asc",
            },
            include: {
                users: true,
                permissions: {
                    include: {
                        permission: true,
                    },
                    orderBy: {
                        permission: {
                            name: "asc",
                        },
                    },
                },
            },
        })

        return {
            roles: roles.map((role) => {
                const permissions = role.permissions.map((item) => toPermissionItem(item.permission))

                return {
                    role: toRoleItem(role),
                    permissions,
                    permissionCount: permissions.length,
                    userCount: role.users.length,
                }
            }),
        }
    }
}
