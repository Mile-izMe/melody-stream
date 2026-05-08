import {
    Injectable,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import {
    PrismaService,
} from "@modules/databases"
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    RegisterCommand,
} from "./register.command"
import {
    RegisterResponseData,
} from "./types"

@CommandHandler(RegisterCommand)
@Injectable()
export class RegisterHandler
    extends ICQRSHandler<RegisterCommand, RegisterResponseData>
    implements ICommandHandler<RegisterCommand, RegisterResponseData> {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    protected override async process(
        command: RegisterCommand,
    ): Promise<RegisterResponseData> {
        const {
            request,
        } = command.params

        const user = await this.prisma.user.create({
            data: {
                username: request.username,
                email: request.email,
                password: request.password,
            },
        })

        return {
            id: user.id,
            username: user.username,
            email: user.email,
        }
    }
}
