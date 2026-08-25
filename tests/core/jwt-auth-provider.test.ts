import { describe, expect, it } from "vitest";
import { JwtAuthProvider } from "../../src/core/auth/providers/jwt-auth-provider";
import type {
  Credential,
  CredentialsRepository,
  NewCredentialInput,
  NewEmailVerificationInput,
  NewPasswordResetInput,
} from "../../src/core/auth/credentials-repository.interface";
import type { TenantContext } from "../../src/core/context";
import { PermissionService } from "../../src/core/rbac";

class MemoryCredentialsRepository implements CredentialsRepository {
  private credential: Credential | null = null;
  private readonly resetTokens = new Map<string, { userId: string; email: string; used: boolean }>();
  private readonly verificationTokens = new Map<string, { userId: string; email: string; used: boolean }>();

  async findByEmail(_tenant: TenantContext, email: string): Promise<Credential | null> {
    return this.credential?.email === email ? this.credential : null;
  }

  async findByUserId(_tenant: TenantContext, userId: string): Promise<Credential | null> {
    return this.credential?.userId === userId ? this.credential : null;
  }

  async create(tenant: TenantContext, input: NewCredentialInput): Promise<Credential> {
    this.credential = { ...input, tenantId: tenant.tenantId, sessionVersion: 0 };
    return this.credential;
  }

  async createPasswordReset(_tenant: TenantContext, input: NewPasswordResetInput): Promise<void> {
    this.resetTokens.set(input.tokenHash, { userId: input.userId, email: input.email, used: false });
  }

  async findUsablePasswordReset(_tenant: TenantContext, tokenHash: string) {
    const token = this.resetTokens.get(tokenHash);
    return token && !token.used ? { userId: token.userId, email: token.email } : null;
  }

  async redeemPasswordReset(
    _tenant: TenantContext,
    tokenHash: string,
    userId: string,
    passwordHash: string,
  ): Promise<boolean> {
    const token = this.resetTokens.get(tokenHash);
    if (!token || token.used || token.userId !== userId || !this.credential) return false;
    token.used = true;
    this.credential = { ...this.credential, passwordHash, sessionVersion: this.credential.sessionVersion + 1 };
    return true;
  }

  async createEmailVerification(_tenant: TenantContext, input: NewEmailVerificationInput): Promise<void> {
    this.verificationTokens.set(input.tokenHash, { userId: input.userId, email: input.email, used: false });
  }

  async findUsableEmailVerification(_tenant: TenantContext, tokenHash: string) {
    const token = this.verificationTokens.get(tokenHash);
    return token && !token.used ? { userId: token.userId, email: token.email } : null;
  }

  async redeemEmailVerification(_tenant: TenantContext, tokenHash: string, userId: string): Promise<boolean> {
    const token = this.verificationTokens.get(tokenHash);
    if (!token || token.used || token.userId !== userId || !this.credential) return false;
    token.used = true;
    this.credential = {
      ...this.credential,
      verifiedAt: "2026-08-25T00:00:00.000Z",
      sessionVersion: this.credential.sessionVersion + 1,
    };
    return true;
  }

  async revokeSessions(_tenant: TenantContext, userId: string): Promise<void> {
    if (this.credential?.userId === userId) {
      this.credential = { ...this.credential, sessionVersion: this.credential.sessionVersion + 1 };
    }
  }
}

function createAuth(): JwtAuthProvider {
  return new JwtAuthProvider(
    {
      secret: "a-testing-secret-that-is-long-enough-for-hs256",
      tenantId: "tenant_1",
      issuer: "nexara-test",
      audience: "nexara-test-app",
      passwordCost: 4,
    },
    new MemoryCredentialsRepository(),
    new PermissionService(),
  );
}

describe("JwtAuthProvider", () => {
  it("requires email verification before issuing a tenant-scoped session", async () => {
    const auth = createAuth();

    await expect(auth.register({
      userId: "member_1",
      email: "Member@Example.test",
      password: "correct-password",
      role: "member",
    })).resolves.toEqual({ userId: "member_1", email: "member@example.test", created: true });

    await expect(auth.login({ email: "member@example.test", password: "correct-password" }))
      .rejects.toMatchObject({ code: "FORBIDDEN" });

    const verification = await auth.requestEmailVerification("member@example.test");
    await expect(auth.verifyEmail(verification!.token)).resolves.toBe(true);

    const session = await auth.login({ email: "MEMBER@example.test", password: "correct-password" });
    await expect(auth.getCurrentUser(session.accessToken)).resolves.toMatchObject({
      userId: "member_1",
      tenantId: "tenant_1",
      email: "member@example.test",
      role: "member",
    });
  });

  it("redeems a password-reset token once and invalidates previous sessions", async () => {
    const auth = createAuth();
    await auth.register({ userId: "member_2", email: "member2@example.test", password: "old-password", role: "member" });
    const verification = await auth.requestEmailVerification("member2@example.test");
    await auth.verifyEmail(verification!.token);
    const oldSession = await auth.login({ email: "member2@example.test", password: "old-password" });

    const reset = await auth.requestPasswordReset("member2@example.test");
    await expect(auth.resetPassword(reset!.token, "new-password")).resolves.toBe(true);
    await expect(auth.resetPassword(reset!.token, "new-password")).resolves.toBe(false);
    await expect(auth.getCurrentUser(oldSession.accessToken)).resolves.toBeNull();
    await expect(auth.login({ email: "member2@example.test", password: "new-password" })).resolves.toMatchObject({
      user: { userId: "member_2" },
    });
  });
});
