import {
    GetUserByIdQuery
} from "@features/api/graphql/user/queries"
import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    envConfig
} from "@modules/env/config"
import {
    RedisService
} from "@modules/native"
import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from "@nestjs/cqrs"
import {
    JwtService
} from "@nestjs/jwt"
import {
    AuthService,
} from "../../auth.service"
import {
    JwtPayload
} from "../../types"
import {
    RefreshTokenCommand
} from "./refresh-token.command"
import {
    RefreshTokenResponseData
} from "./types"

@CommandHandler(RefreshTokenCommand)
@Injectable()
export class RefreshTokenHandler
    extends ICQRSHandler<RefreshTokenCommand, RefreshTokenResponseData>
    implements ICommandHandler<RefreshTokenCommand, RefreshTokenResponseData> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly queryBus: QueryBus,
        private readonly authService: AuthService,
         private readonly redisService: RedisService,
    ) {
        super()
    }

    protected override async process(
        command: RefreshTokenCommand,
    ): Promise<RefreshTokenResponseData> {
        const {
            request,
        } = command.params

        /**
        * REFRESH TOKEN FLOW: Detection
        */
        try {
            // 1. Decode token not verify time to get in4 first
            const decoded = this.jwtService.decode(request.refreshToken) as JwtPayload
            if (!decoded) throw new UnauthorizedException()
        
            const redisKey = `rt:${decoded.sub}:${request.deviceId}`
            const currentRtInRedis = await this.redisService.get(redisKey)
        
            // REUSE DETECTION
            // If token send not match with the "latest" token in Redis
            // Meaning the old RT has been used before -> There's an attempt to reuse a leaked RT
            if (currentRtInRedis !== request.refreshToken) {
                await this.redisService.del(redisKey) // Immediately revoke
                console.log(`Potential Refresh Token Reuse Attack detected for User: ${decoded.sub}`)
                throw new ForbiddenException("Access Denied - Potential Security Breach")
            }
        
            // 2. Verify token (expiration, signature)
            await this.jwtService.verifyAsync(request.refreshToken,
                {
                    secret: envConfig().auth.jwt.rtSecret 
                })
        
            // 3. Get latest user information (to prevent role/permission changes not reflected)
            const userResult = await this.queryBus.execute(
                new GetUserByIdQuery({
                    request: {
                        id: decoded.sub,
                    },
                }),
            )
        
            const user = userResult.data
            if (!user) {
                throw new UnauthorizedException("Session expired or invalid")
            }
              
            // 4. Generate new token pair (rotate)
            return this.authService.generateTokenPair(
                user.id,
                user.roles,
                user.permissions,
                request.deviceId,
            )
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Unknown error"
            console.log(`Refresh failed: ${errorMessage}`)
            throw new UnauthorizedException("Session expired or invalid")
        }
    }

}