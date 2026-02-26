import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateGaleriaDto {
  @IsOptional()
  @IsString()
  legenda?: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['EQUIPE', 'CARROSSEL'])
  tipo: string;

  @IsOptional()
  @IsString()
  url?: string; // Será preenchido pelo Controller após o upload
}