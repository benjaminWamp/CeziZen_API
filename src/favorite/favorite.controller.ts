import { Controller, Post, Body, Delete, Get, Param } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { FavoriteType } from 'src/utils/types/PrismaApiModel.type';

@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get('/citizen/:citizenId')
  async getFavoritesForClient(
    @Param('citizenId') citizenId: string,
  ): Promise<ApiReturns<FavoriteType[]> | undefined> {
    return await this.favoriteService.getFavoritesFromCitizen(citizenId);
  }

  @Post()
  async addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    return await this.favoriteService.createFavorite(createFavoriteDto);
  }

  @Delete(':favoriteId')
  async removeFavorite(@Param('favoriteId') favoriteId: string) {
    return await this.favoriteService.removeFavorite(favoriteId);
  }
}
