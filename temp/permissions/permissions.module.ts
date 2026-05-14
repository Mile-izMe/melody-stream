import {
    Module,
} from "@nestjs/common"
import {
    PermissionsConfigurableModuleClass
} from "./permissions.module-definition"
import {
    PermissionsResolver
} from "./permissions.resolver"
import {
    MutationsModule
} from "./mutations"
import {
    QueriesModule
} from "./queries"

/**
 * Module for the Permissions management.
 */
@Module({
    imports: [
        QueriesModule,
        MutationsModule,
    ],
    providers: [
        PermissionsResolver,
    ]
})
export class PermissionsModule extends PermissionsConfigurableModuleClass {}
