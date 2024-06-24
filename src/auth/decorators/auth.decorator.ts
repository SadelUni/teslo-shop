import { UseGuards, applyDecorators } from "@nestjs/common"
import { ValidRoles } from "../interface/valid-roles"
import { RoleProtected } from "./role-protected/role-protected.decorator"
import { UserRoleGuard } from "../guards/user-role/user-role.guard"
import { AuthGuard } from "@nestjs/passport"

export function AuthDecorator(...roles: ValidRoles[]) {

    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard)
    );

}