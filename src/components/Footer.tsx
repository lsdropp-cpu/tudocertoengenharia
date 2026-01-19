import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";
const Footer = () => {
  const socialLinks = [{
    icon: Instagram,
    href: "https://www.instagram.com/tudocerto.engenharia",
    label: "Instagram"
  }, {
    icon: Facebook,
    href: "#",
    label: "Facebook"
  }, {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn"
  }, {
    icon: Youtube,
    href: "#",
    label: "YouTube"
  }];
  const quickLinks = [{
    label: "Início",
    href: "#inicio"
  }, {
    label: "Sobre",
    href: "#sobre"
  }, {
    label: "Vantagens",
    href: "#vantagens"
  }, {
    label: "Projetos",
    href: "#projetos"
  }, {
    label: "Serviços",
    href: "#servicos"
  }, {
    label: "Contato",
    href: "#contato"
  }];
  return <footer className="bg-dark-bg text-secondary-foreground border-t border-secondary-foreground/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <img alt="Tudo Certo Engenharia" className="h-16 mb-6" src="/lovable-uploads/51dc7b53-c772-475b-a308-c600c47571bd.png" />
            <p className="text-secondary-foreground/60 max-w-md mb-6">
              Especialistas em construção com tecnologia Steel Frame. 
              Transformamos seus projetos em realidade com qualidade, 
              sustentabilidade e inovação.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => <a key={index} href={social.href} aria-label={social.label} className="w-10 h-10 rounded-lg bg-dark-card border border-secondary-foreground/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                  <social.icon className="w-5 h-5" />
                </a>)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => <li key={index}>
                  <a href={link.href} className="text-secondary-foreground/60 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-xl mb-6">Serviços</h4>
            <ul className="space-y-3">
              <li className="text-secondary-foreground/60">Casas Residenciais</li>
              <li className="text-secondary-foreground/60">Edifícios Comerciais</li>
              <li className="text-secondary-foreground/60">Galpões Industriais</li>
              <li className="text-secondary-foreground/60">Projetos Sob Medida</li>
              <li className="text-secondary-foreground/60">Consultoria Técnica</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/50">
            <p>
              © {new Date().getFullYear()} Tudo Certo Engenharia. Todos os direitos reservados.
            </p>
            <p>
              Construindo com <span className="text-primary">♥</span> e Steel Frame
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;