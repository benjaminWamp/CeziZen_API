import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CitizenService } from './citizen.service';
import {
  CreateCitizenDto,
  CreateCitizenwithClerkDTo,
} from './dto/create-citizen.dto';
import {
  UpdateCitizenCredentialsDto,
  UpdateCitizenDto,
} from './dto/update-citizen.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { validatePagination } from 'src/utils/pageQueryhandeler';
import { CitizenType } from 'src/utils/types/PrismaApiModel.type';

@Controller('citizen')
export class CitizenController {
  constructor(private citizenService: CitizenService) {}

  @Post('clerk')
  createWithClerk(
    @Body() createCitizenDto: CreateCitizenwithClerkDTo,
  ): Promise<ApiReturns<CitizenType | null>> {
    return this.citizenService.createWithClerk(createCitizenDto);
  }

  @Post()
  create(
    @Body() createCitizenDto: CreateCitizenDto,
  ): Promise<ApiReturns<CitizenType | null>> {
    return this.citizenService.create(createCitizenDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: string,
    @Query('sortBy') sortBy: 'asc' | 'desc' = 'asc',
  ): Promise<ApiReturns<CitizenType[] | null>> {
    const { page: pageNumber, perPage: perPageNumber } = validatePagination(
      page,
      perPage,
    );

    return this.citizenService.findAll(
      pageNumber,
      perPageNumber,
      orderBy,
      sortBy,
    );
  }

  @Get('clerk/:id')
  findOneFromClerk(
    @Param('id') clerkId: string,
  ): Promise<ApiReturns<CitizenType | null>> {
    return this.citizenService.findOneFromClerk(clerkId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiReturns<CitizenType | null>> {
    return this.citizenService.findOne(id);
  }

  @Patch('/credentials')
  updateCredentials(
    @Body() updateCitizenDto: UpdateCitizenCredentialsDto,
  ): Promise<Record<'message', string>> {
    return this.citizenService.updateCredentials(updateCitizenDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCitizenDto: UpdateCitizenDto,
  ): Promise<ApiReturns<CitizenType>> {
    return this.citizenService.update(id, updateCitizenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string | { message: string }> {
    return this.citizenService.remove(id);
  }
}
