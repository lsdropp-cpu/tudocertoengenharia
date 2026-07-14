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
      const mensagem = `[SHINGLE]\nEstágio: ${data.stage}\nÁrea: ${data.area}\nDecisão: ${data.decision}`;
      const { error } = await supabase.from("leads").insert({
        nome: data.name,
        telefone: data.phone,
        email: "nao-informado@shingle.local",
        cidade: "Não informado",
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
            email: "",
            phone: data.phone,
            nome: data.name,
            cidade: "",
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
            </p>
            <Button variant="hero" size="lg" className="w-full" onClick={() => handleClose(false)}>
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
