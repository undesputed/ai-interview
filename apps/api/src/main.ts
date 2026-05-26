import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const DEV_SECRET_FINGERPRINT = 'dev-only-secret-please-replace';

function guardSecrets() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters.');
  }
  if (process.env.NODE_ENV === 'production' && secret.includes(DEV_SECRET_FINGERPRINT)) {
    throw new Error(
      'JWT_SECRET is still the development placeholder. Refusing to boot in production.',
    );
  }
}

async function bootstrap() {
  guardSecrets();
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  // Trust the loopback proxy chain so req.ip reflects the originating client
  // when behind a docker network / load balancer. Adjust per-deploy.
  app.getHttpAdapter().getInstance().set('trust proxy', 'loopback');

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cookieParser());

  // CORS — credentials required for httpOnly cookies.
  const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
  app.enableCors({
    origin: webOrigin.split(',').map((s) => s.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Lock down request bodies. Routes use Zod pipes for shape; this only
  // strips unexpected fields if a controller uses class-validator DTOs later.
  // (Kept minimal — Zod is the source of truth for auth shapes.)

  const port = Number(process.env.PORT ?? 8787);
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}`);
}

bootstrap();
