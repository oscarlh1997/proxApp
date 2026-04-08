import { Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { ConnectionService } from '../../application/connection.service';

@ApiTags('connections')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('connect/:userId')
  connect(@CurrentUser('id') me: string, @Param('userId') targetId: string) {
    return this.connectionService.connect(me, targetId);
  }

  @Get('connections')
  getConnections(@CurrentUser('id') me: string) {
    return this.connectionService.getConnections(me);
  }

  @Put('connections/:requesterId/accept')
  accept(@CurrentUser('id') me: string, @Param('requesterId') requesterId: string) {
    return this.connectionService.acceptConnection(requesterId, me);
  }
}
