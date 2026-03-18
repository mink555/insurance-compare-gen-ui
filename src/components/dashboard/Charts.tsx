"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
  AreaChart, Area,
} from "recharts";

// ── 커스텀 툴팁 ────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, unit }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string }>;
  label?: string; unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-slate-600 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}</span>
          <span className="font-bold text-slate-800 ml-auto pl-3">
            {typeof p.value === "number" && p.value > 10000
              ? `${(p.value / 10000).toFixed(0)}만`
              : p.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── 색상 팔레트 ─────────────────────────────────────────────────
const LINA_COLOR = "#2563eb";   // blue-600
const HANWHA_COLOR = "#f59e0b"; // amber-500

export type BarData = { label: string; value: number; compare?: number };

export function CompareBarChart({ title, data, unit = "", showCompare = false }: {
  title: string; data: BarData[]; unit?: string; showCompare?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {showCompare && (
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: LINA_COLOR }} />라이나
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: HANWHA_COLOR }} />한화
            </span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={showCompare ? 3 : 0} barCategoryGap="30%">
          <defs>
            <linearGradient id="linaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINA_COLOR} stopOpacity={1} />
              <stop offset="100%" stopColor={LINA_COLOR} stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="hanwhaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={HANWHA_COLOR} stopOpacity={1} />
              <stop offset="100%" stopColor={HANWHA_COLOR} stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: "#f8fafc" }} />
          {showCompare ? (
            <>
              <Bar dataKey="value" name="라이나" fill="url(#linaGrad)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="compare" name="한화" fill="url(#hanwhaGrad)" radius={[4, 4, 0, 0]} />
            </>
          ) : (
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.value >= 0 ? "url(#linaGrad)" : "#fca5a5"} />
              ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export type TrendData = { label: string; lina: number; hanwha: number };

export function TrendLineChart({ title, data, unit = "만원" }: {
  title: string; data: TrendData[]; unit?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: LINA_COLOR }} />라이나
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: HANWHA_COLOR }} />한화
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="linaAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINA_COLOR} stopOpacity={0.15} />
              <stop offset="100%" stopColor={LINA_COLOR} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="hanwhaAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={HANWHA_COLOR} stopOpacity={0.12} />
              <stop offset="100%" stopColor={HANWHA_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Area
            type="monotone"
            dataKey="lina"
            name="라이나"
            stroke={LINA_COLOR}
            strokeWidth={2.5}
            fill="url(#linaAreaGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="hanwha"
            name="한화"
            stroke={HANWHA_COLOR}
            strokeWidth={2.5}
            fill="url(#hanwhaAreaGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
