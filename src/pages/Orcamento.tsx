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
import projetoCasa from "@/assets/projeto-casa.png";
import projetoResidencial from "@/assets/projeto-residencial.png";
import projetoComercial from "@/assets/projeto-comercial.png";
import projetoObra from "@/assets/projeto-obra.png";
import Comparativo from "@/components/Comparativo";

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
    const { nome, telefone, email, cidade } = parsed.data;
    const { error } = await supabase.from("leads").insert({
      nome: nome as string,
      telefone: telefone as string,
      email: email as string,
      cidade: cidade as string,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      return;
    }

    setSent(true);
    setForm({ nome: "", telefone: "", email: "", cidade: "" });
    toast({ title: "Recebemos seu contato!", description: "Em breve nossa equipe vai falar com você." });
  };

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-hero-gradient text-secondary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#3d3d3d]/95 backdrop-blur border-b border-secondary-foreground/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-center">
          <a href="/" className="flex items-center">
            <img src={logo} alt="Tudo Certo Engenharia" className="h-14 md:h-16 w-auto" />
          </a>
        </div>
      </header>

      {/* Hero + Form */}
      <section className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
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

          <div
            id="formulario"
            className="bg-dark-card rounded-2xl p-8 md:p-10 border border-secondary-foreground/10 shadow-glow animate-scale-in lg:sticky lg:top-24"
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
      </section>

      <Comparativo />

      {/* Tipos de projeto */}
      <section className="py-16 lg:py-24 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              O que construímos
            </span>
            <h2 className="font-display text-3xl md:text-5xl mt-3">
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
      <section className="py-16 lg:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Vantagens
            </span>
            <h2 className="font-display text-3xl md:text-5xl mt-3">
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
      <section className="py-16 lg:py-24 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Portfólio
            </span>
            <h2 className="font-display text-3xl md:text-5xl mt-3">
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
          <h2 className="font-display text-3xl md:text-5xl mb-4">
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
