import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class customException {
  static fail(errorString: string, status = HttpStatus.BAD_REQUEST) {
    throw new HttpException(
      {
        statusCode: status,
        message: errorString,
        custom: true,
      },
      status,
    );
  }
}
