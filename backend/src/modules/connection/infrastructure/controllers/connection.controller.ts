import { Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
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
  connect(@CurrentUser('id') me: string, @Param('userId', ParseUUIDPipe) targetId: string) {
    return this.connectionService.connect(me, targetId);
  }

  @Get('connections')
  getConnections(@CurrentUser('id') me: string) {
    return this.connectionService.getConnections(me);
  }

  @Get('connections/with/:userId')
  status(@CurrentUser('id') me: string, @Param('userId', ParseUUIDPipe) other: string) {
    return this.connectionService.statusWith(me, other);
  }

  @Put('connections/:requesterId/accept')
  accept(@CurrentUser('id') me: string, @Param('requesterId', ParseUUIDPipe) requesterId: string) {
    return this.connectionService.accept(requesterId, me);
  }

  @Delete('connections/:requesterId')
  reject(@CurrentUser('id') me: string, @Param('requesterId', ParseUUIDPipe) requesterId: string) {
    return this.connectionService.reject(requesterId, me);
  }
}
