import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    RegisterCommand,
    RegisterParams,
} from "./register.command"
import {
    RegisterResponseData,
} from "./types"

@Injectable()
export class RegisterService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: RegisterParams,
    ): Promise<RegisterResponseData> {
        return this.commandBus.execute( 
            new RegisterCommand(params),
        )
    }
}
