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

const Admin = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
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
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
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
                  className={`shrink-0 w-[88vw] sm:w-80 snap-start rounded-xl border bg-card/60 flex flex-col transition-colors ${
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
        )}
      </main>
    </div>
  );
};

export default Admin;
