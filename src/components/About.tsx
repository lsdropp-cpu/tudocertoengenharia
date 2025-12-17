import { CheckCircle2 } from "lucide-react";
import projetoObra from "@/assets/projeto-obra.png";

const About = () => {
  const features = [
    "Estruturas em aço galvanizado de alta resistência",
    "Projetos personalizados para cada cliente",
    "Equipe técnica especializada",
    "Garantia de qualidade e durabilidade",
    "Sustentabilidade e menor impacto ambiental",
    "Prazos de execução reduzidos",
  ];

  return (
    <section id="sobre" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={projetoObra}
                alt="Obra em Steel Frame"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-card p-6 rounded-xl shadow-card max-w-xs hidden md:block">
              <div className="font-display text-5xl text-primary mb-2">10+</div>
              <p className="text-muted-foreground">
                Anos transformando o mercado da construção civil
              </p>
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-primary/30 rounded-xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Sobre Nós
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              CONSTRUÇÃO
              <br />
              <span className="text-primary">INTELIGENTE</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              A <strong className="text-foreground">Tudo Certo Engenharia</strong> é especializada em 
              construções com tecnologia Steel Frame, oferecendo soluções modernas e 
              eficientes para projetos residenciais, comerciais e industriais. 
              Nossa missão é entregar obras com excelência, combinando inovação, 
              sustentabilidade e qualidade.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
