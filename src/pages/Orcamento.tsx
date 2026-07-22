import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Hammer,
  Clock,
  Leaf,
  ShieldCheck,
  Send,
  Zap,
  Ruler,
  TrendingUp,
  Home,
  Building2,
  Wrench,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import logo from "@/assets/logo.png";
import projetoCasa from "@/assets/projeto-casa.webp";
import projetoResidencial from "@/assets/projeto-residencial.webp";
import projetoComercial from "@/assets/projeto-comercial.webp";
import projetoObra from "@/assets/projeto-obra.webp";
import Comparativo from "@/components/Comparativo";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(200),
  telefone: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, "Telefone deve ter DDD + número (10 ou 11 dígitos). Ex: 51989192443"),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(200),
});

const beneficios = [
  { icon: Clock, title: "Obra até 3x mais rápida", desc: "Entrega em meses, não anos." },
  { icon: Leaf, title: "Sustentável e limpo", desc: "Menos resíduos, mais eficiência." },
  { icon: ShieldCheck, title: "Estrutura certificada", desc: "Aço galvanizado de alta durabilidade." },
  { icon: Hammer, title: "Projeto sob medida", desc: "Do residencial ao comercial." },
];

const tipos = [
  {
    icon: Home,
    title: "Residencial",
    desc: "Casas, sobrados e edícolas com conforto térmico e acústico.",
    image: projetoCasa,
  },
  {
    icon: Building2,
    title: "Comercial",
    desc: "Lojas, escritórios e galpões com obra rápida e padronizada.",
    image: projetoComercial,
  },
  {
    icon: Wrench,
    title: "Reforma e ampliação",
    desc: "Ampliações e segundo pavimento sem sobrecarregar a estrutura.",
    image: projetoObra,
  },
];

const vantagens = [
  { icon: Clock, title: "Construção rápida", desc: "Até 30% mais rápida que a alvenaria tradicional." },
  { icon: Leaf, title: "Sustentável", desc: "Menos resíduos e maior eficiência energética." },
  { icon: ShieldCheck, title: "Alta durabilidade", desc: "Resistente a pragas, umidade e intempéries." },
  { icon: Zap, title: "Leve e resistente", desc: "Até 6x mais leve que o concreto." },
  { icon: Ruler, title: "Precisão milimétrica", desc: "Encaixes perfeitos com fabricação industrial." },
  { icon: TrendingUp, title: "Melhor custo-benefício", desc: "Economia em fundação, mão de obra e prazo." },
];

const BenefitHighlights = ({ className = "" }: { className?: string }) => (
  <div className={className}>
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 mb-5 sm:mb-8">
      {beneficios.map((b, i) => (
        <div
          key={i}
          className="flex min-w-0 gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-dark-card/60 border border-secondary-foreground/10"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <b.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm sm:text-base leading-snug">{b.title}</div>
            <div className="text-xs sm:text-sm text-secondary-foreground/60 leading-snug">{b.desc}</div>
          </div>
        </div>
      ))}
    </div>

    <ul className="space-y-2 text-sm sm:text-base text-secondary-foreground/80">
      {[
        "Atendimento personalizado em Porto Alegre e região",
        "Orçamento gratuito e sem compromisso",
        "Equipe especializada em Steel Frame",
      ].map((item, i) => (
        <li key={i} className="flex min-w-0 items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <span className="min-w-0 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SERVICO_OPTIONS = [
  "Estrutura em Steel Frame",
  "Drywall",
  "Projeto e execução",
  "Reforma em Steel Frame",
  "Ainda não tenho certeza",
];

const AREA_OPTIONS = [
  "Até 100 m²",
  "De 101 a 150 m²",
  "De 151 a 250 m²",
  "Acima de 250 m²",
];

const Orcamento = () => {
  const [form, setForm] = useState({ nome: "", telefone: "", cidade: "", mensagem: "" });
  const [servico, setServico] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "telefone") {
      setForm({ ...form, telefone: value.replace(/\D/g, "").slice(0, 11) });
      return;
    }
    setForm({ ...form, [name]: value });
  };

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

    if (!servico || !area) {
      toast({
        title: "Complete a qualificação",
        description: "Selecione o serviço e a área da obra.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { nome, telefone, cidade } = parsed.data;
    const email = "nao-informado@orcamento.local";
    const descricao = form.mensagem.trim();
    const qualif = `Serviço: ${servico}\nÁrea: ${area}${descricao ? `\n\nDescrição:\n${descricao}` : ""}`;
    const { error } = await supabase.from("leads").insert({
      nome,
      telefone,
      email,
      cidade,
      estagio: "Novo",
      mensagem: qualif,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      return;
    }

    // ====== Meta Ads tracking (Pixel + Conversions API com dedup) ======
    try {
      const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

      // 1) Browser: Meta Pixel
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "Lead", {
          content_name: "Solicitação de Orçamento",
          content_category: "Steel Frame",
          currency: "BRL",
          value: 1,
        }, { eventID: eventId });
      }

      // 2) Servidor: Conversions API (mesmo eventId → dedup)
      const getCookie = (name: string) => {
        const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
        return m ? decodeURIComponent(m[1]) : undefined;
      };

      supabase.functions.invoke("meta-capi", {
        body: {
          event_id: eventId,
          email,
          phone: telefone,
          nome,
          cidade,
          event_source_url: window.location.href,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
          user_agent: navigator.userAgent,
        },
      }).catch((e) => console.warn("meta-capi falhou:", e));
    } catch (e) {
      console.warn("Tracking Meta falhou:", e);
    }

    // ====== Google Ads — conversão "Envio de Orçamento" ======
    try {
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-18229608760/GPxtCNbV37wcELiCx_RD",
          value: 1.0,
          currency: "BRL",
        });
      }
    } catch (e) {
      console.warn("Tracking Google Ads falhou:", e);
    }
    // ====================================================================


    setSent(true);
    setForm({ nome: "", telefone: "", cidade: "", mensagem: "" });
    setServico("");
    setArea("");
    toast({ title: "Recebemos seu contato!", description: "Em breve nossa equipe vai falar com você." });
  };

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-hero-gradient text-secondary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#3d3d3d]/95 backdrop-blur border-b border-secondary-foreground/10">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-center">
          <a href="/" className="flex items-center">
            <img src={logo} alt="Tudo Certo Engenharia" className="h-10 md:h-16 w-auto" />
          </a>
        </div>
      </header>

      {/* Hero + Form */}
      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-16">
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] gap-6 lg:gap-12 items-start">
          <div className="min-w-0 animate-fade-in">
            <span className="inline-block text-primary font-semibold uppercase tracking-wider text-[11px] sm:text-sm mb-3">
              Construa em Steel Frame
            </span>
            <h1 className="font-display text-[2.15rem] sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] mb-4 sm:mb-6 break-words">
              SEU PROJETO PRONTO
              <br />
              <span className="text-primary">EM ATÉ 3X MENOS TEMPO</span>
            </h1>
            <p className="text-secondary-foreground/70 text-sm sm:text-lg leading-relaxed mb-5 sm:mb-8 max-w-lg">
              Solicite um orçamento sem compromisso e descubra como o Steel Frame
              pode transformar sua obra com mais qualidade, menos prazo e custo previsível.
            </p>

            <BenefitHighlights className="hidden lg:block" />
          </div>

          <div
            id="formulario"
            className="w-full min-w-0 max-w-md mx-auto lg:max-w-none bg-dark-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-secondary-foreground/10 shadow-glow animate-scale-in lg:sticky lg:top-24"
          >
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl mb-2">Obrigado!</h3>
                <p className="text-secondary-foreground/70 mb-6">
                  Recebemos seu contato. Nossa equipe vai falar com você em breve.
                  <br />
                  <span className="block mt-2">Se preferir, fale diretamente com nosso especialista agora:</span>
                </p>
                <a
                  href="https://wa.me/555195648802?text=Oi,%20vim%20pelo%20formul%C3%A1rio%20do%20site."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-3 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.413c-.003 6.555-5.338 11.89-11.893 11.89a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Falar no WhatsApp
                </a>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                    Enviar outro contato
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl sm:text-3xl mb-2 leading-none">Quero meu orçamento</h2>
                <p className="text-secondary-foreground/60 mb-5 sm:mb-6 text-sm">
                  Preencha e fale com um especialista.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  {[
                    { name: "nome", label: "Nome", type: "text", placeholder: "Seu nome" },
                    { name: "telefone", label: "WhatsApp", type: "tel", placeholder: "DDD + número (ex: 11987654321)", inputMode: "numeric", pattern: "[0-9]{10,11}", maxLength: 11 },
                    { name: "cidade", label: "Cidade", type: "text", placeholder: "Sua cidade" },
                  ].map((f: any) => (
                    <div key={f.name}>
                      <label className="block text-sm text-secondary-foreground/70 mb-1.5 sm:mb-2">{f.label}</label>
                      <input
                        name={f.name}
                        type={f.type}
                        required
                        value={(form as any)[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        inputMode={f.inputMode}
                        pattern={f.pattern}
                        maxLength={f.maxLength}
                        className="w-full min-w-0 px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-base text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  ))}
                  {[
                    { label: "Qual serviço procura?", value: servico, set: setServico, options: SERVICO_OPTIONS, placeholder: "Selecione o serviço" },
                    { label: "Área da obra", value: area, set: setArea, options: AREA_OPTIONS, placeholder: "Selecione a área" },
                  ].map((q) => (
                    <div key={q.label}>
                      <label className="block text-sm text-secondary-foreground/70 mb-1.5 sm:mb-2">{q.label}</label>
                      <select
                        required
                        value={q.value}
                        onChange={(e) => q.set(e.target.value)}
                        className={`w-full min-w-0 px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-base focus:border-primary focus:outline-none transition-colors appearance-none bg-no-repeat bg-[right_1rem_center] pr-10 ${
                          q.value ? "text-secondary-foreground" : "text-secondary-foreground/40"
                        }`}
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
                        }}
                      >
                        <option value="" disabled>{q.placeholder}</option>
                        {q.options.map((opt) => (
                          <option key={opt} value={opt} className="text-secondary-foreground bg-dark-bg">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm text-secondary-foreground/70 mb-1.5 sm:mb-2">Conte um pouco sobre seu projeto <span className="text-secondary-foreground/40">(opcional)</span></label>
                    <textarea
                      name="mensagem"
                      rows={4}
                      value={form.mensagem}
                      onChange={handleChange}
                      placeholder="Ex: é uma reforma em steel frame e drywall de 120m²..."
                      className="w-full min-w-0 px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-base text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <Button type="submit" variant="hero" size="xl" className="w-full px-3 text-sm sm:text-lg tracking-wide whitespace-normal leading-tight" disabled={loading}>
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
        <BenefitHighlights className="mt-6 lg:hidden" />
      </section>

      <Comparativo />

      {/* Tipos de projeto */}
      <section className="py-12 lg:py-24 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              O que construímos
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl mt-3">
              Aqui temos tudo para o <span className="text-primary">seu projeto</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tipos.map((t, i) => (
              <div
                key={i}
                className="group rounded-2xl overflow-hidden bg-dark-card border border-secondary-foreground/10 hover:border-primary/40 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-gradient flex items-center justify-center">
                      <t.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-2xl">{t.title}</h3>
                  </div>
                  <p className="text-secondary-foreground/60">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-12 lg:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Vantagens
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl mt-3">
              Por que escolher <span className="text-primary">Steel Frame?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vantagens.map((v, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-dark-card/60 border border-secondary-foreground/10 hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-green-gradient flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl mb-2">{v.title}</h3>
                <p className="text-secondary-foreground/60 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos realizados */}
      <section className="py-12 lg:py-24 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Portfólio
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl mt-3">
              Alguns dos nossos <span className="text-primary">projetos</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[projetoCasa, projetoResidencial, projetoComercial, projetoObra].map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden border border-secondary-foreground/10"
              >
                <img
                  src={img}
                  alt={`Projeto ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-20 bg-green-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl mb-4">
            Pronto para começar seu projeto?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8">
            Fale com nossa equipe e receba um orçamento personalizado sem compromisso.
          </p>
          <Button
            variant="secondary"
            size="xl"
            onClick={scrollToForm}
            className="bg-dark-bg text-secondary-foreground hover:bg-dark-card"
          >
            Solicitar orçamento agora <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-secondary-foreground/10 py-10">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm text-secondary-foreground/70">
          <div>
            <img src={logo} alt="Tudo Certo Engenharia" className="h-10 w-auto mb-3" />
            <p>Steel Frame com qualidade, prazo e custo previsível.</p>
          </div>
          <div className="space-y-2">
            <a href="tel:+5551989192443" className="flex items-center gap-2 hover:text-primary">
              <Phone className="w-4 h-4" /> (51) 98919-2443
            </a>
            <a href="mailto:comercial@tudocertoeng.com.br" className="flex items-center gap-2 hover:text-primary">
              <Mail className="w-4 h-4" /> comercial@tudocertoeng.com.br
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Porto Alegre, RS
            </div>
          </div>
          <div className="md:text-right">
            <a href="/" className="hover:text-primary">← Voltar ao site principal</a>
            <p className="mt-4 text-secondary-foreground/40">
              © {new Date().getFullYear()} Tudo Certo Engenharia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Orcamento;
