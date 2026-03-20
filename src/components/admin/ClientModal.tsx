import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";
import { normalizeRotaArray } from "@/lib/rotaUtils";

const DIAS_SEMANA = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
const DIAS_LABEL: Record<string, string> = {
  seg: "Segunda", ter: "Terça", qua: "Quarta", qui: "Quinta",
  sex: "Sexta", sab: "Sábado", dom: "Domingo",
};

interface ClientModalProps {
  open: boolean;
  client: any;
  rotas: any[];
  onClose: () => void;
  onSave: (id: string | null, data: any) => void;
}

export default function ClientModal({ open, client, rotas, onClose, onSave }: ClientModalProps) {
  const initialRotas = normalizeRotaArray(client?.rota);
  
  const [data, setData] = useState({
    nome: client?.nome || "",
    telefone: client?.telefone || "",
    cidade: client?.cidade || "",
    Ativo: client?.Ativo || "SIM",
    dia_visita: client?.dia_visita || "",
    observacoes_rota: client?.observacoes_rota || "",
    entrega: client?.entrega || "",
  });
  const [selectedRotas, setSelectedRotas] = useState<string[]>(initialRotas);

  const handleSave = () => {
    const rota = selectedRotas.length > 0 ? selectedRotas : null;
    onSave(client?.id || null, { ...data, rota });
    onClose();
  };

  const update = (field: string, value: string) => setData((p) => ({ ...p, [field]: value }));

  const toggleRota = (nome: string) => {
    setSelectedRotas((prev) =>
      prev.includes(nome) ? prev.filter((r) => r !== nome) : [...prev, nome]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-oswald">
            {client?.id ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Nome</Label>
            <Input value={data.nome} onChange={(e) => update("nome", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Telefone</Label>
            <Input value={data.telefone} onChange={(e) => update("telefone", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Cidade</Label>
            <Input value={data.cidade} onChange={(e) => update("cidade", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Ativo</Label>
              <Select value={data.Ativo} onValueChange={(v) => update("Ativo", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIM">SIM</SelectItem>
                  <SelectItem value="NAO">NÃO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Dia de Visita</Label>
              <Select value={data.dia_visita || "__none__"} onValueChange={(v) => update("dia_visita", v === "__none__" ? "" : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {DIAS_SEMANA.map((d) => (
                    <SelectItem key={d} value={d}>{DIAS_LABEL[d]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs mb-2 block">Rotas</Label>
            <div className="flex flex-wrap gap-2">
              {rotas.map((r) => {
                const checked = selectedRotas.includes(r.nome);
                return (
                  <label
                    key={r.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                      checked
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleRota(r.nome)}
                      className="h-3.5 w-3.5"
                    />
                    {r.cor && (
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.cor }} />
                    )}
                    {r.nome}
                  </label>
                );
              })}
              {rotas.length === 0 && (
                <p className="text-xs text-muted-foreground">Nenhuma rota cadastrada</p>
              )}
            </div>
          </div>
          <div>
            <Label className="text-xs">Observações da Rota</Label>
            <Textarea value={data.observacoes_rota} onChange={(e) => update("observacoes_rota", e.target.value)} className="min-h-[60px]" />
          </div>
          <div>
            <Label className="text-xs">Entrega</Label>
            <Input value={data.entrega} onChange={(e) => update("entrega", e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleSave}>
            <Check className="w-4 h-4 mr-1" /> Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
