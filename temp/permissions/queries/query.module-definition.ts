import {
    ConfigurableModuleBuilder,
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: QueriesConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN: PERMISSIONS_QUERIES_OPTIONS_TOKEN,
    OPTIONS_TYPE: PERMISSIONS_QUERIES_OPTIONS_TYPE,
} =
    new ConfigurableModuleBuilder()
        .build()
