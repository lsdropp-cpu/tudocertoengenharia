import { Building2, Home, Factory, PenTool, HardHat, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Home,
    title: "Casas Residenciais",
    description:
      "Construção completa de residências em Steel Frame, do projeto à entrega das chaves.",
  },
  {
    icon: Building2,
    title: "Edifícios Comerciais",
    description:
      "Estruturas comerciais modernas e eficientes para seu negócio crescer.",
  },
  {
    icon: Factory,
    title: "Galpões Industriais",
    description:
      "Grandes estruturas industriais com rapidez e excelente custo-benefício.",
  },
  {
    icon: PenTool,
    title: "Projetos Sob Medida",
    description:
      "Desenvolvimento de projetos personalizados de acordo com sua necessidade.",
  },
  {
    icon: HardHat,
    title: "Consultoria Técnica",
    description:
      "Assessoria especializada para projetos em Steel Frame e Light Steel Framing.",
  },
  {
    icon: Wrench,
    title: "Reforma e Ampliação",
    description:
      "Reformas e ampliações utilizando estruturas em aço galvanizado.",
  },
];

const Services = () => {
  return (
    <section id="servicos" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            Serviços
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
            O QUE
            <br />
            <span className="text-primary">OFERECEMOS</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Soluções completas em Steel Frame para todos os tipos de projetos. 
            Da concepção à execução, estamos com você em cada etapa.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card p-8 rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-primary/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-green-gradient group-hover:shadow-glow transition-all duration-300">
                <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Não encontrou o que procura? Entre em contato para um atendimento personalizado.
          </p>
          <Button variant="hero" size="xl">
            Fale com um Especialista
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
