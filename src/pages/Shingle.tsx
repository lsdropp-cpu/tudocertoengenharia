import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  ShieldCheck,
  Feather,
  Droplets,
  Thermometer,
  Award,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShingleQuoteDialog from "@/components/ShingleQuoteDialog";
import shingleHero from "@/assets/shingle-hero.jpg";
import shingleDetail from "@/assets/shingle-detail-roof.png.asset.json";
import obra1 from "@/assets/shingle-obra-1.png.asset.json";
import obra2 from "@/assets/shingle-obra-2.png.asset.json";
import obra3 from "@/assets/shingle-obra-3.png.asset.json";
import obra4 from "@/assets/shingle-obra-4.png.asset.json";
import obra5 from "@/assets/shingle-obra-5.png.asset.json";
import obra6 from "@/assets/shingle-obra-6.png.asset.json";

const WHATSAPP_URL =
  "https://wa.me/5500000000000?text=Olá!%20Tenho%20interesse%20em%20Telha%20Shingle.";

const benefits = [
  { icon: Feather, title: "Até 4x mais leve", desc: "Estrutura mais leve que sistemas tradicionais de cobertura." },
  { icon: Droplets, title: "Máxima estanqueidade", desc: "Vedação superior contra chuva, vento e infiltrações." },
  { icon: Thermometer, title: "Conforto térmico", desc: "Sistema ventilado que melhora a temperatura interna." },
  { icon: Award, title: "Garantia de 30 anos", desc: "Garantia de fábrica entre 25 e 30 anos." },
  { icon: Sparkles, title: "Acabamento premium", desc: "Visual sofisticado que valoriza o imóvel." },
  { icon: ShieldCheck, title: "Alta durabilidade", desc: "Excelente desempenho em diferentes climas brasileiros." },
];

const steps = [
  { n: "01", title: "Diagnóstico Preciso", desc: "Análise técnica completa do seu projeto e da estrutura existente." },
  { n: "02", title: "Orçamento Sem Surpresa", desc: "Cálculo personalizado do sistema completo: telhas, OSB, subcobertura, fixadores, ventilação." },
  { n: "03", title: "Entrega & Instalação", desc: "Entrega pontual do material, suporte técnico na obra e acompanhamento pós-entrega." },
];

const faqs = [
  { q: "É confiável no clima brasileiro?", a: "Sim. A telha shingle é testada para suportar chuvas intensas, ventos fortes e altas temperaturas, sendo amplamente utilizada em todas as regiões do Brasil." },
  { q: "Meu pedreiro vai saber instalar?", a: "Fornecemos manual técnico de instalação e suporte direto da nossa equipe durante toda a obra para garantir o resultado correto." },
  { q: "Vale o investimento?", a: "Sim. Além da estética premium, a shingle valoriza o imóvel, exige pouca manutenção e tem garantia de até 30 anos." },
  { q: "Quanto custa?", a: "O sistema completo parte de R$ 145,00/m². O valor final depende do projeto, geometria do telhado e acabamentos escolhidos." },
  { q: "Quanto tempo demora a instalação?", a: "A instalação é rápida — geralmente entre 30% e 50% mais ágil que coberturas tradicionais." },
  { q: "Precisa de estrutura especial?", a: "Por ser leve, a shingle se adapta a estruturas em Steel Frame, madeira ou laje, sem necessidade de reforços pesados." },
  { q: "Esquenta mais que telha comum?", a: "Não. O sistema ventilado e a subcobertura garantem desempenho térmico igual ou superior às telhas convencionais." },
  { q: "Como funciona a garantia?", a: "Garantia de fábrica de 25 a 30 anos contra defeitos de fabricação, além da nossa garantia de instalação." },
];

const testimonials = [
  { name: "Carlos Mendes", text: "Acabamento impecável e equipe muito técnica. O telhado ficou perfeito.", initials: "CM" },
  { name: "Juliana Pereira", text: "Atendimento excelente do orçamento à entrega. Recomendo demais!", initials: "JP" },
  { name: "Ricardo Alves", text: "Investimento que realmente valorizou minha casa. Vale cada centavo.", initials: "RA" },
  { name: "Fernanda Lima", text: "Profissionais qualificados e produto de alta qualidade. 10/10.", initials: "FL" },
];

const galleryPhotos = [
  {
    src: obra1.url,
    alt: "Residência com cobertura shingle em meio à natureza",
    title: "Residência de alto padrão",
    desc: "Cobertura escura com acabamento premium e integração com o paisagismo.",
  },
  {
    src: obra2.url,
    alt: "Casa contemporânea com telha shingle",
    title: "Projeto contemporâneo",
    desc: "Aplicação em arquitetura moderna com linhas limpas e volumetria marcante.",
  },
  {
    src: obra3.url,
    alt: "Capela com cobertura em telha shingle",
    title: "Projeto especial",
    desc: "Solução shingle aplicada em obra autoral com forte apelo visual.",
  },
  {
    src: obra4.url,
    alt: "Close do acabamento da telha shingle instalada",
    title: "Acabamento de perto",
    desc: "Textura, alinhamento e paginação que reforçam a percepção de qualidade.",
  },
  {
    src: obra5.url,
    alt: "Telhado shingle finalizado em residência",
    title: "Obra finalizada",
    desc: "Cobertura ampla com visual uniforme e excelente presença estética.",
  },
  {
    src: obra6.url,
    alt: "Estrutura de telhado em fase de preparação para instalação",
    title: "Execução técnica",
    desc: "Etapa de base estrutural mostrando o cuidado necessário para o sistema completo.",
  },
];

const Shingle = () => {
  const [open, setOpen] = useState(false);


  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12">
        <div className="absolute inset-0">
          <img src={shingleHero} alt="Casa com telhado Shingle" className="w-full h-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Telha Shingle Premium
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            TELHA SHINGLE QUE
            <br />
            <span className="text-primary">VALORIZA SEU IMÓVEL</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Especialistas em coberturas sofisticadas, com suporte técnico
            e garantia de até 30 anos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" onClick={() => setOpen(true)}>
              Quero Meu Orçamento <ArrowRight className="ml-2" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => setOpen(true)}>
              <MessageCircle className="mr-2" /> Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* SISTEMA */}
      <section className="py-20 bg-dark-bg text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src={shingleDetail.url} alt="Detalhe telha shingle" loading="lazy" className="rounded-2xl shadow-2xl w-full h-[480px] object-cover" />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-xl hidden md:block">
                <div className="font-display text-4xl">30</div>
                <div className="text-sm uppercase tracking-wider">Anos de garantia</div>
              </div>
            </div>

            <div>
              <span className="text-primary uppercase tracking-wider text-sm font-semibold">Conheça o Sistema</span>
              <h2 className="font-display text-4xl md:text-5xl mt-2 mb-6">
                Leveza, proteção e <span className="text-primary">durabilidade</span>
              </h2>
              <p className="text-secondary-foreground/70 mb-6">
                A telha shingle faz parte de um sistema completo de cobertura: manta
                asfáltica reforçada, subcobertura, ventilação e acabamento premium.
                Mais proteção, mais vida útil e visual moderno para sua obra.
              </p>
              <ul className="space-y-3">
                {[
                  "Sistema completo, não apenas a telha",
                  "Compatível com Steel Frame, madeira e laje",
                  "Acabamento de alto padrão",
                  "Tecnologia internacionalmente reconhecida",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-secondary-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary uppercase tracking-wider text-sm font-semibold">Benefícios</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 mb-4">
              Por que escolher <span className="text-primary">Shingle?</span>
            </h2>
            <p className="text-muted-foreground">
              Tecnologia de cobertura premium com vantagens reais para seu projeto.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-8 rounded-2xl border border-border bg-card hover:border-primary transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-2xl mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <section className="py-20 bg-dark-bg text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary uppercase tracking-wider text-sm font-semibold">Como funciona</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 mb-4">
              Por que fazer orçamento <span className="text-primary">conosco?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative p-8 rounded-2xl bg-dark-card border border-secondary-foreground/10 hover:border-primary transition-all">
                <div className="font-display text-6xl text-primary/30 mb-3">{s.n}</div>
                <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                <p className="text-secondary-foreground/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary uppercase tracking-wider text-sm font-semibold">Depoimentos</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 mb-4">
              O que dizem nossos <span className="text-primary">clientes</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-5 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                    {t.initials}
                  </div>
                  <span className="font-medium">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA DE OBRAS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-primary uppercase tracking-wider text-sm font-semibold">Obras executadas</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 mb-4">
              Fotos reais de <span className="text-primary">obras com telha shingle</span>
            </h2>
            <p className="text-muted-foreground">
              Mais prova social para você avaliar o acabamento, a estética e a aplicação
              da telha shingle em projetos reais da Tudo Certo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {galleryPhotos.map((photo) => (
              <article
                key={photo.src}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl mb-2">{photo.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{photo.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-dark-bg text-secondary-foreground">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <span className="text-primary uppercase tracking-wider text-sm font-semibold">Dúvidas</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 mb-4">
              Suas principais dúvidas, <span className="text-primary">respondidas</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-secondary-foreground/10 rounded-xl px-5 bg-dark-card"
              >
                <AccordionTrigger className="text-left hover:no-underline font-display text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-secondary-foreground/70">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ORCAMENTO / CTA */}
      <section id="orcamento" className="py-20 bg-dark-bg text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-5">
              Seu telhado completo com <span className="text-primary">sistema Shingle</span>
            </h2>
            <p className="text-secondary-foreground/70 max-w-2xl mx-auto mb-12">
              Não orçamos somente o básico. Você recebe tudo o que precisa para
              instalar com segurança e acabamento impecável.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
              {[
                "Cálculo do sistema completo (não apenas a telha)",
                "Manual de instalação + suporte técnico na obra",
                "Visual sofisticado com acabamento final de alto padrão",
                "30 anos de garantia",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-5 rounded-xl bg-dark-card border border-secondary-foreground/10"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-secondary-foreground/90">{item}</span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <span className="font-display text-3xl md:text-4xl text-primary">
                A partir de R$ 145,00 m²
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="hero" size="xl" onClick={() => setOpen(true)}>
                Quero Meu Orçamento
              </Button>
              <Button variant="heroOutline" size="xl" onClick={() => setOpen(true)}>
                <MessageCircle className="mr-2" /> Falar com especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ShingleQuoteDialog open={open} onOpenChange={setOpen} />



      <Footer />
    </div>
  );
};

export default Shingle;
