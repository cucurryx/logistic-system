import { Injectable } from '@nestjs/common';
import { enroll } from './application/enroll';
import { Result } from './common/result';

@Injectable()
export class AppService {
  async login(username: string, password: string): Promise<Result> {
    const accounts = [
      { username: 'admin', password: 'adminpw' }
    ];
    for (const each of accounts) {
      if (each.username == username) {
        if (each.password == password) {
          return {code: 200, message: 'ok'};
        } else {
          return {code: 10001, message: 'wrong password'};
        }
      }
    }
    return {code: 10002, message: 'no account'};
  }
}