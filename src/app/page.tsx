"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { BenefitTable } from "@/components/insurance/BenefitTable";
import { InsightCard } from "@/components/insurance/InsightCard";
import { CategoryRadar } from "@/components/insurance/CategoryRadar";
import { BENEFIT_TABLE, INSIGHT, CATEGORY_SCORES } from "@/lib/insurance-data";
import {
  Send, Bot, User, Loader2, Sparkles, BarChart2, Table2, TrendingUp, LayoutDashboard,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SUGGESTIONS = [
  { icon: Table2,     text: "라이나 vs 한화 전체 급부 비교 보여줘" },
  { icon: TrendingUp, text: "당사가 유리한 항목만 보여줘" },
  { icon: Sparkles,   text: "종합 경쟁력 분석해줘" },
  { icon: BarChart2,  text: "카테고리별 점수 차트 보여줘" },
];

function ToolCallBadge({ toolName, args }: { toolName: string; args?: Record<string, unknown> }) {
  const META: Record<string, { label: string; color: string; bg: string; component: string }> = {
    "show_benefit_table":  { label: "급부 비교표",   color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",     component: "<BenefitTable />" },
    "show_insight_card":   { label: "인사이트 카드", color: "text-violet-700", bg: "bg-violet-50 border-violet-200", component: "<InsightCard />" },
    "show_category_radar": { label: "레이더 차트",   color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-200",component: "<CategoryRadar />" },
  };
  const meta = META[toolName];
  if (!meta) return null;
  const paramStr = args ? Object.entries(args).map(([k, v]) => `${k}: "${v}"`).join(", ") : "";
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-mono ${meta.bg} ${meta.color}`}>
      <span className="font-semibold opacity-60">tool</span>
      <span className="opacity-30">›</span>
      <span className="font-semibold">{toolName}({paramStr})</span>
      <span className="opacity-30">→</span>
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    sendMessage({ text: msg });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-sm leading-none tracking-tight">라이나 인사이트</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Generative UI Demo</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-medium"
          >
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
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

          {/* 초기 상태 */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">보험 비교 AI</h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                  질문에 따라 AI가 렌더링할 <strong className="text-slate-700">UI 컴포넌트를 직접 결정</strong>합니다.<br />
                  같은 입력창에서 완전히 다른 UI가 나옵니다.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                {SUGGESTIONS.map(({ icon: Icon, text }) => (
                  <button
                    key={text}
                    onClick={() => handleSend(text)}
                    className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm font-medium"
                  >
                    <Icon className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 메시지 */}
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                message.role === "user"
                  ? "bg-blue-600"
                  : "bg-white border border-slate-200 shadow-sm"
              }`}>
                {message.role === "user"
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-blue-600" />
                }
              </div>

              <div className={`flex flex-col gap-2 min-w-0 ${
                message.role === "user" ? "items-end max-w-[75%]" : "items-start w-full"
              }`}>
                {/* 유저 메시지 */}
                {message.role === "user" && (() => {
                  const text = (message.parts as Array<{type:string;text?:string}> ?? [])
                    .filter(p => p.type === "text").map(p => p.text ?? "").join("");
                  return text ? (
                    <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed bg-blue-600 text-white shadow-sm shadow-blue-200">
                      {text}
                    </div>
                  ) : null;
                })()}

                {/* 어시스턴트 메시지 */}
                {message.role === "assistant" && (message.parts ?? []).map((part, i) => {
                  if (part.type === "text") {
                    return part.text ? (
                      <div key={i} className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed bg-white border border-slate-100 text-slate-700 shadow-sm">
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
                        <div key={i} className="flex flex-col gap-2 w-full">
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
                        <div key={i} className="flex items-center gap-2 text-xs text-violet-500 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="font-mono">show_insight_card() 호출 중...</span>
                        </div>
                      );
                    }
                    if (part.state === "output-available") {
                      return (
                        <div key={i} className="flex flex-col gap-2 w-full">
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
                        <div key={i} className="flex flex-col gap-2 w-full">
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

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* 입력 */}
      <div className="bg-white border-t border-slate-100 px-4 py-3 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2">
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
  );
}
