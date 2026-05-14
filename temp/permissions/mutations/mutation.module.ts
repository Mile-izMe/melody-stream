import {
    Module,
} from "@nestjs/common"
import {
    MutationsConfigurableModuleClass,
} from "./mutation.module-definition"
import {
    CreatePermissionHandler,
    CreatePermissionService,
} from "./create-permission"
import {
    CreateRolePermissionHandler,
    CreateRolePermissionService,
} from "./create-role-permission"

@Module({
    imports: [],
    providers: [
        CreatePermissionHandler,
        CreatePermissionService,
        CreateRolePermissionHandler,
        CreateRolePermissionService,
    ],
    exports: [
        CreatePermissionService,
        CreateRolePermissionService,
    ],
})
export class MutationsModule extends MutationsConfigurableModuleClass {}
