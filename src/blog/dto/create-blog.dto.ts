import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo não pode estar vazio' })
  conteudo: string;

  @IsOptional()
  @IsString()
  imagem_capa?: string;

  // Recebemos as tags como string (JSON) do FormData
  @IsOptional()
  @IsString()
  tags?: string;

  // O admin_id geralmente pegamos do Token JWT no Controller, 
  // mas deixamos aqui se precisar passar via body
  @IsOptional()
  admin_id?: number;
}