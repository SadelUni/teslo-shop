import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthDecorator } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interface/valid-roles';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }



  @Get()
 // @AuthDecorator(ValidRoles.superUser)

  executeSeed() {
    return this.seedService.runSeed();
  }


}
