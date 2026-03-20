import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, RefreshCw, Route, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { syncToExternal } from "@/lib/externalSupabase";
import MiniCalendar from "./MiniCalendar";
import RouteModal from "./RouteModal";
import ClientModal from "./ClientModal";

const DIAS_SEMANA = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
const DIAS_LABEL: Record<string, string> = {
  seg: "Segunda", ter: "Terça", qua: "Quarta", qui: "Quinta",
  sex: "Sexta", sab: "Sábado", dom: "Domingo",
};

function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getDiaSemana(date: Date): string {
  const idx = date.getDay();
  return DIAS_SEMANA[(idx + 6) % 7];
}

function formatPhone(phone: string): string {
  if (!phone) return "";
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 13) return `+${clean.slice(0, 2)} (${clean.slice(2, 4)}) ${clean.slice(4, 9)}-${clean.slice(9)}`;
  if (clean.length === 11) return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  return phone;
}

type SortCol = "nome" | "telefone" | "cidade" | "rota" | "Ativo";

export default function AdminCRM() {
  const [clients, setClients] = useState<any[]>([]);
  const [rotas, setRotas] = useState<any[]>([]);
  // pedidosSemana kept for potential future use
  // const [pedidosSemana, setPedidosSemana] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [filterRota, setFilterRota] = useState("all");
  const [activeTab, setActiveTab] = useState("ativos");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterByDay, setFilterByDay] = useState(false);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const [sortCol, setSortCol] = useState<SortCol>("nome");
  const [sortAsc, setSortAsc] = useState(true);

  // const currentWeek = getISOWeek(selectedDate);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsRes, rotasRes] = await Promise.all([
        supabase.from("crm_carvaomascate").select("*").order("nome", { ascending: true }),
        supabase.from("rotas_carvao").select("*").order("nome", { ascending: true }),
      ]);
      if (clientsRes.error) throw clientsRes.error;
      if (rotasRes.error) throw rotasRes.error;
      setClients(clientsRes.data || []);
      setRotas(rotasRes.data || []);
    } catch (e: any) {
      setError(e.message);
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  // pedidos_semana_carvao effect removed — disparo is on crm_carvaomascate now

  // Handlers — write local then sync to external
  const handleToggleDisparo = async (clientId: number, telefone: string, currentVal: boolean) => {
    try {
      const newVal = !currentVal;
      const { error } = await supabase.from("crm_carvaomascate").update({ disparo: newVal }).eq("id", clientId);
      if (error) throw error;
      setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, disparo: newVal } : c));
      syncToExternal({ table: "crm_carvaomascate", action: "update", data: { disparo: newVal }, match: { telefone } });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveClient = async (id: string | null, data: any) => {
    try {
      if (id) {
        const client = clients.find((c) => String(c.id) === String(id));
        const telefone = data.telefone || client?.telefone;
        const { error } = await supabase.from("crm_carvaomascate").update(data).eq("id", Number(id));
        if (error) throw error;
        setClients((prev) => prev.map((c) => String(c.id) === String(id) ? { ...c, ...data } : c));
        // Sync by telefone
        syncToExternal({ table: "crm_carvaomascate", action: "update", data, match: { telefone } });
      } else {
        const { data: result, error } = await supabase.from("crm_carvaomascate").insert(data).select();
        if (error) throw error;
        if (result && result[0]) {
          setClients((prev) => [...prev, result[0]]);
        }
        // Sync external via upsert (telefone as conflict key)
        syncToExternal({ table: "crm_carvaomascate", action: "upsert", data });
      }
      toast({ title: "Cliente salvo!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveRota = async (data: any) => {
    try {
      if (data.id) {
        const { error } = await supabase.from("rotas_carvao").update(data).eq("id", data.id);
        if (error) throw error;
        setRotas((prev) => prev.map((r) => r.id === data.id ? { ...r, ...data } : r));
        syncToExternal({ table: "rotas_carvao", action: "update", data, match: { nome: data.nome } });
      } else {
        const { data: result, error } = await supabase.from("rotas_carvao").insert(data).select();
        if (error) throw error;
        if (result && result[0]) {
          setRotas((prev) => [...prev, result[0]]);
        }
        syncToExternal({ table: "rotas_carvao", action: "upsert", data });
      }
      toast({ title: "Rota salva!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const handleDeleteRota = async (id: string) => {
    try {
      const rota = rotas.find((r) => r.id === id);
      const { error } = await supabase.from("rotas_carvao").delete().eq("id", id);
      if (error) throw error;
      setRotas((prev) => prev.filter((r) => r.id !== id));
      if (rota) syncToExternal({ table: "rotas_carvao", action: "delete", match: { nome: rota.nome } });
      toast({ title: "Rota removida!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const handleUpdateField = async (clientId: number, field: string, value: any) => {
    try {
      const client = clients.find((c) => c.id === clientId);
      const { error } = await supabase.from("crm_carvaomascate").update({ [field]: value }).eq("id", clientId);
      if (error) throw error;
      setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, [field]: value } : c));
      if (client?.telefone) {
        syncToExternal({ table: "crm_carvaomascate", action: "update", data: { [field]: value }, match: { telefone: client.telefone } });
      }
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  // Filtering + Sorting (without Ativo filter — tabs handle that)
  const filteredClients = useMemo(() => {
    let result = [...clients];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((c) =>
        (c.nome || "").toLowerCase().includes(s) ||
        (c.telefone || "").includes(s) ||
        (c.cidade || "").toLowerCase().includes(s)
      );
    }
    if (filterRota !== "all") {
      const rotaFilter = filterRota === "__none__" ? "" : filterRota;
      result = result.filter((c) => (c.rota || "") === rotaFilter);
    }
    if (filterByDay) {
      const dia = getDiaSemana(selectedDate);
      result = result.filter((c) => c.dia_visita === dia);
    }
    result.sort((a, b) => {
      let av = a[sortCol] || "";
      let bv = b[sortCol] || "";
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return result;
  }, [clients, search, filterRota, filterByDay, selectedDate, sortCol, sortAsc]);

  // Tab-based categorization
  const isInativo = (c: any) => c.Ativo === "NÃO" || c.Ativo === "NAO";
  const isAtivo = (c: any) => !isInativo(c) && !!c.cidade;
  const isFaltaDados = (c: any) => !isInativo(c) && !c.cidade;

  const clientsAtivos = useMemo(() => filteredClients.filter(isAtivo), [filteredClients]);
  const clientsInativos = useMemo(() => filteredClients.filter(isInativo), [filteredClients]);
  const clientsFaltaDados = useMemo(() => filteredClients.filter(isFaltaDados), [filteredClients]);

  const tabClients = activeTab === "ativos" ? clientsAtivos : activeTab === "inativos" ? clientsInativos : clientsFaltaDados;

  // Compute which routes have at least one active client (for calendar dots)
  const activeRouteNames = useMemo(() => {
    const ativosAll = clients.filter(isAtivo);
    const names = new Set<string>();
    ativosAll.forEach((c) => { if (c.rota) names.add(c.rota); });
    return Array.from(names);
  }, [clients]);

  // pedidoMap removed — disparo is directly on client record

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const totalClientes = clients.length;
  const totalAtivos = clients.filter(isAtivo).length;
  const totalInativos = clients.filter(isInativo).length;
  const totalFaltaDados = clients.filter(isFaltaDados).length;
  const disparosAtivos = clients.filter((c) => c.disparo).length;
  const diaLabel = DIAS_LABEL[getDiaSemana(selectedDate)] || "";

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando CRM...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{totalClientes}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-500">{totalAtivos}</p>
          <p className="text-xs text-muted-foreground">Ativos</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-500">{totalInativos}</p>
          <p className="text-xs text-muted-foreground">Inativos</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-500">{totalFaltaDados}</p>
          <p className="text-xs text-muted-foreground">Falta Dados</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowRouteModal(true)}>
          <Route className="w-4 h-4 mr-1" /> Rotas
        </Button>
        <Button size="sm" onClick={() => setEditingClient({})}>
          <Plus className="w-4 h-4 mr-1" /> Novo Cliente
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={loadData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-3">
          <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} rotas={rotas} activeRouteNames={activeRouteNames} />

          <div className="bg-card border border-border rounded-lg p-3 space-y-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={filterByDay} onCheckedChange={(v) => setFilterByDay(!!v)} />
              <span>Filtrar por dia: <strong className="text-primary">{diaLabel}</strong></span>
            </label>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Semana</p>
              <p className="text-sm font-bold text-primary">{currentWeek}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Filtrar Rota</p>
              <Select value={filterRota} onValueChange={setFilterRota}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as rotas</SelectItem>
                  <SelectItem value="__none__">Sem rota</SelectItem>
                  {rotas.map((r) => (
                    <SelectItem key={r.id} value={r.nome}>{r.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main table */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive flex items-center justify-between">
              <span>⚠️ {error}</span>
              <Button variant="outline" size="sm" onClick={loadData}>Tentar novamente</Button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="ativos" className="flex-1">Ativos ({clientsAtivos.length})</TabsTrigger>
              <TabsTrigger value="inativos" className="flex-1">Inativos ({clientsInativos.length})</TabsTrigger>
              <TabsTrigger value="faltaDados" className="flex-1">Falta Dados ({clientsFaltaDados.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-3">
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="cursor-pointer" onClick={() => handleSort("nome")}>
                        Nome {sortCol === "nome" && (sortAsc ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("telefone")}>
                        Telefone {sortCol === "telefone" && (sortAsc ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="cursor-pointer hidden sm:table-cell" onClick={() => handleSort("cidade")}>
                        Cidade {sortCol === "cidade" && (sortAsc ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("rota")}>
                        Rota {sortCol === "rota" && (sortAsc ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("Ativo")}>
                        Status {sortCol === "Ativo" && (sortAsc ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="text-center">Disparo</TableHead>
                      <TableHead className="text-center w-[60px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tabClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {search || filterRota !== "all" || filterByDay
                            ? "Nenhum cliente encontrado com esses filtros"
                            : "Nenhum cliente nesta categoria"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      tabClients.map((c) => {
                        return (
                          <TableRow key={c.id}>
                            <TableCell>
                              <div className="font-semibold text-sm">{c.nome || "—"}</div>
                              {c.observacoes_rota && (
                                <div className="text-[11px] text-muted-foreground mt-0.5">{c.observacoes_rota}</div>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {formatPhone(c.telefone)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm">
                              {c.cidade || "—"}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={c.rota || "__none__"}
                                onValueChange={(v) => handleUpdateField(c.id, "rota", v === "__none__" ? null : v)}
                              >
                                <SelectTrigger className="h-7 text-xs w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__">—</SelectItem>
                                  {rotas.map((r) => (
                                    <SelectItem key={r.id} value={r.nome}>{r.nome}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  isInativo(c)
                                    ? "bg-red-500/15 text-red-400 border-red-500/30"
                                    : !c.cidade
                                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                    : "bg-green-500/15 text-green-400 border-green-500/30"
                                }
                              >
                                {isInativo(c) ? "Inativo" : !c.cidade ? "Falta Dados" : "Ativo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={!!c.disparo}
                                onCheckedChange={() => handleToggleDisparo(c.id, c.telefone, !!c.disparo)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingClient(c)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <RouteModal
        open={showRouteModal}
        rotas={rotas}
        onClose={() => setShowRouteModal(false)}
        onSave={handleSaveRota}
        onDelete={handleDeleteRota}
      />

      {editingClient && (
        <ClientModal
          open={!!editingClient}
          client={editingClient}
          rotas={rotas}
          onClose={() => setEditingClient(null)}
          onSave={handleSaveClient}
        />
      )}
    </div>
  );
}
