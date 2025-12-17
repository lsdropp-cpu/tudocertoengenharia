import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import projetoArena from "@/assets/projeto-arena.png";
import projetoEstrutura from "@/assets/projeto-estrutura.png";
import projetoComercial from "@/assets/projeto-comercial.png";
import projetoCasa from "@/assets/projeto-casa.png";
import projetoObra from "@/assets/projeto-obra.png";
import projetoResidencial from "@/assets/projeto-residencial.png";

const projects = [
  {
    id: 1,
    title: "Arena do Grêmio",
    category: "Comercial",
    image: projetoArena,
    description: "Estrutura metálica para grande estádio",
  },
  {
    id: 2,
    title: "Cobertura Industrial",
    category: "Industrial",
    image: projetoEstrutura,
    description: "Estrutura de cobertura em steel frame",
  },
  {
    id: 3,
    title: "Edifício Comercial",
    category: "Comercial",
    image: projetoComercial,
    description: "Prédio comercial moderno com iluminação arquitetônica",
  },
  {
    id: 4,
    title: "Casa em Construção",
    category: "Residencial",
    image: projetoObra,
    description: "Montagem de estrutura residencial",
  },
  {
    id: 5,
    title: "Residência Clássica",
    category: "Residencial",
    image: projetoCasa,
    description: "Casa residencial em estilo clássico",
  },
  {
    id: 6,
    title: "Casa de Campo",
    category: "Residencial",
    image: projetoResidencial,
    description: "Estrutura residencial em área verde",
  },
];

const categories = ["Todos", "Residencial", "Comercial", "Industrial"];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredProjects =
    activeCategory === "Todos"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projetos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            Portfólio
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
            NOSSOS
            <br />
            <span className="text-primary">PROJETOS</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Conheça alguns dos projetos que já realizamos. Cada obra é única e 
            desenvolvida com dedicação e excelência técnica.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide transition-all duration-300 ${
                activeCategory === category
                  ? "bg-green-gradient text-primary-foreground shadow-glow"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium uppercase tracking-wide mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.category}
                </span>
                <h3 className="font-display text-2xl text-secondary-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-secondary-foreground/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {project.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
