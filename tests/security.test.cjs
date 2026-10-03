const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  ListAccessService,
} = require("../apps/api/dist/lists/list-access.service");
const { AuthGuard } = require("../apps/api/dist/auth");
const { JwtService } = require("@nestjs/jwt");
const { ValidationPipe } = require("@nestjs/common");
const { CreateListDto: ListDto } = require("../apps/api/dist/lists/lists.dto");
const { UpdateItemDto } = require("../apps/api/dist/items/items.dto");
const pipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});
test("Unauthenticated and forged sessions are rejected", async () => {
  const guard = new AuthGuard(
    new JwtService({ secret: "test-secret-not-used-by-app" }),
  );
  for (const cookies of [{}, { session: "forged.token.value" }])
    await assert.rejects(
      () =>
        guard.canActivate({
          switchToHttp: () => ({ getRequest: () => ({ cookies }) }),
        }),
      (e) => e.getStatus() === 401,
    );
});
test("Expired sessions are rejected", async () => {
  const jwt = new JwtService({ secret: "test-secret-not-used-by-app" });
  const guard = new AuthGuard(jwt);
  const token = jwt.sign({ sub: "owner" }, { expiresIn: -1 });
  await assert.rejects(
    () =>
      guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({ cookies: { session: token } }),
        }),
      }),
    (e) => e.getStatus() === 401,
  );
});
test("Ownership lock rejects another user and deleted lists", async () => {
  const access = new ListAccessService();
  const tx = {
    $queryRaw: async () => [],
    checklist: { findFirst: async () => null },
  };
  await assert.rejects(
    () => access.lock(tx, "list", "attacker"),
    (e) => e.getStatus() === 404,
  );
});
test("Blank titles and unexpected owner fields are rejected", async () => {
  for (const value of [{ title: "   " }, { title: "valid", ownerId: "other" }])
    await assert.rejects(
      () => pipe.transform(value, { type: "body", metatype: ListDto }),
      (e) => e.getStatus() === 400,
    );
});
test("Completion must be boolean; item cannot be moved by request", async () => {
  for (const value of [
    { completed: "yes" },
    { title: "valid", listId: "other" },
  ])
    await assert.rejects(
      () => pipe.transform(value, { type: "body", metatype: UpdateItemDto }),
      (e) => e.getStatus() === 400,
    );
});
const { AuthController } = require("../apps/api/dist/auth");
const { Prisma } = require("@prisma/client");
const { compare } = require("bcryptjs");
test("Registration hashes passwords and creates an HttpOnly session", async () => {
  let created, cookie;
  const auth = new AuthController(
    {
      user: {
        create: async ({ data }) => {
          created = data;
          return { id: "new-user", username: data.username };
        },
      },
    },
    new JwtService({ secret: "test-secret-not-used-by-app" }),
  );
  const result = await auth.register(
    { username: "newuser", password: "MyPassword123!" },
    { cookie: (...args) => (cookie = args) },
  );
  assert.equal(result.username, "newuser");
  assert.notEqual(created.passwordHash, "MyPassword123!");
  assert.equal(await compare("MyPassword123!", created.passwordHash), true);
  assert.equal(cookie[0], "session");
  assert.equal(cookie[2].httpOnly, true);
  assert.equal(cookie[2].sameSite, "strict");
  assert.equal(cookie[2].path, "/api");
});
test("Duplicate registration returns conflict and never overwrites an account", async () => {
  const auth = new AuthController(
    {
      user: {
        create: async () => {
          throw new Prisma.PrismaClientKnownRequestError("duplicate", {
            code: "P2002",
            clientVersion: "6.19.3",
          });
        },
      },
    },
    new JwtService({ secret: "test-secret-not-used-by-app" }),
  );
  await assert.rejects(
    () => auth.register({ username: "taken", password: "MyPassword123!" }, {}),
    (e) => e.getStatus() === 409,
  );
});
