import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    RefreshTokenResponseData
} from "./types"
import {
    RefreshTokenCommand, 
    RefreshTokenParams 
} from "./refresh-token.command"

@Injectable()
export class RefreshTokenService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: RefreshTokenParams,
    ): Promise<RefreshTokenResponseData> {
        return this.commandBus.execute(
            new RefreshTokenCommand(params),
        )
    }
}
