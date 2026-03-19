import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RotaInfo {
  nome: string;
  dia_semana?: string | null;
  cor?: string | null;
}

interface MiniCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  rotas?: RotaInfo[];
  activeRouteNames?: string[];
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const WEEK_KEYS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

function getDiaSemanaKey(date: Date): string {
  const idx = date.getDay(); // 0=Sun
  return WEEK_KEYS[(idx + 6) % 7];
}

export default function MiniCalendar({ selectedDate, onSelect, rotas = [], activeRouteNames = [] }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7;

  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);

  const today = new Date();
  const selD = new Date(selectedDate);

  // Pre-compute which day-of-week has which active colored routes
  const routesByDia: Record<string, { nome: string; cor: string }[]> = {};
  for (const r of rotas) {
    if (r.dia_semana && r.cor && activeRouteNames.includes(r.nome)) {
      if (!routesByDia[r.dia_semana]) routesByDia[r.dia_semana] = [];
      routesByDia[r.dia_semana].push({ nome: r.nome, cor: r.cor });
    }
  }

  const legendRoutes = rotas.filter((r) => r.cor && r.dia_semana && activeRouteNames.includes(r.nome));

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[month]} {year}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const dt = new Date(year, month, d);
          const isToday = dt.toDateString() === today.toDateString();
          const isSelected = dt.toDateString() === selD.toDateString();
          const diaKey = getDiaSemanaKey(dt);
          const dots = routesByDia[diaKey] || [];

          return (
            <button
              key={d}
              onClick={() => onSelect(dt)}
              className={`text-xs h-8 w-full rounded transition-colors flex flex-col items-center justify-center gap-0.5 ${
                isSelected
                  ? "bg-primary text-primary-foreground font-bold"
                  : isToday
                  ? "bg-accent/20 text-accent font-semibold"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span>{d}</span>
              {dots.length > 0 && (
                <div className="flex gap-0.5">
                  {dots.map((dot) => (
                    <div
                      key={dot.nome}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: dot.cor }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-2 text-xs text-primary"
        onClick={() => {
          setViewDate(new Date());
          onSelect(new Date());
        }}
      >
        Hoje
      </Button>

      {/* Legenda */}
      {legendRoutes.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border space-y-1">
          {legendRoutes.map((r) => (
            <div key={r.nome} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: r.cor! }} />
              <span>{r.nome}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
