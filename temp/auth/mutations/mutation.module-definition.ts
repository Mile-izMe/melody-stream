import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: MutationsConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: MUTATIONS_OPTIONS_TOKEN, 
    OPTIONS_TYPE: MUTATIONS_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .build()
