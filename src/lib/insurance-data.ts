export type BenefitRow = {
  canonicalKey: string;
  benefitName: string;
  lina: string;
  hanwha: string;
  verdict: "당사우위" | "타사우위" | "동일" | "비교불가";
};

export type InsightData = {
  linaWins: number;
  hanwhaWins: number;
  draws: number;
  linaOnly: number;
  hanwhaOnly: number;
  topAdvantages: { label: string; lina: string; hanwha: string }[];
  topDisadvantages: { label: string; lina: string; hanwha: string }[];
};

export type CategoryScore = {
  category: string;
  lina: number;
  hanwha: number;
};

export const BENEFIT_TABLE: BenefitRow[] = [
  {
    canonicalKey: "표적항암약물",
    benefitName: "표적항암약물허가치료보험금",
    lina: "3,000만원",
    hanwha: "최대 1,000만원",
    verdict: "당사우위",
  },
  {
    canonicalKey: "통원",
    benefitName: "암직접치료통원급여금",
    lina: "3만원/회",
    hanwha: "1만원/회",
    verdict: "당사우위",
  },
  {
    canonicalKey: "일반암|입원",
    benefitName: "암직접치료입원급여금",
    lina: "5만원/일",
    hanwha: "최대 2만원/일",
    verdict: "당사우위",
  },
  {
    canonicalKey: "일반암|진단",
    benefitName: "암진단보험금",
    lina: "3,000만원",
    hanwha: "3,000만원",
    verdict: "동일",
  },
  {
    canonicalKey: "갑상선암|로봇수술",
    benefitName: "갑상선암다빈치로봇수술급여금",
    lina: "500만원",
    hanwha: "1,000만원",
    verdict: "타사우위",
  },
  {
    canonicalKey: "일반암|수술",
    benefitName: "암수술급여금",
    lina: "100만원",
    hanwha: "500만원",
    verdict: "타사우위",
  },
  {
    canonicalKey: "일반암|방사선",
    benefitName: "방사선치료급여금",
    lina: "300만원",
    hanwha: "200만원",
    verdict: "당사우위",
  },
  {
    canonicalKey: "갑상선암|진단",
    benefitName: "갑상선암진단보험금",
    lina: "300만원",
    hanwha: "500만원",
    verdict: "타사우위",
  },
  {
    canonicalKey: "NGS유전자패널검사",
    benefitName: "NGS유전자패널검사비용",
    lina: "200만원",
    hanwha: "—",
    verdict: "당사우위",
  },
  {
    canonicalKey: "중환자실",
    benefitName: "암치료중환자실입원급여금",
    lina: "10만원/일",
    hanwha: "8만원/일",
    verdict: "당사우위",
  },
];

export const INSIGHT: InsightData = {
  linaWins: 15,
  hanwhaWins: 3,
  draws: 1,
  linaOnly: 72,
  hanwhaOnly: 224,
  topAdvantages: [
    {
      label: "표적항암약물허가치료",
      lina: "3,000만원",
      hanwha: "최대 1,000만원",
    },
    { label: "암직접치료통원", lina: "3만원/회", hanwha: "1만원/회" },
    { label: "중환자실입원", lina: "10만원/일", hanwha: "8만원/일" },
  ],
  topDisadvantages: [
    { label: "암수술급여금", lina: "100만원", hanwha: "500만원" },
    { label: "갑상선암로봇수술", lina: "500만원", hanwha: "1,000만원" },
    { label: "갑상선암진단", lina: "300만원", hanwha: "500만원" },
  ],
};

export const CATEGORY_SCORES: CategoryScore[] = [
  { category: "진단", lina: 85, hanwha: 72 },
  { category: "수술", lina: 45, hanwha: 90 },
  { category: "입원", lina: 88, hanwha: 60 },
  { category: "통원", lina: 92, hanwha: 55 },
  { category: "항암치료", lina: 95, hanwha: 70 },
  { category: "검사", lina: 78, hanwha: 50 },
];
