import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Classes auxiliares para validar os objetos dentro do array
class PalavraChaveDto {
  @IsString()
  termo: string;
}

class ReferenciaDto {
  @IsString()
  nome_referencia: string;
}

export class CreateMemorialDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  biografia: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  foto_url?: string;

  @IsOptional()
  @IsString()
  pdf_url?: string;

  @IsNumber()
  admin_id: number;

  // Novos campos adicionados aqui
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PalavraChaveDto)
  palavras_chave?: PalavraChaveDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenciaDto)
  referencias_citadas?: ReferenciaDto[];
}