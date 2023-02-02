import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('abc')
  findAll(@MessageBody() data: string): Observable<WsResponse<string>> {
    console.log('接收消息events的数据', data);
    return from(data.split('')).pipe(
      map((item) => ({ event: 'haha', data: item })),
    );
  }

  PublicMessage(event: string, data: any): void {
    this.server.emit(event, data);
  }
}
