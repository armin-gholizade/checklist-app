import assert from "node:assert/strict";
const base = process.env.TEST_API_URL;
if (!base)
  throw new Error(
    "Set TEST_API_URL to an isolated running API. This test creates two test users.",
  );
let calls = 0;
async function req(path, method = "GET", body, cookie = "", status = 200) {
  const r = await fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await r.json();
  assert.equal(
    r.status,
    status,
    method + " " + path + " " + JSON.stringify(data),
  );
  calls++;
  return { data, cookie: r.headers.get("set-cookie")?.split(";")[0] };
}
const suffix = Date.now().toString(36),
  password = "TestPassword123!";
const a = await req(
  "/auth/register",
  "POST",
  { username: "owner_" + suffix, password },
  "",
  201,
);
const b = await req(
  "/auth/register",
  "POST",
  { username: "other_" + suffix, password },
  "",
  201,
);
const ca = a.cookie,
  cb = b.cookie;
await req("/lists", "GET", undefined, "", 401);
const list = (
  await req(
    "/lists",
    "POST",
    { title: "Test list", description: "Description" },
    ca,
    201,
  )
).data;
const l = "/lists/" + list.id;
const first = (
  await req(
    l + "/items",
    "POST",
    {
      title: "One",
      notes: "Remember details",
      priority: "HIGH",
      dueDate: "2026-12-31",
    },
    ca,
    201,
  )
).data;
const second = (await req(l + "/items", "POST", { title: "Two" }, ca, 201))
  .data;
assert.equal(first.notes, "Remember details");
assert.equal(second.priority, "NORMAL");
await req(
  l + "/items",
  "POST",
  { title: "Invalid", dueDate: "2026-02-30" },
  ca,
  400,
);
await req(
  l + "/items",
  "POST",
  { title: "Invalid", priority: "SUPER" },
  ca,
  400,
);
await req(l + "/items/" + first.id, "PATCH", { title: null }, ca, 400);
await req(l, "GET", undefined, cb, 404);
await req(l + "/items/" + first.id, "PATCH", { completed: true }, cb, 404);
await req(
  l + "/items/reorder",
  "PATCH",
  { ids: [second.id, first.id] },
  cb,
  404,
);
await req(l + "/items/reorder", "PATCH", { ids: [second.id] }, ca, 409);
await req(
  l + "/items/reorder",
  "PATCH",
  { ids: [second.id, second.id] },
  ca,
  400,
);
await req(l + "/items/reorder", "PATCH", { ids: [second.id, first.id] }, ca);
let loaded = (await req(l, "GET", undefined, ca)).data;
assert.deepEqual(
  loaded.items.map((i) => i.id),
  [second.id, first.id],
);
await req(
  l + "/items/" + first.id,
  "PATCH",
  {
    title: "Edited",
    completed: true,
    notes: "Updated",
    priority: "LOW",
    dueDate: null,
  },
  ca,
);
await req(l + "/items/" + first.id, "DELETE", undefined, ca);
loaded = (await req(l, "GET", undefined, ca)).data;
assert.equal(loaded.items.length, 1);
await req(l + "/items/" + first.id + "/restore", "POST", {}, cb, 404);
await req(l + "/items/" + first.id + "/restore", "POST", {}, ca, 201);
loaded = (await req(l, "GET", undefined, ca)).data;
const restored = loaded.items.find((i) => i.id === first.id);
assert.equal(restored.title, "Edited");
assert.equal(restored.notes, "Updated");
assert.equal(restored.completed, true);
assert.equal(restored.dueDate, null);
assert.equal(restored.priority, "LOW");
await req(l, "PATCH", { archived: true }, ca);
await req(l + "/items", "POST", { title: "Denied" }, ca, 409);
assert.equal(
  (await req("/lists", "GET", undefined, ca)).data.find((x) => x.id === list.id)
    .archived,
  true,
);
await req(l, "PATCH", { archived: false }, ca);
await req(l, "DELETE", undefined, ca);
await req(l, "GET", undefined, ca, 404);
await req(l + "/restore", "POST", {}, cb, 404);
await req(l + "/restore", "POST", {}, ca, 201);
loaded = (await req(l, "GET", undefined, ca)).data;
assert.equal(loaded.items.length, 2);
assert.equal(loaded.description, "Description");
if (process.env.TEST_LEGACY === "1") {
  const legacy = await req(
    "/auth/login",
    "POST",
    { username: "legacy", password: "Legacy123!" },
    "",
    201,
  );
  assert.equal(
    (await req("/lists", "GET", undefined, legacy.cookie)).data[0].items.length,
    2,
  );
}
console.log(
  `PASS ${calls} API checks: registration, authorization, fields, validation, persisted reorder, soft delete/restore, archive, legacy data`,
);
