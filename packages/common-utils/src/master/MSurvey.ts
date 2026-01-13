export interface MSurveyItem {
  id: number;
  name: string;
}

export const mSurvey: MSurveyItem[] = [
  {
    id: 1,
    name: "知人の紹介",
  },
  {
    id: 2,
    name: "帯屋町を歩いていて目に入った",
  },
  {
    id: 3,
    name: "インターネット検索",
  },
  {
    id: 4,
    name: "ポータルサイト(ツドイバナビ、インスタベースなど)",
  },
  {
    id: 5,
    name: "テレビ・ラジオ",
  },
] as const;
