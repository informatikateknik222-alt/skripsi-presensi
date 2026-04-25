import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'SUPER_SECRET_KEY_FOR_JWT', // Sangat disarankan dipindah ke .env nanti
    });
  }

  async validate(payload: any) {
    // Return data yang akan di-inject ke dalam Object `req.user`
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
