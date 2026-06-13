export default function HomePage() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 720 }}>
      <h1>Nexara Foundation V1</h1>
      <p>
        Provider-agnostic platform foundation. Business logic depends only on the
        interfaces in <code>src/core</code> (platform, database, auth, rbac) — never
        on Supabase or Cloudflare-specific APIs.
      </p>
      <p>
        Sample feature: <code>GET /api/me</code> (send an{" "}
        <code>Authorization: Bearer &lt;token&gt;</code> header).
      </p>
    </main>
  );
}
