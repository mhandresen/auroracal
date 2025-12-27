import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LoginDTO, LoginDtoSchema } from './dto/login.dto';
import { RegisterDTO, RegisterSchema } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto: LoginDTO = LoginDtoSchema.parse(body);

    const result = await this.auth.login(dto);
    if (!result) throw new UnauthorizedException('Invalid credentials');

    res.cookie('sid', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { user: result.user };
  }

  @Post('register')
  async register(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto: RegisterDTO = RegisterSchema.parse(body);

    const result = await this.auth.register(dto);

    res.cookie('sid', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { user: result.user, tenant: result.tenant };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const sid = req.cookies?.sid as string | undefined;
    const result = await this.auth.me(sid);
    if (!result) throw new UnauthorizedException();
    return result;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sid = req.cookies?.sid as string | undefined;

    await this.auth.logout(sid);

    res.clearCookie('sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { ok: true };
  }

  @Post('__bootstrap')
  async bootstrap() {
    return this.auth.bootstrap();
  }
}
