import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const SCHEMA_DESC = `{
  "title": "대시보드 제목",
  "subtitle": "한 줄 요약",
  "widgets": [
    // 위젯 타입:
    // 1. kpi_row: { "type": "kpi_row", "cards": [{ "title": "...", "value": "...", "change": 숫자, "unit": "...", "description": "..." }] }
    // 2. bar_chart: { "type": "bar_chart", "title": "...", "dataKey": "category_scores"|"amount_gap"|"monthly_trend", "showCompare": true/false }
    // 3. trend_chart: { "type": "trend_chart", "title": "..." }
    // 4. coverage_heatmap: { "type": "coverage_heatmap", "title": "..." }
    // 5. insight_summary: { "type": "insight_summary", "headline": "...", "bullets": ["...", "..."], "verdict": "당사우위"|"타사우위"|"균형" }
  ]
}`;

export async function POST(req: Request) {
  const { query }: { query: string } = await req.json();

  const result = streamText({
    model: openrouter("anthropic/claude-3.5-haiku"),
    system: `당신은 JSON 생성기입니다. 반드시 유효한 JSON만 출력하세요. 설명 텍스트, 마크다운 코드블록(\`\`\`), 주석은 절대 포함하지 마세요.`,
    prompt: `라이나생명 암보험 분석 대시보드 JSON을 생성하세요.

사용자 질문: "${query}"

다음 스키마를 따르는 JSON 객체를 반환하세요:
${SCHEMA_DESC}

위젯 선택 기준:
- "비교", "vs" → bar_chart(showCompare:true) + coverage_heatmap
- "트렌드", "추이" → trend_chart + kpi_row
- "약점", "개선" → insight_summary + bar_chart(dataKey:"amount_gap")
- "종합", "현황", 기타 → kpi_row + bar_chart(dataKey:"category_scores") + insight_summary

KPI 수치:
- 당사우위 건수: 15건 (+900%), 타사우위 3건, 동일 1건
- 당사 단독 보장: 72건 vs 타사 단독 224건
- 표적항암약물: 당사 3,000만원 vs 타사 1,000만원
- 암직접치료통원: 당사 3만원 vs 타사 1만원

JSON만 출력하세요.`,
  });

  // 전체 텍스트를 누적해서 완료 시 한 번에 JSON으로 반환
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let fullText = "";

      for await (const chunk of result.textStream) {
        fullText += chunk;
      }

      // 코드블록 마크다운 제거
      const cleaned = fullText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // JSON 파싱 시도
      try {
        const parsed = JSON.parse(cleaned);
        controller.enqueue(encoder.encode(JSON.stringify(parsed) + "\n"));
      } catch {
        // JSON 파싱 실패 시 원본 텍스트에서 JSON 추출 시도
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            const parsed = JSON.parse(match[0]);
            controller.enqueue(encoder.encode(JSON.stringify(parsed) + "\n"));
          } catch {
            controller.enqueue(encoder.encode(JSON.stringify({ error: "parse_failed", raw: cleaned.slice(0, 200) }) + "\n"));
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
