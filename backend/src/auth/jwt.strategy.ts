import { Injectable } from '@nestjs/common';
    import { PassportStrategy } from '@nestjs/passport';
    import { ExtractJwt, Strategy } from 'passport-jwt';

    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
      constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: 'your-secret-key', // Replace with a real secret key
        });
      }

      async validate(payload: any) {
        // Return an object with user ID and username
        return { userId: payload.sub, username: payload.username };
      }
    }
