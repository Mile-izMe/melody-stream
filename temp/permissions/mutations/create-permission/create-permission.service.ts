import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    CreatePermissionCommand,
    CreatePermissionCommandParams,
} from "./create-permission.command"
import {
    CreatePermissionResponseData,
} from "./types"

@Injectable()
export class CreatePermissionService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: CreatePermissionCommandParams,
    ): Promise<CreatePermissionResponseData> {
        return this.commandBus.execute(
            new CreatePermissionCommand(params),
        )
    }
}
