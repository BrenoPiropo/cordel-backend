import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo não pode estar vazio' })
  conteudo: string; // Volte para 'conteudo' aqui

  @IsOptional()
  @IsString()
  imagem_capa?: string;

  @IsNumber()
  admin_id: number;
}