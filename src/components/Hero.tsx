import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import projetoResidencial from "@/assets/projeto-residencial.png";

const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={projetoResidencial}
          alt="Estrutura Steel Frame"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-overlay-gradient" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 border border-primary/20 rotate-45 animate-pulse hidden lg:block" />
      <div className="absolute bottom-1/4 right-10 w-24 h-24 border border-primary/20 rotate-12 animate-pulse hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Construção Sustentável
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-secondary-foreground leading-none mb-6 animate-slide-up">
            CONSTRUA O FUTURO
            <br />
            <span className="text-primary">COM STEEL FRAME</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Tecnologia construtiva de ponta com estruturas em aço galvanizado.
            Mais rápido, mais leve, mais sustentável.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl">
              Fale Conosco
              <ArrowRight className="ml-2" />
            </Button>
            <Button variant="heroOutline" size="xl">
              <Play className="mr-2" />
              Ver Projetos
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.6s" }}>
          {[
            { number: "150+", label: "Projetos Realizados" },
            { number: "10+", label: "Anos de Experiência" },
            { number: "98%", label: "Clientes Satisfeitos" },
            { number: "30%", label: "Mais Rápido" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-4xl md:text-5xl text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-secondary-foreground/60 text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-secondary-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
