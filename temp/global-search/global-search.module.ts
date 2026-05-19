import {
    Module,
} from "@nestjs/common"
import {
    CqrsModule,
} from "@nestjs/cqrs"
import {
    GlobalSearchConfigurableModuleClass,
} from "./global-search.module.definition"
import {
    GlobalSearchResolver,
} from "./global-search.resolver"
import {
    GlobalSearchService,
} from "./global-search.service"
import {
    GlobalSearchHandler,
} from "./global-search.handler"

/**
 * Module for the Global Search.
 */
@Module({
    imports: [CqrsModule],
    providers: [
        GlobalSearchResolver,
        GlobalSearchService,
        GlobalSearchHandler,
    ],
    exports: [GlobalSearchService],
})
export class GlobalSearchModule extends GlobalSearchConfigurableModuleClass {}
