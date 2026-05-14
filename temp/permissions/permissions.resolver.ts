import {
    Args,
    Mutation,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    CurrentUser,
    JwtAuthGuard,
    PermissionsGuard,
} from "@modules/common"
import {
    Locale,
} from "@modules/databases"
import {
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    CreatePermissionRequest,
    CreatePermissionResponse,
    CreatePermissionService,
} from "./mutations/create-permission"
import {
    CreateRolePermissionRequest,
    CreateRolePermissionResponse,
    CreateRolePermissionService,
} from "./mutations/create-role-permission"
import {
    GetRolesResponse,
    GetRolesResponseData,
    GetRolesService,
} from "./queries/get-roles"
import {
    GetUserPermissionsResponse,
    GetUserPermissionsResponseData,
    GetUserPermissionsService,
} from "./queries/get-user-permissions"

@Resolver()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsResolver {
    constructor(
        private readonly createPermissionService: CreatePermissionService,
        private readonly createRolePermissionService: CreateRolePermissionService,
        private readonly getRolesService: GetRolesService,
        private readonly getUserPermissionsService: GetUserPermissionsService,
    ) {}

    @GraphQLSuccessMessage({
        [Locale.En]: "Roles fetched successfully",
        [Locale.Vi]: "Lấy danh sách roles thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => GetRolesResponse,
        {
            name: "roles",
            description: "Lists all available roles for dropdown selection.",
        },
    )
    async roles(): Promise<GetRolesResponseData> {
        return this.getRolesService.execute()
    }

    @GraphQLSuccessMessage({
        [Locale.En]: "User permissions fetched successfully",
        [Locale.Vi]: "Lấy danh sách permissions của tất cả users thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => GetUserPermissionsResponse,
        {
            name: "allUsersPermissions",
            description: "Lists all permissions for each user (admin only).",
        },
    )
    async allUsersPermissions(): Promise<GetUserPermissionsResponseData> {
        return this.getUserPermissionsService.execute()
    }

    @Mutation(
        () => CreatePermissionResponse,
        {
            name: "createPermission",
            description: "Creates a new permission.",
        },
    )
    async createPermission(
        @Args(
            "request",
            {
                description: "Permission details.",
            },
        )
            request: CreatePermissionRequest,
        @CurrentUser("userId") userId: string,
    ): Promise<CreatePermissionResponse> {
        const data = await this.createPermissionService.execute({
            request,
            userId,
        })

        return {
            success: true,
            message: "Permission created successfully",
            data,
        }
    }

    @Mutation(
        () => CreateRolePermissionResponse,
        {
            name: "createRolePermission",
            description: "Assigns a permission to a role.",
        },
    )
    async createRolePermission(
        @Args(
            "request",
            {
                description: "Role and permission identifiers.",
            },
        )
            request: CreateRolePermissionRequest,
        @CurrentUser("userId") userId: string,
    ): Promise<CreateRolePermissionResponse> {
        const data = await this.createRolePermissionService.execute({
            request,
            userId,
        })

        return {
            success: true,
            message: "Permission assigned to role successfully",
            data,
        }
    }
}
