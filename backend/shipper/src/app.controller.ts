import { Controller, Body, Post, UseGuards, createParamDecorator } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Result } from './common/result';
import { AuthService } from './auth/auth.service';

export const User = createParamDecorator((data, req) => {
  return req.user;
});

@Controller("api")
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post("login")
  async login(@Body() body): Promise<Result> {
    const username = body.username;
    return {
      code: 200,
      message: 'ok',
      data: await this.authService.login(username)
    };
  }

  @UseGuards(AuthGuard('admin'))
  @Post("register")
  async register(@Body() body): Promise<Result> {
    const username = body.username;
    const password = body.password;
    if (username == undefined || password == undefined) {
      return {code: 10001, message: "need username and password"};
    }
    return await this.authService.register(username, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("logout")
  async logOut(@Body() body): Promise<Result> {
    const username = body.username;
    return await this.authService.logOut(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('curr')
  async currUser(@User() user): Promise<Result> {
    return {code: 200, message: 'ok', data: user.username};
  }
}
