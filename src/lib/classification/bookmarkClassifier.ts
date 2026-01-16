/**
 * 书签分类工具模块
 * 根据标题和URL智能分类书签
 */

/**
 * 分类规则
 */
export interface ClassificationRule {
  id: string;
  category: string;
  titleKeywords?: string[];
  urlPatterns?: string[];
  urlDomains?: string[];
  priority?: number;
}

/**
 * 分类结果
 */
export interface ClassificationResult {
  category: string;
  confidence: number;
  matchedRules: string[];
}

/**
 * 默认分类规则
 */
const CLASSIFICATION_RULES: ClassificationRule[] = [
  {
    id: 'tech',
    category: '技术',
    titleKeywords: ['编程', '开发', '代码', '框架', 'API', '库'],
    urlDomains: ['github.com', 'stackoverflow.com', 'developer.mozilla.org', 'reactjs.org'],
    priority: 10,
  },
  {
    id: 'news',
    category: '新闻',
    titleKeywords: ['新闻', '时事', '报道'],
    urlPatterns: ['/news', 'xinwen'],
    priority: 10,
  },
  {
    id: 'entertainment',
    category: '娱乐',
    titleKeywords: ['娱乐', '电影', '音乐', '游戏', '视频', '动漫'],
    urlDomains: ['youtube.com', 'vimeo.com', 'bilibili.com'],
    priority: 10,
  },
  {
    id: 'education',
    category: '学习',
    titleKeywords: ['学习', '教程', '课程', '教育', '知识', '培训'],
    urlPatterns: ['/edu', '/course', '/tutorial'],
    priority: 10,
  },
  {
    id: 'shopping',
    category: '购物',
    titleKeywords: ['购物', '商品', '购买', '商城', '店铺'],
    urlDomains: ['amazon.com', 'taobao.com', 'jd.com', 'tmall.com', 'shopify.com'],
    urlPatterns: ['/shop', '/buy', '/store'],
    priority: 10,
  },
  {
    id: 'social',
    category: '社交',
    titleKeywords: ['社交', '社区', '论坛'],
    urlDomains: ['facebook.com', 'twitter.com', 'weibo.com', 'zhihu.com', 'reddit.com'],
    priority: 10,
  },
  {
    id: 'docs',
    category: '文档',
    titleKeywords: ['文档', 'docs', '文档中心'],
    urlPatterns: ['/docs', '/documentation'],
    priority: 8,
  },
];

/**
 * 根据标题和URL分类书签
 * @param title 书签标题
 * @param url 书签URL
 * @param customRules 自定义分类规则（可选）
 * @returns 分类结果
 */
export function classifyBookmark(
  title: string,
  url: string,
  customRules?: ClassificationRule[]
): ClassificationResult {
  const rules = customRules || CLASSIFICATION_RULES;
  const titleLower = title.toLowerCase();
  const urlLower = url.toLowerCase();

  const matches: Array<{ rule: ClassificationRule; score: number }> = [];

  for (const rule of rules) {
    let score = 0;
    const matchedFeatures: string[] = [];

    // 检查标题关键词
    if (rule.titleKeywords) {
      for (const keyword of rule.titleKeywords) {
        if (titleLower.includes(keyword.toLowerCase())) {
          score += 3;
          matchedFeatures.push(`title:${keyword}`);
        }
      }
    }

    // 检查URL模式
    if (rule.urlPatterns) {
      for (const pattern of rule.urlPatterns) {
        if (urlLower.includes(pattern.toLowerCase())) {
          score += 2;
          matchedFeatures.push(`url:${pattern}`);
        }
      }
    }

    // 检查域名
    if (rule.urlDomains) {
      for (const domain of rule.urlDomains) {
        if (urlLower.includes(domain.toLowerCase())) {
          score += 4;
          matchedFeatures.push(`domain:${domain}`);
        }
      }
    }

    if (score > 0) {
      matches.push({ rule, score });
    }
  }

  if (matches.length === 0) {
    return {
      category: '其他',
      confidence: 0.5,
      matchedRules: [],
    };
  }

  // 找到最高分的规则
  matches.sort((a, b) => {
    const priorityDiff = (b.rule.priority || 0) - (a.rule.priority || 0);
    if (priorityDiff !== 0) return priorityDiff;
    return b.score - a.score;
  });

  const bestMatch = matches[0];
  const maxPossibleScore = matches.length * 9; // 假设最大匹配分数

  return {
    category: bestMatch.rule.category,
    confidence: Math.min(0.95, bestMatch.score / maxPossibleScore + 0.6),
    matchedRules: matches.map(m => m.rule.id),
  };
}

/**
 * 批量分类书签
 * @param bookmarks 书签数组
 * @param customRules 自定义分类规则（可选）
 * @returns URL到分类结果的映射
 */
export function classifyBookmarks(
  bookmarks: Array<{ title: string; url: string }>,
  customRules?: ClassificationRule[]
): Map<string, ClassificationResult> {
  const results = new Map<string, ClassificationResult>();

  for (const bookmark of bookmarks) {
    const result = classifyBookmark(bookmark.title, bookmark.url, customRules);
    results.set(bookmark.url, result);
  }

  return results;
}

/**
 * 获取所有分类
 * @returns 分类名称数组
 */
export function getAllCategories(customRules?: ClassificationRule[]): string[] {
  const rules = customRules || CLASSIFICATION_RULES;
  const categories = new Set(rules.map(r => r.category));
  categories.add('其他');
  return Array.from(categories);
}

/**
 * 添加自定义分类规则
 * @param rule 要添加的规则
 */
export function addClassificationRule(rule: ClassificationRule): void {
  CLASSIFICATION_RULES.push(rule);
  // 按优先级排序
  CLASSIFICATION_RULES.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * 根据分类ID获取分类信息
 * @param categoryId 分类ID
 * @returns 分类规则
 */
export function getClassificationRuleById(categoryId: string): ClassificationRule | undefined {
  return CLASSIFICATION_RULES.find(r => r.id === categoryId);
}
