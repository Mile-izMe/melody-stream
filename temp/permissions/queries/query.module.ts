import {
    Module,
} from "@nestjs/common"
import {
    QueriesConfigurableModuleClass,
} from "./query.module-definition"
import {
    GetRolesHandler,
    GetRolesService,
} from "./get-roles"
import {
    GetUserPermissionsHandler,
    GetUserPermissionsService,
} from "./get-user-permissions"

@Module({
    imports: [],
    providers: [
        GetRolesHandler,
        GetRolesService,
        GetUserPermissionsHandler,
        GetUserPermissionsService,
    ],
    exports: [
        GetRolesService,
        GetUserPermissionsService,
    ],
})
export class QueriesModule extends QueriesConfigurableModuleClass {}
