import { PartialType } from '@nestjs/mapped-types';
import { CreateRessourceTypeDto } from './create-ressource-type.dto';

export class UpdateRessourceTypeDto extends PartialType(CreateRessourceTypeDto) {
    name?: string | undefined;
}
