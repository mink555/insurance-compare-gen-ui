"use client";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type KPIData = {
  title: string;
  value: string;
  change: number;
  unit?: string;
  description?: string;
};

export function KPICard({ data }: { data: KPIData }) {
  const isUp = data.change > 0;
  const isFlat = data.change === 0;

  return (
    <div className="relative bg-white rounded-2xl border border-slate-100 p-5 overflow-hidden group hover:shadow-md hover:border-slate-200 transition-all duration-200">
      {/* 배경 accent */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-50 opacity-0 group-hover:opacity-60 -translate-y-8 translate-x-8 transition-all duration-300" />

      <div className="relative">
        {/* 타이틀 */}
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-3">{data.title}</p>

        {/* 값 + 단위 */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-[28px] font-bold text-slate-800 leading-none tracking-tight">{data.value}</span>
          {data.unit && <span className="text-sm font-medium text-slate-400">{data.unit}</span>}
        </div>

        {/* 변화율 배지 */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
            ${isFlat
              ? "bg-slate-100 text-slate-500"
              : isUp
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
            }`}>
            {isFlat
              ? <Minus className="w-2.5 h-2.5" />
              : isUp
              ? <TrendingUp className="w-2.5 h-2.5" />
              : <TrendingDown className="w-2.5 h-2.5" />
            }
            {isFlat ? "변동없음" : `${isUp ? "+" : ""}${data.change}%`}
          </div>
          {data.description && (
            <span className="text-[10px] text-slate-400 text-right leading-tight max-w-[120px]">{data.description}</span>
          )}
        </div>
      </div>
    </div>
  );
}
