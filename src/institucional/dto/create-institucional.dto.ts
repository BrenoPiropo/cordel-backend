import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInstitucionalDto {
  @IsString()
  @IsNotEmpty({ message: 'O título do "Quem Somos" é obrigatório.' })
  about_titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo do "Quem Somos" é obrigatório.' })
  about_conteudo: string;

  @IsString()
  @IsNotEmpty({ message: 'O JSON dos valores é obrigatório.' })
  valores_json: string;
}