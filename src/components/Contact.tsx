import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      label: "Telefone",
      value: "(00) 00000-0000",
      href: "tel:+5500000000000",
    },
    {
      icon: Mail,
      label: "E-mail",
      value: "comercial@tudocertoeng.com.br",
      href: "mailto:comercial@tudocertoeng.com.br",
    },
    {
      icon: MapPin,
      label: "Endereço",
      value: "Sua Cidade, Estado - Brasil",
      href: "#",
    },
    {
      icon: Clock,
      label: "Horário",
      value: "Seg - Sex: 8h às 18h",
      href: "#",
    },
  ];

  return (
    <section id="contato" className="py-24 bg-hero-gradient text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Contato
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-6">
              VAMOS CONSTRUIR
              <br />
              <span className="text-primary">JUNTOS?</span>
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-10 max-w-lg">
              Entre em contato conosco e solicite seu orçamento sem compromisso. 
              Nossa equipe está pronta para transformar seu projeto em realidade.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-dark-card border border-secondary-foreground/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-secondary-foreground/50 text-sm">
                      {info.label}
                    </div>
                    <div className="text-secondary-foreground font-medium group-hover:text-primary transition-colors">
                      {info.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-dark-card rounded-2xl p-8 md:p-10 border border-secondary-foreground/10">
            <h3 className="font-display text-2xl mb-6">Solicite seu Orçamento</h3>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-secondary-foreground/70 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-primary focus:outline-none transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary-foreground/70 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-primary focus:outline-none transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-secondary-foreground/70 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-primary focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-secondary-foreground/70 mb-2">
                  Tipo de Projeto
                </label>
                <select className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-secondary-foreground focus:border-primary focus:outline-none transition-colors">
                  <option value="">Selecione uma opção</option>
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="reforma">Reforma/Ampliação</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-secondary-foreground/70 mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Descreva seu projeto..."
                />
              </div>
              <Button variant="hero" size="xl" className="w-full">
                Enviar Mensagem
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
