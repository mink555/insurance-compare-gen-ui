"use client";

import { BenefitRow } from "@/lib/insurance-data";

const verdictConfig = {
  당사우위: {
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    icon: "↑",
  },
  타사우위: {
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    icon: "↓",
  },
  동일: { bg: "bg-gray-50", badge: "bg-gray-100 text-gray-600", icon: "=" },
  비교불가: {
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    icon: "?",
  },
};

interface BenefitTableProps {
  rows?: BenefitRow[];
  filter?: string;
}

export function BenefitTable({ rows = [], filter = "전체" }: BenefitTableProps) {
  const normalizeFilter = (f: string): "전체" | "당사우위" | "타사우위" | "동일" => {
    if (f === "당사우위" || f.includes("당사") || f.includes("라이나우위")) return "당사우위";
    if (f === "타사우위" || f.includes("타사") || f.includes("한화우위")) return "타사우위";
    if (f === "동일" || f.includes("same")) return "동일";
    return "전체";
  };

  const normalizedFilter = normalizeFilter(filter);
  const filtered =
    normalizedFilter === "전체" ? rows : rows.filter((r) => r.verdict === normalizedFilter);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-sm">
          급부별 금액 비교
        </h3>
        <div className="flex gap-1 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            라이나
          </span>
          <span className="text-gray-400">vs</span>
          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
            한화
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-2.5 text-gray-500 font-medium">
                급부명
              </th>
              <th className="text-center px-3 py-2.5 text-blue-600 font-medium">
                라이나생명
              </th>
              <th className="text-center px-3 py-2.5 text-orange-600 font-medium">
                한화생명
              </th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium">
                판정
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const cfg = verdictConfig[row.verdict];
              return (
                <tr
                  key={row.canonicalKey}
                  className={`border-b border-gray-50 ${cfg.bg} hover:brightness-95 transition-all`}
                >
                  <td className="px-4 py-2.5 text-gray-700 font-medium text-xs leading-tight">
                    {row.benefitName}
                  </td>
                  <td className="px-3 py-2.5 text-center font-semibold text-blue-700 text-xs">
                    {row.lina}
                  </td>
                  <td className="px-3 py-2.5 text-center font-semibold text-orange-700 text-xs">
                    {row.hanwha}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}
                    >
                      {cfg.icon} {row.verdict}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
        {filtered.length}건 표시 중
      </div>
    </div>
  );
}
