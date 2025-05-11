import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/modules/admins/entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractToken(request);
    if (!token) throw new UnauthorizedException();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret not found in environment variables');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      const user = await this.adminsRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) throw new NotFoundException();
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

export const extractToken = (request: Request): string | null => {
  const authHeader = request.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};
