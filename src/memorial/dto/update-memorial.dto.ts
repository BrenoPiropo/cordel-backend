import { PartialType } from '@nestjs/mapped-types';
import { CreateMemorialDto } from './create-memorial.dto';

// O PartialType faz com que todos os campos do CreateMemorialDto
// sejam opcionais (?) no momento do Update
export class UpdateMemorialDto extends PartialType(CreateMemorialDto) {}