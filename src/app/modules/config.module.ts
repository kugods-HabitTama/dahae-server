import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.${process.env.NODE_ENV}.env`,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'test', 'local'),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRE: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRE: Joi.string().required(),
    JWT_SECRET_KEY: Joi.string().required(),
  }),
});
