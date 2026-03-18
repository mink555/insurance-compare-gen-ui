"use client";

import { InsightData } from "@/lib/insurance-data";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";

interface InsightCardProps {
  data: InsightData;
}

export function InsightCard({ data }: InsightCardProps) {
  const total = data.linaWins + data.hanwhaWins + data.draws;
  const linaScore = Math.round((data.linaWins / total) * 100);

  return (
    <div className="space-y-3">
      {/* 포지션 헤더 */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="text-xs font-medium opacity-80 mb-0.5">
            종합 경쟁력 분석
          </div>
          <div className="text-lg font-bold">
            라이나생명{" "}
            <span className="text-blue-200">vs</span> 한화생명
          </div>
        </div>

        <div className="p-4">
          {/* 점수 바 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-blue-600 w-14 text-right">
              라이나 {data.linaWins}건
            </span>
            <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden flex">
              <div
                className="h-full bg-blue-500 rounded-l-full transition-all duration-700"
                style={{ width: `${linaScore}%` }}
              />
              <div
                className="h-full bg-orange-400 rounded-r-full transition-all duration-700"
                style={{ width: `${100 - linaScore}%` }}
              />
            </div>
            <span className="text-xs font-medium text-orange-600 w-14">
              한화 {data.hanwhaWins}건
            </span>
          </div>

          {/* 통계 그리드 */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "당사우위", value: data.linaWins, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "타사우위", value: data.hanwhaWins, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "동일", value: data.draws, color: "text-gray-600", bg: "bg-gray-50" },
              { label: "당사단독", value: data.linaOnly, color: "text-green-600", bg: "bg-green-50" },
            ].map((item) => (
              <div
                key={item.label}
                className={`${item.bg} rounded-lg p-2`}
              >
                <div className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 핵심 강점 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">
              핵심 강점 TOP 3
            </span>
          </div>
          <ul className="space-y-1.5">
            {data.topAdvantages.map((item, i) => (
              <li key={i} className="text-xs">
                <div className="font-medium text-gray-700">{item.label}</div>
                <div className="text-blue-600 font-bold">
                  {item.lina}{" "}
                  <span className="text-gray-400 font-normal">
                    (한화 {item.hanwha})
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-semibold text-orange-700">
              보완 필요 TOP 3
            </span>
          </div>
          <ul className="space-y-1.5">
            {data.topDisadvantages.map((item, i) => (
              <li key={i} className="text-xs">
                <div className="font-medium text-gray-700">{item.label}</div>
                <div className="text-orange-600 font-bold">
                  {item.lina}{" "}
                  <span className="text-gray-400 font-normal">
                    (한화 {item.hanwha})
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-800">
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          한화 단독 보장 {data.hanwhaOnly}건 존재 — 일상 치료 지원 급부 다수.
          수술·항암 통원 카테고리 상품 개선 검토 권장.
        </span>
      </div>
    </div>
  );
}
