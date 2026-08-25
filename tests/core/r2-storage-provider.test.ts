import { describe, expect, it } from "vitest";
import { R2StorageProvider } from "../../src/core/storage/providers/r2-storage-provider";

describe("R2StorageProvider", () => {
  it("writes a scoped image with immutable cache metadata", async () => {
    const writes: Array<{ key: string; options?: { httpMetadata?: { contentType?: string; cacheControl?: string } } }> = [];
    const storage = new R2StorageProvider({
      bucket: {
        async put(key, _bytes, options) { writes.push({ key, options }); },
        async get() { return null; },
      },
      publicOrigin: "https://media.example.test/assets/",
    });

    const stored = await storage.putImage({
      tenantId: "tenant-1",
      prefix: "avatars",
      contentType: "image/png",
      bytes: new Uint8Array([137, 80, 78, 71]).buffer,
    });

    expect(stored.key).toMatch(/^tenant-1\/avatars\/[0-9a-f-]+\.png$/);
    expect(stored.url).toBe(`https://media.example.test/assets/${stored.key}`);
    expect(writes).toEqual([{
      key: stored.key,
      options: { httpMetadata: { contentType: "image/png", cacheControl: "public, max-age=31536000, immutable" } },
    }]);
  });

  it("rejects unsupported images before they reach R2", async () => {
    let writes = 0;
    const storage = new R2StorageProvider({
      bucket: {
        async put() { writes += 1; },
        async get() { return null; },
      },
      publicOrigin: "https://media.example.test/",
    });

    await expect(storage.putImage({
      tenantId: "tenant-1",
      prefix: "avatars",
      contentType: "image/svg+xml",
      bytes: new ArrayBuffer(4),
    })).rejects.toMatchObject({ code: "VALIDATION" });

    expect(writes).toBe(0);
  });
});
