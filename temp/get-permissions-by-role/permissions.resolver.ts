import {
    Args,
    Mutation,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    CurrentUser,
} from "@modules/common"
import {
    Locale,
} from "@modules/databases"
import {
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
    GetPermissionsResponse,
    GetPermissionsResponseData,
    GetPermissionsService,
} from "./queries/get-permissions"
import {
    GetPermissionsByRoleResponse,
    GetPermissionsByRoleResponseData,
    GetPermissionsByRoleService,
} from "./queries/get-permissions-by-role"
import {
    GetUserPermissionsResponse,
    GetUserPermissionsResponseData,
    GetUserPermissionsService,
} from "./queries/get-user-permissions"

@Resolver()
// @UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsResolver {
    constructor(
        private readonly createPermissionService: CreatePermissionService,
        private readonly createRolePermissionService: CreateRolePermissionService,
        private readonly getRolesService: GetRolesService,
        private readonly getUserPermissionsService: GetUserPermissionsService,
        private readonly getPermissionsService: GetPermissionsService,
        private readonly getPermissionsByRoleService: GetPermissionsByRoleService,
    ) {}

    // @CheckPermissions(PermissionName.GetRole)
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

    // @CheckPermissions(PermissionName.GetAllPermissions)
    @GraphQLSuccessMessage({
        [Locale.En]: "Permissions fetched successfully",
        [Locale.Vi]: "Lấy danh sách permissions thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => GetPermissionsResponse,
        {
            name: "permissions",
            description: "Lists all permissions available in the system.",
        },
    )
    async permissions(): Promise<GetPermissionsResponseData> {
        return this.getPermissionsService.execute()
    }

    // @CheckPermissions(PermissionName.GetPermissionByRole)
    @GraphQLSuccessMessage({
        [Locale.En]: "Role permission summaries fetched successfully",
        [Locale.Vi]: "Lấy danh sách tổng hợp permissions theo role thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => GetPermissionsByRoleResponse,
        {
            name: "permissionsByRole",
            description: "Lists each role with its permissions and counts of permissions and users.",
        },
    )
    async permissionsByRole(
    ): Promise<GetPermissionsByRoleResponseData> {
        return this.getPermissionsByRoleService.execute()
    }

    // @CheckPermissions(PermissionName.GetUserPermissions)
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

    // @CheckPermissions(PermissionName.CreatePermissions)
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

    // @CheckPermissions(PermissionName.CreateRolePermissions)
    @Mutation(
        () => CreateRolePermissionResponse,
        {
            name: "createRolePermission",
            description: "Assigns one or many permissions to one or many roles.",
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
            message: "Permissions assigned to roles successfully",
            data,
        }
    }
}
