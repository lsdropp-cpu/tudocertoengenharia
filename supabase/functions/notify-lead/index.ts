// Envia push notification a todos os admins inscritos quando cai um lead novo
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:contato@tudocertosteel.com";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // GET => devolve chave pública VAPID (usada pelo cliente)
    if (req.method === "GET") {
      return new Response(JSON.stringify({ publicKey: VAPID_PUBLIC }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lead = await req.json();
    const { data: subs, error } = await supabase.from("push_subscriptions").select("*");
    if (error) throw error;

    const payload = JSON.stringify({
      title: "🔔 Novo lead — Tudo Certo",
      body: `${lead.nome || "Sem nome"} (${lead.cidade || "-"}) · ${lead.telefone || ""}`,
      tag: `lead-${lead.id}`,
      url: "/admin",
    });

    const results = await Promise.allSettled(
      (subs || []).map((s: any) =>
        webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        ),
      ),
    );

    // Remove inscrições inválidas (410/404)
    const toDelete: string[] = [];
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const status = (r.reason as any)?.statusCode;
        if (status === 410 || status === 404) toDelete.push((subs as any)[i].endpoint);
        console.warn("push falhou:", status, (r.reason as any)?.body);
      }
    });
    if (toDelete.length) {
      await supabase.from("push_subscriptions").delete().in("endpoint", toDelete);
    }

    return new Response(JSON.stringify({ sent: results.length, cleaned: toDelete.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-lead error:", e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
