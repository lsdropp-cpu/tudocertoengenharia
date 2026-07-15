import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const PIXELS: Array<{ id: string; token: string | undefined }> = [
  { id: '781663838269090', token: Deno.env.get('META_PIXEL_ACCESS_TOKEN') },
  { id: '1794243745264762', token: Deno.env.get('META_PIXEL_2_ACCESS_TOKEN') },
];
const API_VERSION = 'v19.0';

// SHA-256 hash (Meta exige PII com hash)
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Telefone só dígitos com DDI Brasil
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.startsWith('55') ? digits : `55${digits}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const activePixels = PIXELS.filter((p) => !!p.token);
    if (activePixels.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nenhum META_PIXEL_ACCESS_TOKEN configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = await req.json();
    const {
      event_id,
      email,
      phone,
      nome,
      cidade,
      event_source_url,
      fbp,
      fbc,
      user_agent,
    } = body ?? {};

    if (!event_id || !email || !phone) {
      return new Response(
        JSON.stringify({ error: 'event_id, email e phone são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // IP do cliente (Cloudflare / proxy)
    const ip =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '';

    const [emHash, phHash, fnHash, ctHash] = await Promise.all([
      sha256(email),
      sha256(normalizePhone(phone)),
      nome ? sha256(nome.split(' ')[0]) : Promise.resolve(undefined),
      cidade ? sha256(cidade) : Promise.resolve(undefined),
    ]);

    const userData: Record<string, unknown> = {
      em: [emHash],
      ph: [phHash],
      country: [await sha256('br')],
    };
    if (fnHash) userData.fn = [fnHash];
    if (ctHash) userData.ct = [ctHash];
    if (ip) userData.client_ip_address = ip;
    if (user_agent) userData.client_user_agent = user_agent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const payload = {
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id, // mesmo ID que o Pixel manda → dedup
          event_source_url: event_source_url || undefined,
          action_source: 'website',
          user_data: userData,
          custom_data: {
            content_name: 'Solicitação de Orçamento',
            content_category: 'Steel Frame',
            currency: 'BRL',
            value: 1,
          },
        },
      ],
    };

    const results = await Promise.all(
      activePixels.map(async (p) => {
        const url = `https://graph.facebook.com/${API_VERSION}/${p.id}/events?access_token=${p.token}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          console.error(`Meta CAPI erro (pixel ${p.id}):`, resp.status, data);
        } else {
          console.log(`Meta CAPI OK (pixel ${p.id}):`, data);
        }
        return { pixel_id: p.id, ok: resp.ok, status: resp.status, data };
      }),
    );

    const anyOk = results.some((r) => r.ok);
    if (!anyOk) {
      return new Response(
        JSON.stringify({ error: 'Meta API erro em todos os pixels', results }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log('Meta CAPI OK:', result);
    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erro meta-capi:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
