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
import { Search, Plus, RefreshCw, Route, Pencil } from "lucide-react";
import { fetchTable, updateRow, insertRow, deleteRow } from "@/lib/externalSupabase";
import MiniCalendar from "./MiniCalendar";
import RouteModal from "./RouteModal";
import ClientModal from "./ClientModal";

// Helpers
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
  const [pedidosSemana, setPedidosSemana] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [filterRota, setFilterRota] = useState("all");
  const [filterAtivo, setFilterAtivo] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterByDay, setFilterByDay] = useState(false);

  // Modals
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  // Sort
  const [sortCol, setSortCol] = useState<SortCol>("nome");
  const [sortAsc, setSortAsc] = useState(true);

  const currentWeek = getISOWeek(selectedDate);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsData, rotasData, pedidosData] = await Promise.all([
        fetchTable("crm_carvaomascate", { order: "nome.asc" }),
        fetchTable("rotas_carvao", { order: "nome.asc" }),
        fetchTable("pedidos_semana_carvao", { filters: `semana=eq.${currentWeek}` }),
      ]);
      setClients(clientsData || []);
      setRotas(rotasData || []);
      setPedidosSemana(pedidosData || []);
    } catch (e: any) {
      setError(e.message);
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  }, [currentWeek, toast]);

  useEffect(() => { loadData(); }, [loadData]);

  // Reload pedidos when week changes
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTable("pedidos_semana_carvao", { filters: `semana=eq.${currentWeek}` });
        setPedidosSemana(data || []);
      } catch { /* ignore */ }
    })();
  }, [currentWeek]);

  // Handlers
  const handleTogglePedido = async (clientId: string, telefone: string) => {
    try {
      const existing = pedidosSemana.find((p: any) => p.cliente_id === clientId && p.semana === currentWeek);
      if (existing) {
        const newVal = !existing.confirmado;
        await updateRow("pedidos_semana_carvao", existing.id, {
          confirmado: newVal,
          data_confirmacao: newVal ? new Date().toISOString() : null,
        });
        setPedidosSemana((prev) => prev.map((p) => p.id === existing.id ? { ...p, confirmado: newVal } : p));
      } else {
        const result = await insertRow("pedidos_semana_carvao", {
          cliente_id: clientId,
          telefone,
          semana: currentWeek,
          confirmado: true,
          data_confirmacao: new Date().toISOString(),
        });
        if (Array.isArray(result) && result[0]) {
          setPedidosSemana((prev) => [...prev, result[0]]);
        }
      }
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveClient = async (id: string | null, data: any) => {
    try {
      if (id) {
        await updateRow("crm_carvaomascate", id, data);
        setClients((prev) => prev.map((c) => c.id === id ? { ...c, ...data } : c));
      } else {
        const result = await insertRow("crm_carvaomascate", data);
        if (Array.isArray(result) && result[0]) {
          setClients((prev) => [...prev, result[0]]);
        }
      }
      toast({ title: "Cliente salvo!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveRota = async (data: any) => {
    try {
      if (data.id) {
        await updateRow("rotas_carvao", data.id, data);
        setRotas((prev) => prev.map((r) => r.id === data.id ? { ...r, ...data } : r));
      } else {
        const result = await insertRow("rotas_carvao", data);
        if (Array.isArray(result) && result[0]) {
          setRotas((prev) => [...prev, result[0]]);
        }
      }
      toast({ title: "Rota salva!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const handleDeleteRota = async (id: string) => {
    try {
      await deleteRow("rotas_carvao", id);
      setRotas((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Rota removida!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const handleUpdateField = async (clientId: string, field: string, value: any) => {
    try {
      await updateRow("crm_carvaomascate", clientId, { [field]: value });
      setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, [field]: value } : c));
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  // Filtering + Sorting
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
    if (filterRota !== "all") result = result.filter((c) => (c.rota || "") === filterRota);
    if (filterAtivo !== "all") result = result.filter((c) => (c.Ativo || "SIM") === filterAtivo);
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
  }, [clients, search, filterRota, filterAtivo, filterByDay, selectedDate, sortCol, sortAsc]);

  const pedidoMap = useMemo(() => {
    const map: Record<string, any> = {};
    pedidosSemana.forEach((p) => { map[p.cliente_id] = p; });
    return map;
  }, [pedidosSemana]);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  // Stats
  const totalClientes = clients.length;
  const ativos = clients.filter((c) => (c.Ativo || "SIM") === "SIM").length;
  const pedidosConfirmados = pedidosSemana.filter((p) => p.confirmado).length;
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
          <p className="text-2xl font-bold text-green-500">{ativos}</p>
          <p className="text-xs text-muted-foreground">Ativos</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-primary">{pedidosConfirmados}</p>
          <p className="text-xs text-muted-foreground">Pedidos {currentWeek}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-violet-400">{filteredClients.length}</p>
          <p className="text-xs text-muted-foreground">Filtrados</p>
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
          <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />

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

            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Select value={filterAtivo} onValueChange={setFilterAtivo}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="SIM">Ativos</SelectItem>
                  <SelectItem value="NAO">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main table */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Search */}
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
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""}
            </span>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive flex items-center justify-between">
              <span>⚠️ {error}</span>
              <Button variant="outline" size="sm" onClick={loadData}>Tentar novamente</Button>
            </div>
          )}

          {/* Table */}
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
                    Ativo {sortCol === "Ativo" && (sortAsc ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center">Pedido {currentWeek.split("-")[1]}</TableHead>
                  <TableHead className="text-center w-[60px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {search || filterRota !== "all" || filterAtivo !== "all" || filterByDay
                        ? "Nenhum cliente encontrado com esses filtros"
                        : "Nenhum cliente cadastrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((c) => {
                    const pedido = pedidoMap[c.id];
                    const isConfirmed = pedido?.confirmado || false;
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
                              (c.Ativo || "SIM") === "SIM"
                                ? "bg-green-500/15 text-green-400 border-green-500/30"
                                : "bg-red-500/15 text-red-400 border-red-500/30"
                            }
                          >
                            {(c.Ativo || "SIM") === "SIM" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isConfirmed}
                            onCheckedChange={() => handleTogglePedido(c.id, c.telefone)}
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
