import { Zap, Clock, Leaf, Shield, Ruler, TrendingUp } from "lucide-react";

const advantages = [
  {
    icon: Clock,
    title: "Construção Rápida",
    description:
      "Obras até 30% mais rápidas que métodos tradicionais. Monte sua estrutura em semanas, não meses.",
  },
  {
    icon: Leaf,
    title: "Sustentável",
    description:
      "Menor desperdício de materiais e maior eficiência energética. Construção limpa e ecológica.",
  },
  {
    icon: Shield,
    title: "Alta Durabilidade",
    description:
      "Aço galvanizado resistente a pragas, umidade e intempéries. Estruturas que duram gerações.",
  },
  {
    icon: Zap,
    title: "Leve e Resistente",
    description:
      "Estruturas até 6x mais leves que concreto, sem perder resistência e segurança.",
  },
  {
    icon: Ruler,
    title: "Precisão Milimétrica",
    description:
      "Peças fabricadas com precisão industrial garantem encaixes perfeitos e acabamento superior.",
  },
  {
    icon: TrendingUp,
    title: "Custo-Benefício",
    description:
      "Economia na fundação, mão de obra e tempo. Investimento inteligente para seu projeto.",
  },
];

const Advantages = () => {
  return (
    <section id="vantagens" className="py-24 bg-hero-gradient text-secondary-foreground">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            Vantagens
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-6">
            POR QUE ESCOLHER
            <br />
            <span className="text-primary">STEEL FRAME?</span>
          </h2>
          <p className="text-secondary-foreground/70 text-lg">
            Tecnologia construtiva que combina inovação, sustentabilidade e 
            eficiência. Descubra os benefícios de construir com Steel Frame.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-dark-card/50 border border-secondary-foreground/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-green-gradient flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow duration-300">
                <advantage.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl mb-3">{advantage.title}</h3>
              <p className="text-secondary-foreground/60 leading-relaxed">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
