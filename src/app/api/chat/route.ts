import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, tool, convertToModelMessages, UIMessage } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter("anthropic/claude-3.5-haiku"),
    system: `당신은 라이나생명 보험 상품 분석 AI 어시스턴트입니다.
사용자의 질문에 따라 적절한 UI 컴포넌트를 렌더링하고 분석 결과를 제공합니다.

show_benefit_table 툴의 filter 파라미터는 반드시 아래 4가지 값 중 하나를 정확히 사용하세요:
- "전체" : 모든 항목 표시 (기본값)
- "당사우위" : 라이나생명이 유리한 항목만
- "타사우위" : 한화생명이 유리한 항목만
- "동일" : 금액이 같은 항목만

사용자 질문 → 툴 선택 기준:
- "비교해줘", "전체" → show_benefit_table(filter: "전체")
- "당사 유리", "라이나 우위", "우리가 좋은" → show_benefit_table(filter: "당사우위")
- "타사 유리", "한화 우위" → show_benefit_table(filter: "타사우위")
- "인사이트", "종합 분석", "경쟁력" → show_insight_card
- "차트", "레이더", "카테고리" → show_category_radar

항상 한국어로 답변하고, 툴 호출 후 1-2문장 해설을 덧붙이세요.`,
    messages: await convertToModelMessages(messages),
    tools: {
      show_benefit_table: tool<{ filter: string }, { filter: string }>({
        description:
          "라이나 vs 한화 암보험 급부별 금액 비교 테이블을 렌더링합니다.",
        inputSchema: z.object({
          filter: z
            .string()
            .describe(
              "표시할 판정 필터: '전체', '당사우위', '타사우위', '동일' 중 하나"
            ),
        }),
        execute: async ({ filter }) => ({ filter }),
      }),

      show_insight_card: tool<{ focus: string }, { focus: string }>({
        description:
          "라이나생명 vs 한화생명 종합 경쟁력 인사이트 카드를 렌더링합니다. 우위 건수, 핵심 강점/약점을 보여줍니다.",
        inputSchema: z.object({
          focus: z
            .string()
            .describe("인사이트 포커스: '전체', '강점', '약점' 중 하나"),
        }),
        execute: async ({ focus }) => ({ focus }),
      }),

      show_category_radar: tool<{ highlight?: string }, { highlight?: string }>({
        description:
          "카테고리별 보장 점수를 레이더 차트로 시각화합니다. 진단/수술/입원/통원/항암/검사 카테고리를 비교합니다.",
        inputSchema: z.object({
          highlight: z
            .string()
            .optional()
            .describe("강조할 카테고리 (예: 항암치료)"),
        }),
        execute: async ({ highlight }) => ({ highlight }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
