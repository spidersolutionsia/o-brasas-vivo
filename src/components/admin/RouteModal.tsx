import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, X, Route } from "lucide-react";
import { getISOWeek, isRotaActiveOnDate } from "@/lib/rotaUtils";

const DIAS_SEMANA = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
const DIAS_LABEL: Record<string, string> = {
  seg: "Segunda", ter: "Terça", qua: "Quarta", qui: "Quinta",
  sex: "Sexta", sab: "Sábado", dom: "Domingo",
};

const CORES_PALETA = [
  { value: "#ef4444", label: "Vermelho" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#22c55e", label: "Verde" },
  { value: "#f97316", label: "Laranja" },
  { value: "#8b5cf6", label: "Roxo" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#06b6d4", label: "Ciano" },
  { value: "#eab308", label: "Amarelo" },
];

const INTERVALO_OPTIONS = [
  { value: "1", label: "Semanal (toda semana)" },
  { value: "2", label: "Quinzenal (semana sim, semana não)" },
];

interface Rota {
  id: string;
  nome: string;
  descricao?: string;
  dia_semana?: string | null;
  observacoes?: string | null;
  ativa?: boolean;
  cor?: string | null;
  intervalo?: number;
  semana_referencia?: string | null;
}

interface RouteModalProps {
  open: boolean;
  rotas: Rota[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1.5">Cor da rota</p>
      <div className="flex flex-wrap gap-2">
        {CORES_PALETA.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            onClick={() => onChange(c.value)}
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              value === c.value ? "border-foreground scale-110 ring-2 ring-primary/30" : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
    </div>
  );
}

function WeekActiveIndicator({ intervalo, semanaReferencia }: { intervalo: number; semanaReferencia: string | null | undefined }) {
  if (intervalo <= 1) return null;
  const today = new Date();
  const isActive = isRotaActiveOnDate(today, intervalo, semanaReferencia);
  const currentWeek = getISOWeek(today);
  return (
    <div className={`text-xs px-2 py-1 rounded ${isActive ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>
      {isActive ? "✓ Ativa esta semana" : "✗ Inativa esta semana"} ({currentWeek})
    </div>
  );
}

export default function RouteModal({ open, rotas, onClose, onSave, onDelete }: RouteModalProps) {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDia, setNewDia] = useState("");
  const [newObs, setNewObs] = useState("");
  const [newCor, setNewCor] = useState(CORES_PALETA[0].value);
  const [newIntervalo, setNewIntervalo] = useState("1");
  const [newSemanaRef, setNewSemanaRef] = useState(getISOWeek(new Date()));
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const intervaloNum = parseInt(newIntervalo);
    await onSave({
      nome: newName.trim(),
      descricao: newDesc,
      dia_semana: newDia || null,
      observacoes: newObs || null,
      cor: newCor,
      ativa: true,
      intervalo: intervaloNum,
      semana_referencia: intervaloNum > 1 ? newSemanaRef : null,
    });
    setNewName(""); setNewDesc(""); setNewDia(""); setNewObs(""); setNewCor(CORES_PALETA[0].value);
    setNewIntervalo("1"); setNewSemanaRef(getISOWeek(new Date()));
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    const intervaloNum = parseInt(editData.intervalo || "1");
    await onSave({
      ...editData,
      id: editing,
      intervalo: intervaloNum,
      semana_referencia: intervaloNum > 1 ? (editData.semana_referencia || getISOWeek(new Date())) : null,
    });
    setEditing(null); setEditData({});
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-oswald">
            <Route className="w-5 h-5 text-primary" />
            Gerenciar Rotas
          </DialogTitle>
        </DialogHeader>

        {/* Nova Rota */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">+ Nova Rota</p>
          <Input placeholder="Nome da rota (ex: Rota3)" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input placeholder="Descrição" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <Select value={newDia} onValueChange={setNewDia}>
            <SelectTrigger><SelectValue placeholder="Dia padrão..." /></SelectTrigger>
            <SelectContent>
              {DIAS_SEMANA.map((d) => (
                <SelectItem key={d} value={d}>{DIAS_LABEL[d]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Frequência</p>
            <Select value={newIntervalo} onValueChange={setNewIntervalo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {INTERVALO_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {parseInt(newIntervalo) > 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Esta semana a rota está ativa?</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={isRotaActiveOnDate(new Date(), parseInt(newIntervalo), newSemanaRef) ? "default" : "outline"}
                  onClick={() => setNewSemanaRef(getISOWeek(new Date()))}
                  className="flex-1"
                >
                  Sim, esta semana
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={!isRotaActiveOnDate(new Date(), parseInt(newIntervalo), newSemanaRef) ? "default" : "outline"}
                  onClick={() => {
                    const next = new Date();
                    next.setDate(next.getDate() + 7);
                    setNewSemanaRef(getISOWeek(next));
                  }}
                  className="flex-1"
                >
                  Não, começa na próxima
                </Button>
              </div>
              <WeekActiveIndicator intervalo={parseInt(newIntervalo)} semanaReferencia={newSemanaRef} />
            </div>
          )}
          <ColorPicker value={newCor} onChange={setNewCor} />
          <Textarea placeholder="Observações..." value={newObs} onChange={(e) => setNewObs(e.target.value)} className="min-h-[60px]" />
          <Button onClick={handleCreate} disabled={saving || !newName.trim()} className="w-full">
            <Plus className="w-4 h-4 mr-1" /> Criar Rota
          </Button>
        </div>

        {/* Lista de Rotas */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rotas Existentes</p>
          {rotas.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-lg p-3">
              {editing === r.id ? (
                <div className="space-y-2">
                  <Input value={editData.nome || ""} onChange={(e) => setEditData((p: any) => ({ ...p, nome: e.target.value }))} />
                  <Input value={editData.descricao || ""} placeholder="Descrição" onChange={(e) => setEditData((p: any) => ({ ...p, descricao: e.target.value }))} />
                  <Select value={editData.dia_semana || ""} onValueChange={(v) => setEditData((p: any) => ({ ...p, dia_semana: v || null }))}>
                    <SelectTrigger><SelectValue placeholder="Dia padrão..." /></SelectTrigger>
                    <SelectContent>
                      {DIAS_SEMANA.map((d) => (
                        <SelectItem key={d} value={d}>{DIAS_LABEL[d]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Frequência</p>
                    <Select value={String(editData.intervalo || 1)} onValueChange={(v) => setEditData((p: any) => ({ ...p, intervalo: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {INTERVALO_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {parseInt(editData.intervalo || "1") > 1 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Esta semana a rota está ativa?</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={isRotaActiveOnDate(new Date(), parseInt(editData.intervalo || "1"), editData.semana_referencia) ? "default" : "outline"}
                          onClick={() => setEditData((p: any) => ({ ...p, semana_referencia: getISOWeek(new Date()) }))}
                          className="flex-1"
                        >
                          Sim, esta semana
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={!isRotaActiveOnDate(new Date(), parseInt(editData.intervalo || "1"), editData.semana_referencia) ? "default" : "outline"}
                          onClick={() => {
                            const next = new Date();
                            next.setDate(next.getDate() + 7);
                            setEditData((p: any) => ({ ...p, semana_referencia: getISOWeek(next) }));
                          }}
                          className="flex-1"
                        >
                          Não, começa na próxima
                        </Button>
                      </div>
                      <WeekActiveIndicator intervalo={parseInt(editData.intervalo || "1")} semanaReferencia={editData.semana_referencia} />
                    </div>
                  )}
                  <ColorPicker value={editData.cor || CORES_PALETA[0].value} onChange={(v) => setEditData((p: any) => ({ ...p, cor: v }))} />
                  <Textarea value={editData.observacoes || ""} placeholder="Observações" onChange={(e) => setEditData((p: any) => ({ ...p, observacoes: e.target.value }))} className="min-h-[50px]" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdate} disabled={saving}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {r.cor && (
                      <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: r.cor }} />
                    )}
                    <div className="space-y-0.5">
                      <div className="font-semibold text-sm text-foreground">
                        {r.nome}
                        {r.ativa === false && <span className="text-destructive text-xs ml-2">INATIVA</span>}
                      </div>
                      {r.descricao && <p className="text-xs text-muted-foreground">{r.descricao}</p>}
                      {r.dia_semana && <p className="text-xs text-primary">📅 {DIAS_LABEL[r.dia_semana]}</p>}
                      <p className="text-xs text-muted-foreground">
                        {(r.intervalo || 1) <= 1 ? "Semanal" : "Quinzenal"}
                      </p>
                      {(r.intervalo || 1) > 1 && (
                        <WeekActiveIndicator intervalo={r.intervalo || 2} semanaReferencia={r.semana_referencia} />
                      )}
                      {r.observacoes && <p className="text-xs text-muted-foreground italic">{r.observacoes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                      setEditing(r.id);
                      setEditData({
                        nome: r.nome, descricao: r.descricao, dia_semana: r.dia_semana,
                        observacoes: r.observacoes, cor: r.cor,
                        intervalo: String(r.intervalo || 1),
                        semana_referencia: r.semana_referencia || "",
                      });
                    }}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(r.id)}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
