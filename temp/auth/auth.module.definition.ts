import {
    ConfigurableModuleBuilder
} from "@nestjs/common"

export const {
    ConfigurableModuleClass: AuthConfigurableModuleClass, 
    MODULE_OPTIONS_TOKEN: AUTH_OPTIONS_TOKEN, 
    OPTIONS_TYPE: AUTH_OPTIONS_TYPE 
} =
    new ConfigurableModuleBuilder()
        .build()
