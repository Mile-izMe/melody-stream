import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    LoginCommand,
    LoginParams,
} from "./login.command"
import {
    LoginResponseData,
} from "./types"

@Injectable()
export class LoginService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: LoginParams,
    ): Promise<LoginResponseData> {
        return this.commandBus.execute(
            new LoginCommand(params),
        )
    }
}
