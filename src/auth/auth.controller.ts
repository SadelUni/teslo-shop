import { Controller, Get, Post, Body,  UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto, UpdateAuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from "./decorators/get-user.decorator"
import { Auth } from './entities/user.entity';
import { GetRowRequest } from './decorators/get-raw.decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { META_ROLES, RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interface/valid-roles';
import { AuthDecorator } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginCreateDto: LoginAuthDto) {
    return this.authService.login(loginCreateDto);
  }

  @Get("private")
  @UseGuards(AuthGuard())
  getTestingPrivateRoute(
    @GetUser() user: Auth,
    @GetRowRequest() req: Request
  ) {


    console.log(req);
    return {
      message: "This is a private route",
      user

    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  getTestingPrivateRoute2(
    @GetUser() user: Auth,
  ) {
    return {
      message: "This is a private route",
      user

    }
  }

  @Get('private3')
  @AuthDecorator(ValidRoles.admin)
  getTestingPrivateRoute3(
    @GetUser() user: Auth,
  ) {
    return {
      message: "This is a private route",
      user

    }
  }

  @Get('check-auth-status')
  @AuthDecorator()
  checkAuthStatus(
    @GetUser() user: Auth

  ) {
   
    return this.authService.checkAuthStatus(user);
  }



  






}
