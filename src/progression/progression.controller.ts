import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import { ProgressionService } from './progression.service';
import { UpdateProgressionDto } from './dto/update-progression.dto';
import { Cron } from '@nestjs/schedule';
import { CreateProgressionDto } from './dto/create-progression.dto';

@Controller('progression')
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Get()
  async getProgression(@Query('citizenId') citizenId: string) {
    return this.progressionService.getProgression(citizenId);
  }

  @Post()
  async create(@Body() createProgressionDto: CreateProgressionDto) {
    return this.progressionService.initializeProgression(createProgressionDto);
  }
  @Put(':id')
  async updateProgression(
    @Param('id') id: string,
    @Body() updateProgressionDto: UpdateProgressionDto,
  ) {
    return this.progressionService.updateProgression(id, updateProgressionDto);
  }

  @Delete('expired')
  async deleteExpiredProgressions() {
    await this.progressionService.deleteProgressionForExpiredRessources();
    return { message: 'Progression expirées supprimées avec succès' };
  }
  @Delete()
  async deleteProgression(@Query('citizenId') citizenId: string) {
    return await this.progressionService.deleteProgression(citizenId);
  }

  @Cron('0 0 * * *') // S'exécute tous les jours à minuit
  async handleCron() {
    await this.progressionService.deleteProgressionForExpiredRessources();
    console.log('Scheduled cleanup of expired progressions executed.');
  }
}
