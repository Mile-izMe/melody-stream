import {
    Args,
    Mutation,
    Resolver
} from "@nestjs/graphql"
import {
    LoginRequest,
    LoginResponse,
    LoginService
} from "./mutations/login"
import {
    RegisterRequest,
    RegisterResponse,
    RegisterService,
} from "./mutations/register"
import {
    RefreshTokenRequest, 
    RefreshTokenResponse, 
    RefreshTokenService
} from "./mutations/refresh-token"

@Resolver()
export class AuthResolver {
    constructor(
        private readonly loginService: LoginService,
        private readonly registerService: RegisterService,
        private readonly refreshTokenService: RefreshTokenService,
    ) { }

    /**
     * Login
     */
    @Mutation(
        () => LoginResponse,
        {
            name: "login",
            description: "Authenticate user with email and password, returning access and refresh tokens.",
        },
    )
    async login(
        @Args(
            "request",
            {
                description: "User credentials and device identifier.",
            },
        )
            request: LoginRequest,
    ): Promise<LoginResponse> {
        const data = await this.loginService.execute({
            request,
        })

        return {
            success: true,
            message: "Login successful",
            data,
        }
    }

    /**
     * Register
     */
    @Mutation(
        () => RegisterResponse,
        {
            name: "register",
            description: "Register a new user with email, password, and display name.",
        },
    )
    async register(
        @Args(
            "request",
            {
                description: "User registration details.",
            },
        )
            request: RegisterRequest,
    ): Promise<RegisterResponse> {
        const data = await this.registerService.execute({
            request,
        })

        return {
            success: true,
            message: "User registered successfully",
            data,
        }
    }

    /**
    * Refresh Token
    */
    @Mutation(
        () => RefreshTokenResponse,
        {
            name: "refreshToken",
            description: "Obtain a new access token using a valid refresh token.",
        },
    )
    async refreshToken(
        @Args(
            "request",
            {
                description: "Refresh token and device identifier for token rotation.",
            },
        )
            request: RefreshTokenRequest,
    ): Promise<RefreshTokenResponse> {
        const data = await this.refreshTokenService.execute({
            request,
        })

        return {
            success: true,
            message: "Token refreshed successfully",
            data,
        }
    }
}