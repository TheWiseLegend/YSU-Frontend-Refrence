import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters with uppercase, lowercase, and a number',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  fullNameAr: string;

  @IsString()
  @IsNotEmpty()
  fullNameEn: string;
}
