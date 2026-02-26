import { PartialType } from '@nestjs/mapped-types';
import { CreateMemorialDto } from './create-memorial.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMemorialDto extends PartialType(CreateMemorialDto) {
  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  autoras?: string;

  @IsOptional()
  @IsString()
  revisao?: string;
}