import {
    GlobalSearchRequest,
} from "./types"

export interface GlobalSearchQueryParams {
    request: GlobalSearchRequest
}

export class GlobalSearchQuery {
    constructor(readonly params: GlobalSearchQueryParams) {}
}
