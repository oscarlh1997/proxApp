import { Type } from 'class-transformer';
import {
  ArrayMaxSize, IsArray, IsBoolean, IsIn, IsLatitude, IsLongitude, IsOptional, IsString,
  IsUrl, Length, MaxLength, ValidateNested,
} from 'class-validator';
import { RELATIONSHIP_STATUSES, RelationshipStatus } from '../../domain/entities/user-profile';

export class SocialLinkDto {
  @IsString() @Length(1, 30)
  platform: string;

  // Solo http(s): la app abre estos enlaces con Linking.openURL
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) @MaxLength(500)
  url: string;

  @IsOptional() @IsString() @MaxLength(100)
  handle: string = '';
}

export class UpdateProfileBody {
  @IsOptional() @IsString() @Length(1, 100) displayName?: string;
  @IsOptional() @IsString() @MaxLength(300) bio?: string;
  @IsOptional() @IsString() @Length(1, 50) avatarSeed?: string;
  @IsOptional() @IsIn(RELATIONSHIP_STATUSES) relationshipStatus?: RelationshipStatus;
  @IsOptional() @IsBoolean() visible?: boolean;

  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) @Length(1, 50, { each: true })
  interests?: string[];

  @IsOptional() @IsArray() @ArrayMaxSize(10) @ValidateNested({ each: true }) @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}

export class LocationBody {
  @IsLatitude() latitude: number;
  @IsLongitude() longitude: number;
}
