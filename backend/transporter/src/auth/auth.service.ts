import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FabricClient } from '../application/fabric_client';

@Injectable()
export class AuthService {
    private fabricClient: FabricClient

    constructor(private readonly jwtService: JwtService) {
      this.fabricClient = new FabricClient();
    }

    async validateUser(username: string, pass: string): Promise<any> {
      try {
        await this.fabricClient.enroll(username, pass);
        return { username: username, password: pass };
      } catch (error) {
        console.log(`error: ${error}`);
        return null;
      }
    }

    async login(username: string) {
      const payload = { username: username };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    async register(username: string, password: string) {
      try {
        await this.fabricClient.register(username, password);
        return {code: 200, message: 'ok'};
      } catch (error) {
        console.log(`error: ${error}`);
        return {code: 500, message: `interval error: ${error}`};
      }
    }

    async logOut(username: string) {
      try {
        this.fabricClient.logOut(username);
        return {code: 200, message: 'ok'};
      } catch (error) {
        return {code: 500, message: `error: ${error}`};
      }
    }
}
