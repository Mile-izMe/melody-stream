import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: PermissionsConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: PERMISSIONS_OPTIONS_TOKEN,
    OPTIONS_TYPE: PERMISSIONS_OPTIONS_TYPE,
} =
    new ConfigurableModuleBuilder()
        .build()
