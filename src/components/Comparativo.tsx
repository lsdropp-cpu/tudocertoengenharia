import { useEffect, useRef, useState } from "react";

const metricas = [
  { label: "Tempo de obra", alvenaria: 90, steel: 30 },
  { label: "Manutenção", alvenaria: 70, steel: 15 },
  { label: "Isolamento térmico", alvenaria: 35, steel: 90 },
  { label: "Umidade", alvenaria: 75, steel: 20 },
  { label: "Consumo de água", alvenaria: 95, steel: 15 },
  { label: "Desperdício de material", alvenaria: 60, steel: 10 },
];

const Comparativo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-hero-gradient">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
          <div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Comparativo
            </span>
            <h2 className="font-display text-3xl md:text-5xl mt-3 mb-5">
              <span className="text-white">Vantagens do</span> <span className="text-primary">Steel Frame</span>
            </h2>
            <p className="text-secondary-foreground/70 leading-relaxed">
              Veja um comparativo simples entre os métodos construtivos e tenha
              certeza das vantagens do Steel Frame para a sua construção.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <CompareCard
              titulo="Alvenaria"
              cor="destructive"
              metricas={metricas.map((m) => ({ label: m.label, value: m.alvenaria }))}
              visible={visible}
            />
            <CompareCard
              titulo="Steel Frame"
              cor="primary"
              metricas={metricas.map((m) => ({ label: m.label, value: m.steel }))}
              visible={visible}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const CompareCard = ({
  titulo,
  cor,
  metricas,
  visible,
}: {
  titulo: string;
  cor: "destructive" | "primary";
  metricas: { label: string; value: number }[];
  visible: boolean;
}) => {
  const bgWrap = cor === "primary" ? "bg-primary/10 border-primary/30" : "bg-destructive/10 border-destructive/30";
  const barBg = cor === "primary" ? "bg-primary" : "bg-destructive";
  const titleColor = cor === "primary" ? "text-primary" : "text-destructive";

  return (
    <div className={`rounded-2xl p-6 md:p-7 border ${bgWrap}`}>
      <h3 className={`font-bold tracking-widest mb-6 ${titleColor}`}>{titulo.toUpperCase()}</h3>
      <div className="space-y-4">
        {metricas.map((m, i) => (
          <div key={i}>
            <div className="text-sm text-secondary-foreground/80 mb-1.5">{m.label}</div>
            <div className="h-2.5 w-full rounded-full bg-dark-bg/40 overflow-hidden">
              <div
                className={`h-full ${barBg} rounded-full transition-[width] duration-[1400ms] ease-out`}
                style={{
                  width: visible ? `${m.value}%` : "0%",
                  transitionDelay: `${i * 120}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comparativo;
