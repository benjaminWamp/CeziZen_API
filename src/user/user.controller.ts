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
import { UserService } from './user.service';
import { CreateUserDto, CreateUserwithClerkDTo } from './dto/create-user.dto';
import { UpdateUserCredentialsDto, UpdateUserDto } from './dto/update-user.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { validatePagination } from 'src/utils/pageQueryhandeler';
import { UserType } from 'src/utils/types/PrismaApiModel.type';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('clerk')
  createWithClerk(
    @Body() createUserDto: CreateUserwithClerkDTo,
  ): Promise<ApiReturns<UserType | null>> {
    return this.userService.createWithClerk(createUserDto);
  }

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiReturns<UserType | null>> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: string,
    @Query('sortBy') sortBy: 'asc' | 'desc' = 'asc',
  ): Promise<ApiReturns<UserType[] | null>> {
    const { page: pageNumber, perPage: perPageNumber } = validatePagination(
      page,
      perPage,
    );

    return this.userService.findAll(pageNumber, perPageNumber, orderBy, sortBy);
  }

  @Get('clerk/:id')
  findOneFromClerk(
    @Param('id') clerkId: string,
  ): Promise<ApiReturns<UserType | null>> {
    return this.userService.findOneFromClerk(clerkId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiReturns<UserType | null>> {
    return this.userService.findOne(id);
  }

  @Patch('/credentials')
  updateCredentials(
    @Body() updateUserDto: UpdateUserCredentialsDto,
  ): Promise<Record<'message', string>> {
    return this.userService.updateCredentials(updateUserDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiReturns<UserType>> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string | { message: string }> {
    return this.userService.remove(id);
  }
}
