import "reflect-metadata";
import "dotenv/config";
import { Module, ValidationPipe } from "@nestjs/common";
import { NestFactory, APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AuthModule } from "./auth.module";
import { ChecklistsModule } from "./checklists.module";
@Module({
  imports: [
    AuthModule,
    ChecklistsModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
class AppModule {}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT) || 3000, "127.0.0.1");
}
bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
