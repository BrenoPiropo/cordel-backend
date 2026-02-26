import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// Mantemos as classes auxiliares, mas no DTO principal 
// aceitaremos string para compatibilidade com FormData
export class CreateMemorialDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  biografia: string;

  // Mudamos para String por causa do FormData (convertemos no Service)
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;

  @IsOptional()
  @IsString()
  foto_url?: string;

  @IsOptional()
  @IsString()
  pdf_url?: string;

  @IsOptional()
  @IsString()
  autoras?: string;

  @IsOptional()
  @IsString()
  revisao?: string;

  // Recebemos como string para podermos fazer JSON.parse no Service
  @IsOptional()
  @IsString()
  palavras_chave?: string;

  @IsOptional()
  @IsString()
  referencias_citadas?: string;
}