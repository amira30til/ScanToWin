import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/modules/admins/enums/role.enum';
import { extractToken } from './auth.guard';
import { Admin } from 'src/modules/admins/entities/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractToken(request);

    if (!token) throw new UnauthorizedException();
    const jwtSecret = process.env.JWT_SECRET;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      if (payload.role !== Role.ADMIN) throw new UnauthorizedException();

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractToken(request);

    if (!token) throw new UnauthorizedException();
    const jwtSecret = process.env.JWT_SECRET;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      if (payload.role !== Role.SUPER_ADMIN) throw new UnauthorizedException();

      const id = payload.sub;
      const user = await this.adminsRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException();
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
