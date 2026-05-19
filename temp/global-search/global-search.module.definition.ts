import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: GlobalSearchConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: GLOBAL_SEARCH_OPTIONS_TOKEN, 
    OPTIONS_TYPE: GLOBAL_SEARCH_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .build()
