import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ConflictException,
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash, hashSync } from "bcryptjs";
import type { Request, Response } from "express";
import { PrismaService } from "./prisma.service";
import { LoginDto } from "./dto";
import { Throttle } from "@nestjs/throttler";
import { Prisma } from "@prisma/client";
export type AuthRequest = Request & { userId: string };
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    try {
      const data = await this.jwt.verifyAsync(req.cookies?.session);
      req.userId = data.sub;
      if (!req.userId) throw new Error();
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
@Controller("auth")
export class AuthController {
  private dummyHash = hashSync("unused-timing-padding", 12);
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}
  private async session(user: { id: string; username: string }, res: Response) {
    const token = await this.jwt.signAsync({ sub: user.id });
    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
      path: "/api",
    });
    return { username: user.username };
  }
  @Post("register")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const passwordHash = await hash(body.password, 12);
    try {
      const user = await this.db.user.create({
        data: { username: body.username, passwordHash },
      });
      return this.session(user, res);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      )
        throw new ConflictException("Username is already taken");
      throw e;
    }
  }
  @Post("login")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.db.user.findUnique({
      where: { username: body.username },
    });
    const valid = await compare(
      body.password,
      user?.passwordHash ?? this.dummyHash,
    );
    if (!user || !valid) throw new UnauthorizedException("Invalid credentials");
    return this.session(user, res);
  }
  @Get("me")
  @UseGuards(AuthGuard)
  async me(@Req() req: AuthRequest) {
    const user = await this.db.user.findUnique({
      where: { id: req.userId },
      select: { username: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
  @Post("logout") logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("session", { path: "/api" });
    return { ok: true };
  }
}
