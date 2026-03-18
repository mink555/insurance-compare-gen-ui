"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { CategoryScore } from "@/lib/insurance-data";

interface CategoryRadarProps {
  data: CategoryScore[];
}

export function CategoryRadar({ data }: CategoryRadarProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">
        카테고리별 보장 점수
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
            <Radar
              name="라이나생명"
              dataKey="lina"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              dot={false}
            />
            <Radar
              name="한화생명"
              dataKey="hanwha"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.2}
              dot={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 text-center mt-1">
        점수가 높을수록 해당 카테고리 보장이 유리
      </p>
    </div>
  );
}
