import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LogOut, Mail, Phone, MapPin, RefreshCw, Trash2 } from "lucide-react";

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

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
    setLeads(data || []);
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

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-hero-gradient text-secondary-foreground flex items-center justify-center p-4">
        <div className="max-w-md text-center bg-dark-card p-8 rounded-2xl border border-secondary-foreground/10">
          <h1 className="font-display text-2xl mb-3">Acesso restrito</h1>
          <p className="text-secondary-foreground/70 mb-2">
            Sua conta <strong>{userEmail}</strong> ainda não tem permissão de administrador.
          </p>
          <p className="text-xs text-secondary-foreground/50 mb-6 break-all">
            Seu ID: {userId}
          </p>
          <p className="text-sm text-secondary-foreground/60 mb-6">
            Peça ao administrador do projeto para liberar seu acesso.
          </p>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl">Dashboard de Leads</h1>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLeads}>
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total" value={leads.length} />
          <StatCard label="Novos" value={leads.filter((l) => l.status === "novo").length} />
          <StatCard label="Contatados" value={leads.filter((l) => l.status === "contatado").length} />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        ) : leads.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum lead ainda.</p>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{lead.nome}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    <a href={`tel:${lead.telefone}`} className="flex items-center gap-1 hover:text-primary">
                      <Phone className="w-3.5 h-3.5" /> {lead.telefone}
                    </a>
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="w-3.5 h-3.5" /> {lead.email}
                    </a>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {lead.cidade}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="px-3 py-2 rounded-md bg-background border border-input text-sm"
                  >
                    <option value="novo">Novo</option>
                    <option value="contatado">Contatado</option>
                    <option value="negociacao">Em negociação</option>
                    <option value="fechado">Fechado</option>
                    <option value="perdido">Perdido</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(lead.id)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="font-display text-4xl text-primary mt-1">{value}</div>
  </div>
);

export default Admin;
