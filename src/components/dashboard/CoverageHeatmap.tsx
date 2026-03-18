"use client";

export type HeatmapData = {
  category: string;
  items: { label: string; lina: number; hanwha: number }[];
};

function ScoreBar({ value, color }: { value: number; color: "blue" | "amber" }) {
  const bg = color === "blue" ? "bg-blue-600" : "bg-amber-400";
  const track = color === "blue" ? "bg-blue-50" : "bg-amber-50";
  const text = color === "blue" ? "text-blue-700" : "text-amber-700";
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 h-1.5 rounded-full ${track}`}>
        <div
          className={`h-1.5 rounded-full ${bg} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-[10px] font-bold tabular-nums w-6 text-right ${text}`}>{value}</span>
    </div>
  );
}

function WinnerBadge({ lina, hanwha }: { lina: number; hanwha: number }) {
  const diff = lina - hanwha;
  if (Math.abs(diff) <= 3) return <span className="text-[9px] text-slate-300 font-medium">동일</span>;
  if (diff > 0) return <span className="text-[9px] text-blue-500 font-bold">↑ +{diff}</span>;
  return <span className="text-[9px] text-amber-500 font-bold">↓ {diff}</span>;
}

export function CoverageHeatmap({ title, data }: { title: string; data: HeatmapData[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-blue-600 inline-block" />라이나
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />한화
          </span>
        </div>
      </div>

      {/* 컬럼 헤더 */}
      <div className="grid grid-cols-[80px_1fr_1fr_40px] gap-x-3 gap-y-0 mb-2 px-1">
        <div />
        <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">라이나</p>
        <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">한화</p>
        <div />
      </div>

      <div className="space-y-4">
        {data.map((group) => (
          <div key={group.category}>
            {/* 카테고리 구분선 */}
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{group.category}</p>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="space-y-2.5">
              {group.items.map((item) => (
                <div key={item.label} className="grid grid-cols-[80px_1fr_1fr_40px] gap-x-3 items-center px-1">
                  <p className="text-[11px] text-slate-500 truncate">{item.label}</p>
                  <ScoreBar value={item.lina} color="blue" />
                  <ScoreBar value={item.hanwha} color="amber" />
                  <div className="text-right">
                    <WinnerBadge lina={item.lina} hanwha={item.hanwha} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-300 mt-4 text-right">점수 0–100 기준</p>
    </div>
  );
}
