import {
    Module,
} from "@nestjs/common"
import {
    AuthService,
} from "../auth.service"
import {
    LoginHandler,
    LoginService,
} from "./login"
import {
    MutationsConfigurableModuleClass
} from "./mutation.module-definition"
import {
    JwtModule,
} from "@nestjs/jwt"
import {
    RegisterHandler,
    RegisterService,
} from "./register"
import {
    RefreshTokenHandler, 
    RefreshTokenService
} from "./refresh-token"


/**
 * Module for the Mutations.
 */
@Module({
    imports: [
        JwtModule.register({
        }),
    ],
    providers: [
        AuthService,
        LoginHandler,
        LoginService,
        RegisterHandler,
        RegisterService,
        RefreshTokenHandler,
        RefreshTokenService,
    ],
    exports: [
        AuthService,
        LoginService,
        RegisterService,
        RefreshTokenService,
    ]
})
export class MutationsModule extends MutationsConfigurableModuleClass {}
