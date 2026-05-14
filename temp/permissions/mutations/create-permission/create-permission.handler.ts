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
    CreatePermissionCommand,
} from "./create-permission.command"
import {
    CreatePermissionResponseData,
} from "./types"
import {
    toPermissionItem,
} from "../../types"

@CommandHandler(CreatePermissionCommand)
@Injectable()
export class CreatePermissionHandler
    extends ICQRSHandler<CreatePermissionCommand, CreatePermissionResponseData>
    implements ICommandHandler<CreatePermissionCommand, CreatePermissionResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        command: CreatePermissionCommand,
    ): Promise<CreatePermissionResponseData> {
        const {
            request,
            userId,
        } = command.params

        const permission = await this.prisma.permission.create({
            data: {
                name: request.name,
                createdBy: userId,
                updatedBy: userId,
            },
        })

        return {
            permission: toPermissionItem(permission),
        }
    }
}
