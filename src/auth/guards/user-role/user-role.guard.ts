import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Auth } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {


  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user = req.user as Auth;

    if (!roles) {
      return true;
    }

    if (roles.length === 0) {
      return true;
    }


    if (!user) {
      throw new BadRequestException("User not found");
    }


    for (const role of user.role) {
      if (roles.includes(role)) {
        return true;
      }
    }


    throw new BadRequestException(`User does not have the required roles ${roles}`);





  }
}
