export interface Topic {
  id: string;
  name: string;
  sourceFile: string;
  questionCount: number;
  /** High-yield questions in the topic. This bank has no core/extra split,
   *  so hyCoreCount equals hyCount. */
  hyCount?: number;
  hyCoreCount?: number;
}

export interface Category {
  id: string;
  name: string;
  /** Teaching week this category belongs to; the picker groups by it. */
  week?: number;
  weekName?: string;
  weekSubtitle?: string;
  topics: Topic[];
}

export interface TopicsIndex {
  categories: Category[];
  totalQuestions: number;
}
