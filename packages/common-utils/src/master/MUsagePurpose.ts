export interface MUsagePurposeItem {
  id: number;
  name: string;
}

export const mUsagePurpose: MUsagePurposeItem[] = [
  {
    id: 1,
    name: "商談、打ち合わせ",
  },
  {
    id: 2,
    name: "Web会議",
  },
  {
    id: 3,
    name: "セミナー、勉強会",
  },
  {
    id: 4,
    name: "自主勉強",
  },
  {
    id: 5,
    name: "ゲーム・遊び",
  },
  {
    id: 6,
    name: "撮影",
  },
] as const;
