import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: MutationsConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: PERMISSIONS_MUTATIONS_OPTIONS_TOKEN,
    OPTIONS_TYPE: PERMISSIONS_MUTATIONS_OPTIONS_TYPE,
} =
    new ConfigurableModuleBuilder()
        .build()
