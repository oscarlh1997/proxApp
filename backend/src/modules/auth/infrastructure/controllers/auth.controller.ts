import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { AuthService } from '../../application/auth.service';

const trimLower = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value);

class RegisterBody {
  @Transform(trimLower) @IsString() @Length(3, 30)
  @Matches(/^[a-z0-9_.]+$/, { message: 'El usuario solo puede tener letras, números, punto y guion bajo' })
  username: string;

  @Transform(trimLower) @IsEmail({}, { message: 'Email no válido' })
  email: string;

  @IsString() @Length(6, 100, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional() @IsString() @Length(1, 100)
  displayName?: string;
}

class LoginBody {
  @Transform(trimLower) @IsEmail({}, { message: 'Email no válido' })
  email: string;

  @IsString()
  password: string;
}

@ApiTags('auth')
@Controller('api/auth')
// Más estricto que el límite global: frena fuerza bruta de contraseñas
@Throttle({ default: { limit: 10, ttl: 60000 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginBody) {
    return this.authService.login(body);
  }
}
