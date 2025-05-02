import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { InviteType } from 'src/utils/types/PrismaApiModel.type';

@Controller('invite')
export class InviteController {
  constructor(private readonly InviteService: InviteService) {}

  @Post('accept/:inviteId')
  acceptInvite(
    @Param('inviteId') inviteId: string,
  ): Promise<
    ApiReturns<Omit<InviteType, 'ressource' | 'id' | 'updatedAt'> | null>
  > {
    return this.InviteService.acceptInvite(inviteId);
  }

  @Post()
  create(
    @Body() createInviteDto: CreateInviteDto,
  ): Promise<ApiReturns<InviteType | null>> {
    return this.InviteService.create(createInviteDto);
  }

  @Get('/recever/:receverId')
  findReceverInvite(@Param('receverId') id: string) {
    return this.InviteService.findReceverInvite(id);
  }

  @Get('/sender/:senderId')
  findSenderInvite(@Param('senderId') id: string) {
    return this.InviteService.findSenderInvite(id);
  }

  @Get('/citizen/:citizenId')
  findCitizenInvites(@Param('citizenId') citizenId: string) {
    return this.InviteService.findCitizenInvites(citizenId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.InviteService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.InviteService.remove(id);
  }
}
