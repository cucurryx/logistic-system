import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Result } from './common/result';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  async login(@Body() body): Promise<Result> {
    const username = body.username;
    const password = body.password;
    if (username == undefined || password == undefined) {
      return {code: 10001, message: "need username and password"};
    }
    return this.appService.login(username, password);
  }
}
