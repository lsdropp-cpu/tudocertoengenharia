import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, Share, Plus, BellRing, Download, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Install = () => {
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else if (/android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore - iOS Safari
      window.navigator.standalone === true;
    setInstalled(standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-hero-gradient text-secondary-foreground p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center gap-3 mb-6">
          <div className="w-24 h-24 rounded-2xl bg-dark-card border border-primary/20 flex items-center justify-center shadow-glow">
            <img src={logo} alt="Tudo Certo" className="w-16 h-16 object-contain" />
          </div>
          <span className="font-display text-xl tracking-[0.2em]">
            TUDO <span className="text-primary">CERTO</span>
          </span>
        </Link>

        <div className="bg-dark-card/80 backdrop-blur-xl rounded-2xl p-6 border border-secondary-foreground/10 shadow-glow">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="text-primary" />
            <h1 className="font-display text-2xl">Instalar o app</h1>
          </div>
          <p className="text-sm text-secondary-foreground/60 mb-6">
            Tenha o CRM na tela inicial do seu celular, com notificações de novos leads.
          </p>

          {installed ? (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4 text-center">
              <BellRing className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold">App já instalado!</p>
              <Link to="/admin">
                <Button variant="hero" size="lg" className="mt-3 w-full">
                  Abrir CRM <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Botões de plataforma */}
              <div className="flex gap-2 mb-5">
                {(["ios", "android", "desktop"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      platform === p
                        ? "bg-primary text-primary-foreground"
                        : "bg-dark-bg border border-secondary-foreground/10 text-secondary-foreground/60"
                    }`}
                  >
                    {p === "ios" ? "iPhone" : p === "android" ? "Android" : "Desktop"}
                  </button>
                ))}
              </div>

              {platform === "ios" && (
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <span>Abra este site no <strong>Safari</strong> (não funciona em outros navegadores no iPhone).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <span>Toque no botão <Share className="inline w-4 h-4 mx-1" /> <strong>Compartilhar</strong> na barra inferior.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <span>Escolha <Plus className="inline w-4 h-4 mx-1" /> <strong>Adicionar à Tela de Início</strong>.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">4</span>
                    <span>Confirme em <strong>Adicionar</strong>. Pronto — o ícone aparece na tela inicial!</span>
                  </li>
                </ol>
              )}

              {platform === "android" && (
                <>
                  {deferredPrompt && (
                    <Button variant="hero" size="lg" onClick={triggerInstall} className="w-full mb-4">
                      <Download className="w-4 h-4" /> Instalar agora
                    </Button>
                  )}
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</span>
                      <span>Abra no <strong>Chrome</strong> ou <strong>Edge</strong>.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</span>
                      <span>Toque no menu <strong>⋮</strong> (três pontos) no canto superior.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</span>
                      <span>Escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</span>
                    </li>
                  </ol>
                </>
              )}

              {platform === "desktop" && (
                <>
                  {deferredPrompt ? (
                    <Button variant="hero" size="lg" onClick={triggerInstall} className="w-full mb-4">
                      <Download className="w-4 h-4" /> Instalar agora
                    </Button>
                  ) : (
                    <p className="text-sm text-secondary-foreground/70">
                      Clique no ícone de instalação na barra de endereço do navegador (Chrome / Edge), ou abra esta página no celular para instalar como app.
                    </p>
                  )}
                </>
              )}
            </>
          )}

          <div className="mt-6 pt-4 border-t border-secondary-foreground/10">
            <Link to="/admin" className="text-sm text-secondary-foreground/60 hover:text-primary flex items-center justify-center gap-1">
              Continuar no navegador <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;
