import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class customException {
  static fail(error: string, status = HttpStatus.BAD_REQUEST) {
    throw new HttpException(error, status);
  }
}
