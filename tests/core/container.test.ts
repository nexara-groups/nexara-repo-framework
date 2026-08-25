import { describe, expect, it } from "vitest";
import { createServices } from "../../src/core/container";
import type { CloudflareBindings } from "../../src/core/platform/providers/cloudflare-platform-provider";

const baseEnv: CloudflareBindings = {
  SUPABASE_URL: "https://project.example.test",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  SUPABASE_ANON_KEY: "anon-key",
};

describe("createServices", () => {
  it("requires a verified sender for Resend and SES", () => {
    expect(() => createServices({
      ...baseEnv,
      EMAIL_PROVIDER: "resend",
      RESEND_API_KEY: "resend-api-key",
    })).toThrow("Missing required environment variable: EMAIL_FROM");

    expect(() => createServices({
      ...baseEnv,
      EMAIL_PROVIDER: "ses",
      AWS_SES_REGION: "ap-south-1",
      AWS_SES_ACCESS_KEY_ID: "access-key",
      AWS_SES_SECRET_ACCESS_KEY: "secret-key",
    })).toThrow("Missing required environment variable: EMAIL_FROM");
  });
});
