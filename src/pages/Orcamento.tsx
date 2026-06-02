import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Hammer, Clock, Leaf, ShieldCheck, Send } from "lucide-react";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(200),
  telefone: z.string().trim().min(8, "Telefone inválido").max(50),
  email: z.string().trim().email("E-mail inválido").max(200),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(200),
});

const beneficios = [
  { icon: Clock, title: "Obra até 3x mais rápida", desc: "Entrega em meses, não anos." },
  { icon: Leaf, title: "Sustentável e limpo", desc: "Menos resíduos, mais eficiência." },
  { icon: ShieldCheck, title: "Estrutura certificada", desc: "Aço galvanizado de alta durabilidade." },
  { icon: Hammer, title: "Projeto sob medida", desc: "Do residencial ao comercial." },
];

const Orcamento = () => {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", cidade: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Verifique os dados",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("leads").insert(parsed.data);
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      return;
    }

    setSent(true);
    setForm({ nome: "", telefone: "", email: "", cidade: "" });
    toast({ title: "Recebemos seu contato!", description: "Em breve nossa equipe vai falar com você." });
  };

  return (
    <div className="min-h-screen bg-hero-gradient text-secondary-foreground">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <a href="/" className="font-display text-2xl tracking-wider">
          TUDO <span className="text-primary">CERTO</span>
        </a>
        <a href="/" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
          ← Voltar ao site
        </a>
      </header>

      <main className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Pitch */}
          <div className="animate-fade-in">
            <span className="inline-block text-primary font-semibold uppercase tracking-wider text-sm mb-4">
              Construa em Steel Frame
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              SEU PROJETO PRONTO
              <br />
              <span className="text-primary">EM ATÉ 3X MENOS TEMPO</span>
            </h1>
            <p className="text-secondary-foreground/70 text-lg mb-8 max-w-lg">
              Solicite um orçamento sem compromisso e descubra como o Steel Frame
              pode transformar sua obra com mais qualidade, menos prazo e custo previsível.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {beneficios.map((b, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl bg-dark-card/60 border border-secondary-foreground/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{b.title}</div>
                    <div className="text-sm text-secondary-foreground/60">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <ul className="space-y-2 text-secondary-foreground/80">
              {[
                "Atendimento personalizado em Porto Alegre e região",
                "Orçamento gratuito e sem compromisso",
                "Equipe especializada em Steel Frame",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div
            id="formulario"
            className="bg-dark-card rounded-2xl p-8 md:p-10 border border-secondary-foreground/10 shadow-glow animate-scale-in"
          >
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl mb-2">Obrigado!</h3>
                <p className="text-secondary-foreground/70 mb-6">
                  Recebemos seu contato. Nossa equipe vai falar com você em breve.
                </p>
                <Button variant="outline" onClick={() => setSent(false)}>
                  Enviar outro contato
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-3xl mb-2">Quero meu orçamento</h2>
                <p className="text-secondary-foreground/60 mb-6 text-sm">
                  Preencha e fale com um especialista.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { name: "nome", label: "Nome completo", type: "text", placeholder: "Seu nome" },
                    { name: "telefone", label: "Telefone / WhatsApp", type: "tel", placeholder: "(00) 00000-0000" },
                    { name: "email", label: "E-mail", type: "email", placeholder: "seu@email.com" },
                    { name: "cidade", label: "Cidade", type: "text", placeholder: "Sua cidade" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm text-secondary-foreground/70 mb-2">{f.label}</label>
                      <input
                        name={f.name}
                        type={f.type}
                        required
                        value={(form as any)[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  ))}
                  <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
                    {loading ? "Enviando..." : (<>Quero meu orçamento <Send className="ml-2 w-5 h-5" /></>)}
                  </Button>
                  <p className="text-xs text-secondary-foreground/50 text-center">
                    Seus dados estão seguros e não serão compartilhados.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-sm text-secondary-foreground/40">
        © {new Date().getFullYear()} Tudo Certo Engenharia · Steel Frame
      </footer>
    </div>
  );
};

export default Orcamento;
