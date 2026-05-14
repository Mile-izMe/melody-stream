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
    GetUserPermissionsQuery,
} from "./get-user-permissions.query"
import {
    GetUserPermissionsResponseData,
} from "./types"
import {
    toUserPermissionInfo,
} from "../../types"

@QueryHandler(GetUserPermissionsQuery)
@Injectable()
export class GetUserPermissionsHandler
    extends ICQRSHandler<GetUserPermissionsQuery, GetUserPermissionsResponseData>
    implements IQueryHandler<GetUserPermissionsQuery, GetUserPermissionsResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
    ): Promise<GetUserPermissionsResponseData> {
        const users = await this.prisma.user.findMany({
            orderBy: {
                username: "asc",
            },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        return {
            usersPermissions: users.map(toUserPermissionInfo),
        }
    }
}
