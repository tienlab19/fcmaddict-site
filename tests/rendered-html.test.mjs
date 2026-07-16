import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

const pages = [
  {
    path: "/",
    title: "FCMaddict — Trợ lý cầu thủ &amp; đội hình",
    marker: "Mọi quyết định đội hình",
  },
  {
    path: "/privacy",
    title: "Chính sách quyền riêng tư — FCMaddict",
    marker: "Không yêu cầu tài khoản",
  },
  {
    path: "/support",
    title: "Hỗ trợ — FCMaddict",
    marker: "Chúng tôi có thể giúp gì?",
  },
];

for (const page of pages) {
  test(`server-renders ${page.path}`, async () => {
    const response = await render(page.path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, new RegExp(`<title>${page.title}<\\/title>`, "i"));
    assert.match(html, new RegExp(page.marker, "i"));
  });
}

test("publishes App Store metadata and navigation", async () => {
  const response = await render("/");
  const html = await response.text();

  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/tienlab19\.github\.io\/fcmaddict-site\/og\.png"\/>/i,
  );
  assert.match(html, /href="\/privacy"/i);
  assert.match(html, /href="\/support"/i);
  assert.match(html, /mailto:tientran99\.bka@gmail\.com/i);
});
