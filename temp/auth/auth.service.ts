import {
    envConfig
} from "@modules/env"
import {
    RedisService
} from "@modules/native"
import {
    Injectable,
    Logger
} from "@nestjs/common"
import {
    JwtService
} from "@nestjs/jwt"
import {
    JwtPayload
} from "./types/jwt"

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) {}
    private readonly logger = new Logger(AuthService.name)

    /**
    * GENERATE TOKEN PAIR (Rotation support)
    */
    async generateTokenPair(
        userId: string, 
        roles: string[], 
        permissions: string[], 
        deviceId: string
    ) {
        const payload: JwtPayload = {
            sub: userId, roles, permissions, deviceId 
        }

        // Access Token: Short lived (Ex: 15m) to lower risk when token being leaked
        // Refresh Token: Long lived (Ex: 7d)
        const [at,
            rt] = await Promise.all([
            this.jwtService.signAsync(payload,
                {
                    expiresIn: envConfig().auth.jwt.atExpiration,
                    secret: envConfig().auth.jwt.atSecret 
                }),
            this.jwtService.signAsync(payload,
                {
                    expiresIn: envConfig().auth.jwt.rtExpiration,
                    secret: envConfig().auth.jwt.rtSecret 
                }),
        ])

        // STORE & ROTATION IN REDIS
        // Each device has 1 Refresh Token at 1 time
        const redisKey = `rt:${userId}:${deviceId}`
        await this.redisService.set(
            redisKey,
            rt,
            envConfig().auth.jwt.rtExpiration
        ) 

        return {
            accessToken: at, refreshToken: rt 
        }
    }

    /**
    * LOGOUT
     */
    async logout(userId: string, deviceId: string) {
        await this.redisService.del(`rt:${userId}:${deviceId}`)
    }
}