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
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import {
    CreateRolePermissionCommand,
} from "./create-role-permission.command"
import {
    CreateRolePermissionResponseData,
} from "./types"
import {
    toRolePermissionItem,
} from "../../types"

@CommandHandler(CreateRolePermissionCommand)
@Injectable()
export class CreateRolePermissionHandler
    extends ICQRSHandler<CreateRolePermissionCommand, CreateRolePermissionResponseData>
    implements ICommandHandler<CreateRolePermissionCommand, CreateRolePermissionResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        command: CreateRolePermissionCommand,
    ): Promise<CreateRolePermissionResponseData> {
        const {
            request,
        } = command.params

        const rolePermission = await this.prisma.rolePermission.create({
            data: {
                roleId: request.roleId,
                permissionId: request.permissionId,
            },
            include: {
                role: true,
                permission: true,
            },
        })

        return {
            rolePermission: toRolePermissionItem(rolePermission),
        }
    }
}
