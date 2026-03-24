import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Search, Package, RefreshCw, User, MapPin, Phone, Mail, FileText, Users } from "lucide-react";
import AdminCRM from "@/components/admin/AdminCRM";
import PageMeta from "@/components/PageMeta";
import { OrderTableSkeleton } from "@/components/OrderSkeleton";

type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  cnpj: string | null;
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  cep: string | null;
  complement: string | null;
};

type OrderWithCustomer = {
  id: string;
  order_number: string;
  status: string;
  items: any;
  created_at: string;
  customer_id: string;
  customers: CustomerDetails | null;
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  processing: "Em produção",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const AdminPedidos = () => {
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const adminToken = sessionStorage.getItem("admin-token");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin", { replace: true });
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(name, email, phone, cnpj, street, number, neighborhood, city, cep, complement)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erro", description: "Erro ao carregar pedidos", variant: "destructive" });
    } else {
      setOrders((data as any) || []);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-update-order", {
        body: { orderId, status: newStatus },
        headers: { "x-admin-token": adminToken! },
      });

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      toast({ title: "Status atualizado!" });
    } catch {
      toast({ title: "Erro", description: "Erro ao atualizar status", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin-token");
    navigate("/admin");
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      o.order_number.toLowerCase().includes(term) ||
      o.customers?.name?.toLowerCase().includes(term) ||
      o.customers?.email?.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  const formatItems = (items: any) => {
    if (!Array.isArray(items)) return "-";
    return items
      .map((item: any) => `${item.brand || item.name || item.product} ${item.weight || ""} (${item.quantity || 1}x)`.trim())
      .join(", ");
  };

  const formatAddress = (c: CustomerDetails) => {
    const parts = [
      c.street,
      c.number ? `nº ${c.number}` : null,
      c.complement,
      c.neighborhood,
      c.city,
      c.cep ? `CEP ${c.cep}` : null,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Não informado";
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Painel Admin" description="Gerencie pedidos e clientes Carvão Mascate." path="/admin/pedidos" />
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground font-oswald">
              Painel Administrativo
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="pedidos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pedidos" className="gap-1.5">
              <Package className="w-4 h-4" /> Pedidos
            </TabsTrigger>
            <TabsTrigger value="crm" className="gap-1.5">
              <Users className="w-4 h-4" /> Clientes & Rotas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pedidos" className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por pedido, cliente ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="processing">Em produção</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchOrders} title="Atualizar">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(statusLabels).map(([key, label]) => {
            const count = orders.filter((o) => o.status === key).length;
            return (
              <div
                key={key}
                className="bg-card border border-border rounded-lg p-3 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
              >
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        {loading ? (
          <div className="border border-border rounded-lg p-4">
            <OrderTableSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum pedido encontrado
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="font-mono font-bold text-primary">
                      #{order.order_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {order.customers?.name || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customers?.phone || ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {formatItems(order.items)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[order.status] || ""}
                      >
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={order.status}
                        onValueChange={(v) => updateStatus(order.id, v)}
                        disabled={updatingId === order.id}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([k, v]) => (
                            <SelectItem key={k} value={k}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {filtered.length} pedido(s) encontrado(s) — Total: {orders.length}
        </p>
          </TabsContent>

          <TabsContent value="crm">
            <AdminCRM />
          </TabsContent>
        </Tabs>
      </main>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-oswald">
              <Package className="w-5 h-5 text-primary" />
              Pedido #{selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-5">
              {/* Status & Date */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={statusColors[selectedOrder.status] || ""}>
                  {statusLabels[selectedOrder.status] || selectedOrder.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> Cliente
                </h3>
                <p className="text-sm text-foreground font-medium">{selectedOrder.customers?.name || "-"}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {selectedOrder.customers?.email || "-"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  {selectedOrder.customers?.phone || "-"}
                </div>
                {selectedOrder.customers?.cnpj && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-3.5 h-3.5" />
                    CNPJ: {selectedOrder.customers.cnpj}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Endereço
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.customers ? formatAddress(selectedOrder.customers) : "Não informado"}
                </p>
              </div>

              {/* Items */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" /> Itens
                </h3>
                {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex justify-between">
                        <span>{item.brand || item.name || item.product} {item.weight || ""}</span>
                        <span className="font-medium text-foreground">{item.quantity || 1}x</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem itens</p>
                )}
              </div>

              {/* Status Update */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Alterar Status</h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(v) => updateStatus(selectedOrder.id, v)}
                  disabled={updatingId === selectedOrder.id}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPedidos;
