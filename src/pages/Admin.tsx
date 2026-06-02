import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  LogOut,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Trash2,
  MessageSquare,
  Clock,
  GripVertical,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  status: string;
  estagio: string;
  mensagem: string | null;
  created_at: string;
}

const STAGES: { id: string; label: string; accent: string }[] = [
  { id: "novo", label: "Novo", accent: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { id: "contatado", label: "Contatado", accent: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { id: "negociacao", label: "Em negociação", accent: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  { id: "proposta", label: "Proposta", accent: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  { id: "fechado", label: "Fechado", accent: "bg-primary/15 text-primary border-primary/40" },
  { id: "perdido", label: "Perdido", accent: "bg-red-500/15 text-red-300 border-red-500/30" },
];

const normalizeStage = (s: string | null | undefined) => {
  const v = (s || "novo").toLowerCase();
  return STAGES.find((x) => x.id === v)?.id || "novo";
};

const formatPhone = (p: string) => {
  const d = p.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return p;
};

type StageDef = { id: string; label: string; accent: string };

function MobileKanban({
  stages,
  grouped,
  mobileStage,
  setMobileStage,
  totalLeads,
  onSelect,
  onMove,
  onDelete,
}: {
  stages: StageDef[];
  grouped: Record<string, Lead[]>;
  mobileStage: string;
  setMobileStage: (s: string) => void;
  totalLeads: number;
  onSelect: (id: string) => void;
  onMove: (id: string, stage: string) => void;
  onDelete: (id: string) => void;
}) {
  const idx = Math.max(0, stages.findIndex((s) => s.id === mobileStage));
  const prev = () => setMobileStage(stages[(idx - 1 + stages.length) % stages.length].id);
  const next = () => setMobileStage(stages[(idx + 1) % stages.length].id);

  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next();
      else prev();
    }
    touchRef.current = null;
  };

  const items = grouped[mobileStage] || [];
  const stage = stages[idx];

  return (
    <div className="sm:hidden">
      {/* Abas roláveis */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-2 px-2 snap-x scrollbar-thin">
        {stages.map((s) => {
          const count = (grouped[s.id] || []).length;
          const active = mobileStage === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setMobileStage(s.id)}
              className={`shrink-0 snap-start px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                active ? `${s.accent} scale-105` : "border-border bg-card/40 text-muted-foreground"
              }`}
            >
              {s.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  active ? "bg-background/30" : "bg-muted text-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Navegação + indicador de página */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <button
          onClick={prev}
          aria-label="Estágio anterior"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded-md border border-border bg-card/40"
        >
          <ChevronLeft className="w-4 h-4" />
          {stages[(idx - 1 + stages.length) % stages.length].label}
        </button>
        <div className="flex gap-1">
          {stages.map((s, i) => (
            <span
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Próximo estágio"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded-md border border-border bg-card/40"
        >
          {stages[(idx + 1) % stages.length].label}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-[11px] text-muted-foreground mb-2 px-1 flex items-center justify-between">
        <span>
          <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${stage.accent.split(" ")[0]}`} />
          {stage.label} · {items.length} {items.length === 1 ? "lead" : "leads"}
        </span>
        <span>Total: <span className="font-semibold text-foreground">{totalLeads}</span></span>
      </div>

      {/* Cards com swipe */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="space-y-2 min-h-[40vh]"
      >
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-12 border border-dashed border-border rounded-xl">
            Nenhum lead neste estágio
            <div className="text-xs mt-2 opacity-70">← deslize para o lado →</div>
          </div>
        ) : (
          items.map((lead) => (
            <article
              key={lead.id}
              onClick={() => onSelect(lead.id)}
              className="bg-card border border-border rounded-xl p-4 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-base leading-tight">{lead.nome}</h3>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <a
                  href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-foreground"
                >
                  <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                  {formatPhone(lead.telefone)}
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-muted-foreground break-all"
                >
                  <Mail className="w-4 h-4 shrink-0" /> {lead.email}
                </a>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" /> {lead.cidade}
                </div>
              </div>

              {lead.mensagem ? (
                <p className="mt-3 pt-3 border-t border-border/60 text-sm text-foreground/80 line-clamp-2">
                  {lead.mensagem}
                </p>
              ) : null}

              <div
                className="mt-3 pt-3 border-t border-border/60 flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  value={normalizeStage(lead.estagio || lead.status)}
                  onChange={(e) => onMove(lead.id, e.target.value)}
                  className="flex-1 text-xs px-2 py-2 rounded-md bg-background border border-input"
                >
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      Mover para {s.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onDelete(lead.id)}
                  aria-label="Excluir"
                  className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

const Admin = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileStage, setMobileStage] = useState<string>("novo");
  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedId) || null,
    [leads, selectedId],
  );

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((data || []) as Lead[]);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserEmail(session.user.email || "");
      setUserId(session.user.id);

      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      const admin = !!roleRow;
      setIsAdmin(admin);
      if (admin) await fetchLeads();
      else setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  // Realtime new leads
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("leads-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
        fetchLeads();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((l) => l.filter((x) => x.id !== id));
  };

  const moveLead = async (id: string, estagio: string) => {
    const prev = leads;
    setLeads((l) => l.map((x) => (x.id === id ? { ...x, estagio, status: estagio } : x)));
    const { error } = await supabase.from("leads").update({ estagio, status: estagio }).eq("id", id);
    if (error) {
      setLeads(prev);
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const grouped = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    STAGES.forEach((s) => (map[s.id] = []));
    leads.forEach((l) => {
      const s = normalizeStage(l.estagio || l.status);
      map[s].push(l);
    });
    return map;
  }, [leads]);

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-hero-gradient text-secondary-foreground flex items-center justify-center p-4">
        <div className="max-w-md text-center bg-dark-card p-8 rounded-2xl border border-secondary-foreground/10">
          <h1 className="font-display text-2xl mb-3">Acesso restrito</h1>
          <p className="text-secondary-foreground/70 mb-2">
            Sua conta <strong>{userEmail}</strong> ainda não tem permissão de administrador.
          </p>
          <p className="text-xs text-secondary-foreground/50 mb-6 break-all">Seu ID: {userId}</p>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl truncate">CRM de Leads</h1>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={fetchLeads}>
              <RefreshCw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 hidden sm:flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">
            Arraste os cartões entre as colunas para atualizar o estágio.
          </p>
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{leads.length}</span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        ) : (
          <>
            {/* MOBILE: abas + swipe entre estágios */}
            <MobileKanban
              stages={STAGES}
              grouped={grouped}
              mobileStage={mobileStage}
              setMobileStage={setMobileStage}
              totalLeads={leads.length}
              onSelect={(id) => setSelectedId(id)}
              onMove={moveLead}
              onDelete={handleDelete}
            />


            {/* DESKTOP: kanban */}
            <div className="hidden sm:flex gap-3 overflow-x-auto pb-4 snap-x">
              {STAGES.map((stage) => {
                const items = grouped[stage.id] || [];
                const isOver = dragOver === stage.id;
                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(stage.id);
                    }}
                    onDragLeave={() => setDragOver((s) => (s === stage.id ? null : s))}
                    onDrop={(e) => {
                      e.preventDefault();
                      const id = e.dataTransfer.getData("text/plain");
                      setDragOver(null);
                      if (id) moveLead(id, stage.id);
                    }}
                    className={`shrink-0 w-80 snap-start rounded-xl border bg-card/60 flex flex-col transition-colors ${
                      isOver ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="px-3 py-3 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur rounded-t-xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-md border ${stage.accent}`}>
                          {stage.label}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{items.length}</span>
                    </div>

                    <div className="p-2 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                      {items.length === 0 ? (
                        <div className="text-xs text-muted-foreground text-center py-6">
                          Sem leads
                        </div>
                      ) : (
                        items.map((lead) => (
                          <article
                            key={lead.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", lead.id);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onClick={() => setSelectedId(lead.id)}
                            className="group bg-background border border-border rounded-lg p-3 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold leading-tight">{lead.nome}</h3>
                              <GripVertical
                                className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5 cursor-grab active:cursor-grabbing"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            <div className="space-y-1 text-xs text-muted-foreground">
                              <a
                                href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 hover:text-primary break-all"
                              >
                                <Phone className="w-3.5 h-3.5 shrink-0" />
                                {formatPhone(lead.telefone)}
                              </a>
                              <a
                                href={`mailto:${lead.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 hover:text-primary break-all"
                              >
                                <Mail className="w-3.5 h-3.5 shrink-0" /> {lead.email}
                              </a>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 shrink-0" /> {lead.cidade}
                              </div>
                            </div>

                            {lead.mensagem ? (
                              <div className="mt-2 pt-2 border-t border-border/60 text-xs text-foreground/80 flex gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                                <p className="leading-snug whitespace-pre-wrap break-words line-clamp-3">
                                  {lead.mensagem}
                                </p>
                              </div>
                            ) : null}

                            <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                              </span>
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={normalizeStage(lead.estagio || lead.status)}
                                  onChange={(e) => moveLead(lead.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[11px] px-1.5 py-1 rounded bg-background border border-input"
                                >
                                  {STAGES.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.label}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(lead.id);
                                  }}
                                  aria-label="Excluir"
                                  className="p-1 rounded hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>


      <Dialog open={!!selectedLead} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">{selectedLead.nome}</DialogTitle>
                <DialogDescription>
                  Lead recebido em{" "}
                  {new Date(selectedLead.created_at).toLocaleString("pt-BR")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((s) => {
                    const active = normalizeStage(selectedLead.estagio || selectedLead.status) === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => moveLead(selectedLead.id, s.id)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          active ? s.accent : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/55${selectedLead.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Olá ${selectedLead.nome.split(" ")[0]}, falo da Tudo Certo Engenharia sobre o seu pedido de orçamento.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 text-[#25D366] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">WhatsApp</div>
                      <div className="font-medium truncate">{formatPhone(selectedLead.telefone)}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                  </a>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">E-mail</div>
                      <div className="font-medium truncate">{selectedLead.email}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                  </a>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-border text-sm sm:col-span-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Cidade</div>
                      <div className="font-medium">{selectedLead.cidade}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4 bg-muted/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Sobre o projeto
                  </div>
                  {selectedLead.mensagem ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {selectedLead.mensagem}
                    </p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      O lead não escreveu nenhuma descrição.
                    </p>
                  )}
                </div>

                <div className="flex justify-between gap-2 pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleDelete(selectedLead.id);
                      setSelectedId(null);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Excluir lead
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
