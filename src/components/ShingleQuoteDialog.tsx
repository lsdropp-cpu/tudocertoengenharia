import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STAGE_OPTIONS = [
  "Tenho projeto e/ou medidas",
  "Projeto em andamento",
  "Cotando fornecedores",
  "Pesquisando / ideia inicial",
];

const AREA_OPTIONS = [
  "Mais de 250 m²",
  "151 a 250 m²",
  "101 a 150 m²",
  "Até 100 m²",
];

const DECISION_OPTIONS = [
  "Sim, já decidido",
  "Quase decidido",
  "Avaliando outras opções",
  "Ainda não conheço o sistema",
];

const ShingleQuoteDialog = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    stage: "",
    area: "",
    decision: "",
    name: "",
    phone: "",
  });

  const reset = () => {
    setStep(1);
    setDone(false);
    setData({ stage: "", area: "", decision: "", name: "", phone: "" });
  };

  const handleClose = (o: boolean) => {
    onOpenChange(o);
    if (!o) setTimeout(reset, 200);
  };

  const progress = done ? 100 : (step / 3) * 100;
  const isFinal = step === 3;

  const canNext =
    (step === 1 && data.stage) ||
    (step === 2 && data.area) ||
    (step === 3 && data.decision && data.name && data.phone);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const email = "nao-informado@shingle.local";
      const cidade = "Não informado";
      const mensagem = `[SHINGLE]\nEstágio: ${data.stage}\nÁrea: ${data.area}\nDecisão: ${data.decision}`;
      const { error } = await supabase.from("leads").insert({
        nome: data.name,
        telefone: data.phone,
        email,
        cidade,
        estagio: data.stage,
        mensagem,
      });
      if (error) throw error;

      // Meta Ads (Pixel + Conversions API com dedup)
      try {
        const eventId = `lead_shingle_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        if (typeof (window as any).fbq === "function") {
          (window as any).fbq("track", "Lead", {
            content_name: "Cotação Shingle",
            content_category: "Telha Shingle",
            currency: "BRL",
            value: 1,
          }, { eventID: eventId });
        }
        const getCookie = (name: string) => {
          const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
          return m ? decodeURIComponent(m[1]) : undefined;
        };
        supabase.functions.invoke("meta-capi", {
          body: {
            event_id: eventId,
            email,
            phone: data.phone,
            nome: data.name,
            cidade,
            event_source_url: window.location.href,
            fbp: getCookie("_fbp"),
            fbc: getCookie("_fbc"),
            user_agent: navigator.userAgent,
          },
        }).catch((e) => console.warn("meta-capi falhou:", e));
      } catch (e) {
        console.warn("Tracking Meta falhou:", e);
      }

      try {
        // @ts-ignore
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "conversion", {
            send_to: "AW-18229608760/GPxtCNbV37wcELiCx_RD",
            value: 1.0,
            currency: "BRL",
          });
        }
      } catch {}

      setDone(true);
    } catch (err: any) {
      toast({ title: "Erro ao enviar", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const OptionList = ({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="space-y-3">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all ${
              selected
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected ? "border-primary" : "border-muted-foreground/40"
              }`}
            >
              {selected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </span>
            <span className="text-foreground">{opt}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {done ? (
          <div className="p-8 text-center">
            <h2 className="font-display text-2xl md:text-3xl mb-6">
              Solicitação Enviada
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Pronto! Suas respostas já estão com a gente. Em breve um
              especialista vai entrar em contato pelo seu WhatsApp para te
              ajudar com a cotação.
              <span className="block mt-2">Se preferir, fale diretamente com nosso especialista agora:</span>
            </p>
            <a
              href="https://wa.me/555195648802?text=Oi,%20vim%20pelo%20formul%C3%A1rio%20de%20Shingle%20do%20site."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors px-6 py-3 font-medium w-full mb-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.413c-.003 6.555-5.338 11.89-11.893 11.89a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Falar no WhatsApp
            </a>
            <Button variant="outline" size="lg" className="w-full" onClick={() => handleClose(false)}>
              Fechar
            </Button>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <h2 className="font-display text-xl md:text-2xl text-center mb-6">
              Qualifique seu Projeto e Receba uma Cotação Personalizada
            </h2>

            {/* Progress */}
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <span>Passo {step} de 3</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-8">
              <div
                className={`h-full transition-all ${isFinal ? "bg-green-500" : "bg-primary"}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Steps */}
            {step === 1 && (
              <>
                <h3 className="font-display text-lg mb-4">Qual o estágio do seu projeto?</h3>
                <OptionList
                  options={STAGE_OPTIONS}
                  value={data.stage}
                  onChange={(v) => setData({ ...data, stage: v })}
                />
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="font-display text-lg mb-4">Área aproximada do telhado?</h3>
                <OptionList
                  options={AREA_OPTIONS}
                  value={data.area}
                  onChange={(v) => setData({ ...data, area: v })}
                />
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="font-display text-lg mb-4">Você já decidiu usar a telha shingle?</h3>
                <OptionList
                  options={DECISION_OPTIONS}
                  value={data.decision}
                  onChange={(v) => setData({ ...data, decision: v })}
                />
                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="font-display text-base mb-2 block">Qual seu nome?</Label>
                    <Input
                      placeholder="Seu nome completo"
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="font-display text-base mb-2 block">Qual seu WhatsApp?</Label>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={data.phone}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  Voltar
                </Button>
              )}
              {!isFinal ? (
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={!canNext}
                  onClick={() => setStep(step + 1)}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  disabled={!canNext || loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Enviando..." : "Receber Cotação"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShingleQuoteDialog;
