import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUA_CHAVE_SECRETA_MUITO_FORTE', // Deve ser a mesma do AuthModule
    });
  }

  async validate(payload: any) {
    // O que retornarmos aqui será acessível via req.user
    return { userId: payload.sub, email: payload.email };
  }
}