"use client";

import { useState, useCallback } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { CompareBarChart, TrendLineChart } from "@/components/dashboard/Charts";
import { CoverageHeatmap } from "@/components/dashboard/CoverageHeatmap";
import { CATEGORY_SCORES } from "@/lib/insurance-data";
import { Sparkles, Loader2, LayoutDashboard, Cpu, Plus } from "lucide-react";
import Link from "next/link";

// ── mock 데이터 ──────────────────────────────────────────────
const AMOUNT_GAP_DATA = [
  { label: "표적항암약물", value: 3000, compare: 1000 },
  { label: "암직접통원",   value: 30000, compare: 10000 },
  { label: "암직접입원",   value: 50000, compare: 20000 },
  { label: "방사선치료",   value: 3000000, compare: 2000000 },
  { label: "중환자실",     value: 100000, compare: 80000 },
  { label: "암수술",       value: 1000000, compare: 5000000 },
];

const MONTHLY_TREND = [
  { label: "1월", lina: 3000, hanwha: 1800 },
  { label: "2월", lina: 3200, hanwha: 1900 },
  { label: "3월", lina: 2900, hanwha: 2100 },
  { label: "4월", lina: 3400, hanwha: 2000 },
  { label: "5월", lina: 3800, hanwha: 2200 },
  { label: "6월", lina: 4100, hanwha: 2400 },
];

const HEATMAP_DATA = [
  {
    category: "진단·검사",
    items: [
      { label: "일반암진단", lina: 85, hanwha: 85 },
      { label: "갑상선진단", lina: 60, hanwha: 85 },
      { label: "NGS검사",    lina: 78, hanwha: 20 },
    ],
  },
  {
    category: "치료",
    items: [
      { label: "항암약물", lina: 95, hanwha: 70 },
      { label: "방사선",   lina: 88, hanwha: 72 },
      { label: "수술",     lina: 45, hanwha: 90 },
      { label: "통원",     lina: 92, hanwha: 55 },
    ],
  },
  {
    category: "입원·회복",
    items: [
      { label: "일반입원", lina: 88, hanwha: 60 },
      { label: "중환자실", lina: 82, hanwha: 72 },
    ],
  },
];

const CATEGORY_BAR_DATA = CATEGORY_SCORES.map((c) => ({
  label: c.category,
  value: c.lina,
  compare: c.hanwha,
}));

const SUGGESTIONS = [
  "종합 경쟁력 현황 보여줘",
  "라이나 vs 한화 비교 분석",
  "우리 약점이 뭐야?",
  "항암 보장 트렌드 분석",
];

// ── 위젯 렌더러 ──────────────────────────────────────────────
function Widget({ widget }: { widget: Record<string, unknown> }) {
  const type = widget.type as string;

  if (type === "kpi_row") {
    const cards = widget.cards as Array<{
      title: string; value: string; change: number; unit?: string; description?: string;
    }>;
    const cols = cards?.length === 2 ? "grid-cols-2" : cards?.length === 3 ? "grid-cols-3" : "grid-cols-4";
    return (
      <div className={`grid gap-4 ${cols}`}>
        {(cards ?? []).map((card, i) => <KPICard key={i} data={card} />)}
      </div>
    );
  }

  if (type === "bar_chart") {
    const dataKey = widget.dataKey as string;
    const data = dataKey === "category_scores" ? CATEGORY_BAR_DATA
      : dataKey === "amount_gap" ? AMOUNT_GAP_DATA.map(d => ({ label: d.label, value: d.value, compare: d.compare }))
      : MONTHLY_TREND.map(d => ({ label: d.label, value: d.lina, compare: d.hanwha }));
    return <CompareBarChart title={widget.title as string} data={data} showCompare={(widget.showCompare as boolean) ?? true} unit="" />;
  }

  if (type === "trend_chart") {
    return <TrendLineChart title={widget.title as string} data={MONTHLY_TREND} unit="만원" />;
  }

  if (type === "coverage_heatmap") {
    return <CoverageHeatmap title={widget.title as string} data={HEATMAP_DATA} />;
  }

  if (type === "insight_summary") {
    const verdict = widget.verdict as string;
    const isWin = verdict === "당사우위";
    const isLose = verdict === "타사우위";
    return (
      <div className={`rounded-2xl border p-6 ${isWin ? "bg-blue-50 border-blue-100" : isLose ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isWin ? "text-blue-400" : isLose ? "text-amber-400" : "text-slate-400"}`}>
              AI 분석 요약
            </p>
            <p className="text-base font-bold text-slate-800">{widget.headline as string}</p>
          </div>
          <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${isWin ? "bg-blue-600 text-white" : isLose ? "bg-amber-500 text-white" : "bg-slate-600 text-white"}`}>
            {verdict}
          </span>
        </div>
        <ul className="space-y-2.5">
          {(widget.bullets as string[])?.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${isWin ? "bg-blue-200 text-blue-700" : isLose ? "bg-amber-200 text-amber-700" : "bg-slate-200 text-slate-600"}`}>
                {i + 1}
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

function Skeleton() {
  return <div className="animate-pulse bg-slate-100 rounded-2xl h-52" />;
}

type DashboardObject = {
  title?: string;
  subtitle?: string;
  widgets?: Array<Record<string, unknown>>;
};

// ── 메인 ────────────────────────────────────────────────────
export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [object, setObject] = useState<DashboardObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = useCallback(async (q: string) => {
    setIsLoading(true);
    setObject(null);

    const res = await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });

    if (!res.body) { setIsLoading(false); return; }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try { setObject(JSON.parse(line)); } catch { /* 무시 */ }
      }
    }
    if (buf.trim()) {
      try { setObject(JSON.parse(buf)); } catch { /* 무시 */ }
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (q?: string) => {
    const text = q ?? query;
    if (!text.trim()) return;
    setSubmitted(text);
    submit(text);
    setQuery("");
  };

  const hasResult = !isLoading && object?.widgets && object.widgets.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-sm tracking-tight">라이나 인사이트</h1>
          <p className="text-[11px] text-slate-400">AI-powered Dashboard</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            챗봇 모드
          </Link>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-700 font-medium">claude-3.5-haiku</span>
          </div>
        </div>
      </header>

      {/* 입력 영역 */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="어떤 분석이 필요하세요? (예: 종합 경쟁력 현황, 약점 분석...)"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-slate-50 placeholder:text-slate-400 text-slate-700 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || !query.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-all shadow-sm shadow-blue-200"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isLoading ? "생성 중..." : "생성"}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSubmit(s)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">

          {/* 초기 상태 */}
          {!submitted && !isLoading && (
            <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <p className="font-semibold text-slate-600">질문하면 AI가 대시보드를 구성합니다</p>
                <p className="text-sm text-slate-400 mt-1">위 버튼을 누르거나 직접 입력하세요</p>
              </div>
              <div className="flex gap-6 text-xs text-slate-400 mt-2">
                <span>"비교 분석" → 바 차트 + 히트맵</span>
                <span className="text-slate-200">|</span>
                <span>"약점 분석" → 격차 차트 + AI 인사이트</span>
                <span className="text-slate-200">|</span>
                <span>레이아웃 자체를 LLM이 결정</span>
              </div>
            </div>
          )}

          {/* 로딩 */}
          {isLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-blue-500 font-medium mb-2">
                <Cpu className="w-3.5 h-3.5 animate-pulse" />
                <span>
                  {object?.title
                    ? `"${object.title}" — 위젯 배치 중 (${object?.widgets?.length ?? 0}개)`
                    : "LLM이 레이아웃 설계 중..."}
                </span>
              </div>
              {(object?.widgets ?? []).map((w, i) =>
                w?.type ? <Widget key={i} widget={w as Record<string, unknown>} /> : <Skeleton key={i} />
              )}
              {[...Array(Math.max(0, 3 - (object?.widgets?.length ?? 0)))].map((_, i) => (
                <Skeleton key={`sk-${i}`} />
              ))}
            </div>
          )}

          {/* 결과 */}
          {hasResult && (
            <div className="space-y-6">
              {/* 결과 헤더 */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">{object.title}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{object.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                    <Cpu className="w-3 h-3" />
                    <span>LLM → {object.widgets?.length}개 위젯</span>
                  </div>
                  <button
                    onClick={() => { setSubmitted(""); setObject(null); }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 transition-colors font-medium hover:border-blue-200"
                  >
                    <Plus className="w-3 h-3" />새 질문
                  </button>
                </div>
              </div>

              {/* 위젯 */}
              <div className="space-y-4">
                {(object.widgets ?? []).map((widget, i) => (
                  widget?.type ? <Widget key={i} widget={widget as Record<string, unknown>} /> : null
                ))}
              </div>

              <p className="text-center text-[11px] text-slate-300 pt-2 pb-6">
                "{submitted}" 분석 결과
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
