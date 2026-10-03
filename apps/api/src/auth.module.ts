import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController, AuthGuard } from "./auth";
import { DatabaseModule } from "./database.module";
@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret || secret.length < 32 || secret.startsWith("replace-"))
          throw new Error("Set a random JWT_SECRET of at least 32 characters");
        return { secret, signOptions: { expiresIn: "1d" } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
