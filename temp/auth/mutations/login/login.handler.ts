import {
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from "@nestjs/cqrs"
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    HashService,
} from "@modules/hash/hash.service"
import {
    AuthService,
} from "../../auth.service"

import {
    LoginCommand,
} from "./login.command"
import {
    LoginResponseData,
} from "./types"
import {
    GetUserByEmailQuery 
} from "@features/api/graphql/user/queries"

@CommandHandler(LoginCommand)
@Injectable()
export class LoginHandler
    extends ICQRSHandler<LoginCommand, LoginResponseData>
    implements ICommandHandler<LoginCommand, LoginResponseData> {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly hashService: HashService,
        private readonly authService: AuthService,
    ) {
        super()
    }

    protected override async process(
        command: LoginCommand,
    ): Promise<LoginResponseData> {
        const {
            request,
        } = command.params

        // 1. Get user by email
        const userResult = await this.queryBus.execute(
            new GetUserByEmailQuery({
                request: {
                    email: request.email,
                },
            }),
        )

        const user = userResult.data
        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // 2. Validate password
        const isMatch = await this.hashService.comparePassword(
            request.password,
            user.password,
        )
        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // 3. Generate and return token pair
        return this.authService.generateTokenPair(
            user.id,
            user.roles,
            user.permissions,
            request.deviceId,
        )
    }

    //* Continue with send Email by emit to activate user (later)
}