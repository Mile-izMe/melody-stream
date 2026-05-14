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
    GetRolesQuery,
} from "./get-roles.query"
import {
    GetRolesResponseData,
} from "./types"
import {
    toRoleItem,
} from "../../types"

@QueryHandler(GetRolesQuery)
@Injectable()
export class GetRolesHandler
    extends ICQRSHandler<GetRolesQuery, GetRolesResponseData>
    implements IQueryHandler<GetRolesQuery, GetRolesResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
    ): Promise<GetRolesResponseData> {
        const roles = await this.prisma.role.findMany({
            orderBy: {
                name: "asc",
            },
        })

        return {
            roles: roles.map(toRoleItem),
        }
    }
}
