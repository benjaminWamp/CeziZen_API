import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateRessourceTypeDto } from './dto/create-ressource-type.dto';
import { UpdateRessourceTypeDto } from './dto/update-ressource-type.dto';
import { TypeRessourceService } from './ressource-type.service';

@Controller('ressource-type')
export class RessourceTypeController {
  constructor(private readonly typeRessourceService: TypeRessourceService) {}

  @Post()
  async create(@Body() dto: CreateRessourceTypeDto) {
    return await this.typeRessourceService.createRessourceType(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRessourceTypeDto) {
    return await this.typeRessourceService.updateRessourceType(id, dto);
  }

  @Get()
  async findAll() {
    return await this.typeRessourceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.typeRessourceService.findOne(id);
  }

  // DELETE /ressource-types/:id : Supprimer un TypeRessource
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.typeRessourceService.deleteRessourceType(id);
  }
}
