import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    CreateRolePermissionCommand,
    CreateRolePermissionCommandParams,
} from "./create-role-permission.command"
import {
    CreateRolePermissionResponseData,
} from "./types"

@Injectable()
export class CreateRolePermissionService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: CreateRolePermissionCommandParams,
    ): Promise<CreateRolePermissionResponseData> {
        return this.commandBus.execute(
            new CreateRolePermissionCommand(params),
        )
    }
}
