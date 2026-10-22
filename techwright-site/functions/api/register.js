// Cloudflare Pages Function: POST /api/register
// Env vars (set as encrypted secrets in Cloudflare): SHEET_URL, SHARED_SECRET
export async function onRequestPost({ request, env }) {
  const json = (o, s = 200) => new Response(JSON.stringify(o), {
    status: s, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
  if (request.headers.get("Origin") !== new URL(request.url).origin) return json({ ok: false }, 403);
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) return json({ ok: false }, 415);
  let d;
  try { d = await request.json(); } catch { return json({ ok: false }, 400); }
  if (d.website) return json({ ok: true }); // honeypot: bots fill this, pretend success
  const s = v => String(v ?? "").trim().slice(0, 200);
  const rec = { name: s(d.name), phone: s(d.phone), email: s(d.email), course: s(d.course) };
  if (rec.name.length < 2 || rec.phone.replace(/\D/g, "").length < 8 ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rec.email)) return json({ ok: false }, 400);
  if (!env.SHEET_URL || !env.SHARED_SECRET) return json({ ok: false }, 500);
  try {
    const r = await fetch(env.SHEET_URL, {
      method: "POST", redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...rec, secret: env.SHARED_SECRET })
    });
    const t = (await r.text()).trim();
    if (!r.ok || t !== "ok") return json({ ok: false }, 502);
    return json({ ok: true });
  } catch { return json({ ok: false }, 502); }
}
export const onRequest = () => new Response("Method not allowed", { status: 405 });
