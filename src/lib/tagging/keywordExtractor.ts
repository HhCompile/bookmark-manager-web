/**
 * 关键词提取工具模块
 * 从文本中智能提取关键词，用于自动打标
 */

const STOP_WORDS = [
  '的',
  '了',
  '在',
  '是',
  '我',
  '有',
  '和',
  '就',
  '不',
  '人',
  '都',
  '一',
  '一个',
  '上',
  '也',
  '很',
  '到',
  '说',
  '要',
  '去',
  '你',
  '会',
  '着',
  '没有',
  '看',
  '好',
  '自己',
  '这',
  '那',
  '就',
  '对',
  '把',
  '被',
  '到',
  '从',
];

/**
 * 关键词提取配置
 */
export interface KeywordExtractorConfig {
  maxTags?: number;
  minWordLength?: number;
  useFrequencyWeighting?: boolean;
  useLengthWeighting?: boolean;
}

/**
 * 关键词提取结果
 */
export interface KeywordExtractorResult {
  keywords: string[];
  scores: Record<string, number>;
  originalWordCount: number;
  filteredWordCount: number;
}

/**
 * 从文本中提取关键词
 * @param text 输入文本
 * @param config 配置选项
 * @returns 提取结果
 */
export function extractKeywords(
  text: string,
  config: KeywordExtractorConfig = {}
): KeywordExtractorResult {
  const {
    maxTags = 3,
    minWordLength = 2,
    useFrequencyWeighting = true,
    useLengthWeighting = true,
  } = config;

  // 清理文本
  const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');

  // 分词并过滤
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length >= minWordLength && !STOP_WORDS.includes(word));

  const originalCount = words.length;

  if (words.length <= maxTags) {
    return {
      keywords: Array.from(new Set(words)),
      scores: {},
      originalWordCount: originalCount,
      filteredWordCount: words.length,
    };
  }

  // 计算词频
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // 计算词分
  const scores: Record<string, number> = {};
  Object.entries(wordFreq).forEach(([word, freq]) => {
    let score = freq;

    if (useFrequencyWeighting) {
      score *= 1;
    }

    if (useLengthWeighting) {
      score *= 1 + Math.log(word.length);
    }

    scores[word] = score;
  });

  // 排序并取前N个
  const sortedKeywords = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags)
    .map(([word]) => word);

  return {
    keywords: sortedKeywords,
    scores,
    originalWordCount:originalCount,
    filteredWordCount: words.length,
  };
}

/**
 * 根据标题长度智能调整标签数量
 * @param title 书签标题
 * @param baseMax 基础最大标签数
 * @returns 建议的标签数量
 */
export function getOptimalTagCount(title: string, baseMax: number = 3): number {
  if (title.length > 20) {
    return baseMax;
  }
  return Math.min(2, Math.ceil(title.length / 5));
}

/**
 * 批量为多个书签提取关键词
 * @param titles 书签标题数组
 * @param config 配置选项
 * @returns 标题到关键词的映射
 */
export function extractKeywordsBatch(
  titles: string[],
  config: KeywordExtractorConfig = {}
): Record<string, string[]> {
  const results: Record<string, string[]> = {};

  titles.forEach(title => {
    const { keywords } = extractKeywords(title, config);
    results[title] = keywords;
  });

  return results;
}
