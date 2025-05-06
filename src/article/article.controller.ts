import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { validatePagination } from 'src/utils/pageQueryhandeler';
import {
  ArticleType,
} from 'src/utils/types/PrismaApiModel.type';

@Controller('Article')
export class ArticleController {
  constructor(private ArticleService: ArticleService) {}

  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<ApiReturns<ArticleType | null>> {
    return this.ArticleService.create(createArticleDto);
  }

  //Régler le problème de type incompréhensible
  @Get('/citizen/:citizenId')
  findCitizenArticles(
    @Param('citizenId') citizenId: number,
  ): Promise<ApiReturns<unknown> | null> {
    return this.ArticleService.findCitizenArticle(citizenId);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: string,
    @Query('sortBy') sortBy: 'asc' | 'desc' = 'asc',
  ): Promise<ApiReturns<Array<Omit<ArticleType, 'step'>> | null>> {
    const { page: pageNumber, perPage: perPageNumber } = validatePagination(
      page,
      perPage,
    );

    return this.ArticleService.findAll(
      pageNumber,
      perPageNumber,
      orderBy,
      sortBy,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiReturns<ArticleType | null>> {
    return this.ArticleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ApiReturns<Omit<ArticleType, 'step'>>> {
    return this.ArticleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string | { data: boolean; message: string }> {
    return this.ArticleService.remove(id);
  }
}
