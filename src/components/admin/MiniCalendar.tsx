import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MiniCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function MiniCalendar({ selectedDate, onSelect }: MiniCalendarProps) {
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
          return (
            <button
              key={d}
              onClick={() => onSelect(dt)}
              className={`text-xs h-7 w-full rounded transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground font-bold"
                  : isToday
                  ? "bg-accent/20 text-accent font-semibold"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {d}
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
    </div>
  );
}
