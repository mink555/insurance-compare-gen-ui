"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { BenefitTable } from "@/components/insurance/BenefitTable";
import { InsightCard } from "@/components/insurance/InsightCard";
import { CategoryRadar } from "@/components/insurance/CategoryRadar";
import { BENEFIT_TABLE, INSIGHT, CATEGORY_SCORES } from "@/lib/insurance-data";
import {
  Send, Bot, User, Loader2, Sparkles, BarChart2, Table2, TrendingUp,
  Cpu, ChevronRight, Code2, LayoutDashboard,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TOOL_META: Record<string, { label: string; color: string; bg: string; component: string; params?: string }> = {
  "show_benefit_table":  { label: "급부 비교표",    color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   component: "<BenefitTable />" },
  "show_insight_card":   { label: "인사이트 카드",  color: "text-purple-700", bg: "bg-purple-50 border-purple-200", component: "<InsightCard />" },
  "show_category_radar": { label: "레이더 차트",    color: "text-green-700",  bg: "bg-green-50 border-green-200",  component: "<CategoryRadar />" },
};

const SUGGESTIONS = [
  { icon: Table2,    text: "라이나 vs 한화 전체 급부 비교 보여줘" },
  { icon: TrendingUp,text: "당사가 유리한 항목만 보여줘" },
  { icon: Sparkles,  text: "종합 경쟁력 분석해줘" },
  { icon: BarChart2, text: "카테고리별 점수 차트 보여줘" },
];

function ToolCallBadge({ toolName, args }: { toolName: string; args?: Record<string, unknown> }) {
  const meta = TOOL_META[toolName];
  if (!meta) return null;
  const paramStr = args ? Object.entries(args).map(([k, v]) => `${k}: "${v}"`).join(", ") : "";
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-mono ${meta.bg} ${meta.color}`}>
      <Cpu className="w-3 h-3 shrink-0" />
      <span className="font-semibold">tool_call</span>
      <ChevronRight className="w-3 h-3 opacity-50" />
      <span>{toolName}({paramStr})</span>
      <span className="opacity-40">→</span>
      <Code2 className="w-3 h-3 shrink-0" />
      <span className="font-semibold">{meta.component}</span>
    </div>
  );
}

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });
  const [input, setInput] = useState("");
  const [showExplainer, setShowExplainer] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    setShowExplainer(false);
    sendMessage({ text: msg });
    setInput("");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 왼쪽: 채팅 */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* 헤더 */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm leading-none tracking-tight">라이나 인사이트</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Generative UI Demo</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-medium">
              <LayoutDashboard className="w-3.5 h-3.5" />
              대시보드 모드
            </Link>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-700 font-medium">claude-3.5-haiku</span>
            </div>
          </div>
        </header>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-5 pb-16">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1 tracking-tight">보험 비교 AI</h2>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  아래 버튼을 눌러보세요. <strong className="text-slate-700">같은 채팅창</strong>인데 질문에 따라<br />
                  <strong className="text-slate-700">완전히 다른 UI 컴포넌트</strong>가 렌더링됩니다.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {SUGGESTIONS.map(({ icon: Icon, text }) => (
                  <button
                    key={text}
                    onClick={() => handleSend(text)}
                    className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                message.role === "user" ? "bg-blue-600" : "bg-white border border-slate-200 shadow-sm"
              }`}>
                {message.role === "user"
                  ? <User className="w-3.5 h-3.5 text-white" />
                  : <Bot className="w-3.5 h-3.5 text-blue-600" />
                }
              </div>

              <div className={`flex flex-col gap-2 max-w-[90%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                {message.role === "user" && (() => {
                  let text = "";
                  if (message.parts)
                    text = (message.parts as Array<{type:string;text?:string}>).filter(p=>p.type==="text").map(p=>p.text??"").join("");
                  return text ? (
                    <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-blue-600 text-white rounded-tr-sm shadow-sm shadow-blue-200">{text}</div>
                  ) : null;
                })()}

                {message.role === "assistant" && (message.parts ?? []).map((part, i) => {
                  if (part.type === "text") {
                    return part.text ? (
                      <div key={i} className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm">
                        {part.text}
                      </div>
                    ) : null;
                  }

                  if (part.type === "tool-show_benefit_table") {
                    const args = part.input as { filter?: string } | undefined;
                    if (part.state === "input-streaming" || part.state === "input-available") {
                      return (
                        <div key={i} className="flex items-center gap-2 text-xs text-blue-500 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="font-mono">show_benefit_table() 호출 중...</span>
                        </div>
                      );
                    }
                    if (part.state === "output-available") {
                      return (
                        <div key={i} className="flex flex-col gap-1.5 w-full">
                          <ToolCallBadge toolName="show_benefit_table" args={args as Record<string, unknown>} />
                          <BenefitTable rows={BENEFIT_TABLE} filter={args?.filter ?? "전체"} />
                        </div>
                      );
                    }
                  }

                  if (part.type === "tool-show_insight_card") {
                    const args = part.input as { focus?: string } | undefined;
                    if (part.state === "input-streaming" || part.state === "input-available") {
                      return (
                        <div key={i} className="flex items-center gap-2 text-xs text-purple-500 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="font-mono">show_insight_card() 호출 중...</span>
                        </div>
                      );
                    }
                    if (part.state === "output-available") {
                      return (
                        <div key={i} className="flex flex-col gap-1.5 w-full">
                          <ToolCallBadge toolName="show_insight_card" args={args as Record<string, unknown>} />
                          <InsightCard data={INSIGHT} />
                        </div>
                      );
                    }
                  }

                  if (part.type === "tool-show_category_radar") {
                    const args = part.input as { highlight?: string } | undefined;
                    if (part.state === "input-streaming" || part.state === "input-available") {
                      return (
                        <div key={i} className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="font-mono">show_category_radar() 호출 중...</span>
                        </div>
                      );
                    }
                    if (part.state === "output-available") {
                      return (
                        <div key={i} className="flex flex-col gap-1.5 w-full">
                          <ToolCallBadge toolName="show_category_radar" args={args as Record<string, unknown>} />
                          <CategoryRadar data={CATEGORY_SCORES} />
                        </div>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 입력 */}
        <div className="bg-white border-t border-slate-100 px-4 py-3 shrink-0">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="질문해보세요..."
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 placeholder:text-slate-400 bg-slate-50 text-slate-700 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-40 transition-all shadow-sm shadow-blue-200"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽: Generative UI 개념 패널 */}
      <div className="w-72 bg-white border-l border-slate-100 flex flex-col shrink-0 overflow-y-auto">
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Generative UI란?</h2>
        </div>

        <div className="p-4 space-y-4 text-xs text-slate-600">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
            <p className="font-semibold text-slate-700">기존 챗봇 vs Generative UI</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">✗</span>
                <span className="text-slate-400">AI → <strong className="text-slate-500">텍스트</strong> 반환<br/>&quot;표적항암약물은 3,000만원이고...&quot;</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>AI → <strong>어떤 UI를 그릴지 결정</strong> → 실제 컴포넌트 렌더링</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-slate-700 mb-2">실제 동작 흐름</p>
            {[
              { step: "1", label: "사용자 메시지 전송", sub: '"당사가 유리한 항목만"', color: "bg-blue-100 text-blue-700" },
              { step: "2", label: "LLM이 툴 선택", sub: "show_benefit_table(filter: 당사우위)", color: "bg-amber-100 text-amber-700" },
              { step: "3", label: "툴 실행 (서버)", sub: "execute() → { filter } 반환", color: "bg-orange-100 text-orange-700" },
              { step: "4", label: "클라이언트 렌더링", sub: "<BenefitTable filter='당사우위' />", color: "bg-emerald-100 text-emerald-700" },
            ].map(({ step, label, sub, color }) => (
              <div key={step} className="flex items-start gap-2">
                <span className={`w-5 h-5 rounded-full text-center flex items-center justify-center text-[10px] font-bold shrink-0 ${color}`}>{step}</span>
                <div>
                  <div className="font-medium text-slate-700">{label}</div>
                  <div className="text-slate-400 font-mono text-[10px] mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="font-semibold text-slate-700">질문 → 컴포넌트 맵</p>
            {[
              { q: '"비교해줘"', comp: "<BenefitTable />", color: "text-blue-600" },
              { q: '"분석해줘"', comp: "<InsightCard />", color: "text-purple-600" },
              { q: '"차트 보여줘"', comp: "<CategoryRadar />", color: "text-emerald-600" },
            ].map(({ q, comp, color }) => (
              <div key={q} className="flex items-center gap-1.5 font-mono text-[10px] bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
                <span className="text-slate-500">{q}</span>
                <span className="text-slate-300">→</span>
                <span className={`font-bold ${color}`}>{comp}</span>
              </div>
            ))}
            <p className="text-slate-400 text-[10px] pt-1">LLM이 런타임에 결정. 코드에 if/else 없음.</p>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 space-y-1.5">
            <p className="font-semibold text-blue-700 text-[11px]">← 왼쪽에서 확인하세요</p>
            <ul className="space-y-1 text-blue-600">
              <li className="flex items-start gap-1.5">
                <span className="shrink-0 text-blue-400">•</span>
                컴포넌트 위 <strong>배지</strong> = LLM이 호출한 툴명 + 인자
              </li>
              <li className="flex items-start gap-1.5">
                <span className="shrink-0 text-blue-400">•</span>
                같은 입력창인데 질문마다 <strong>다른 컴포넌트</strong>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="shrink-0 text-blue-400">•</span>
                &quot;당사우위&quot; 필터는 LLM이 자연어를 파싱해서 파라미터로 전달
              </li>
            </ul>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-slate-700">핵심 코드 (route.ts)</p>
            <pre className="text-[10px] bg-slate-900 text-emerald-400 rounded-xl p-3 overflow-x-auto leading-relaxed">{`tools: {
  show_benefit_table: tool({
    description: "비교표 렌더링",
    parameters: z.object({
      filter: z.string()
    }),
    execute: async ({ filter }) =>
      ({ filter }),
  }),
  show_insight_card: tool({ ... }),
  show_category_radar: tool({ ... }),
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
