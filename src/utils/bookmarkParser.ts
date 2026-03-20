/**
 * 书签 HTML 文件解析器
 * 支持从浏览器导出的 Netscape Bookmark File Format 格式
 */

export interface ParsedBookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  addDate?: number;
  lastModified?: number;
  folder?: string;
  tags: string[];
}

export interface ParsedFolder {
  id: string;
  title: string;
  addDate?: number;
  lastModified?: number;
  children: (ParsedBookmark | ParsedFolder)[];
}

export interface ParseResult {
  bookmarks: ParsedBookmark[];
  folders: ParsedFolder[];
  totalCount: number;
  folderCount: number;
}

/**
 * 解析书签 HTML 文件内容
 * @param htmlContent - HTML 文件内容
 * @returns 解析结果
 */
export function parseBookmarkHtml(htmlContent: string): ParseResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const bookmarks: ParsedBookmark[] = [];
  const folders: ParsedFolder[] = [];

  // 递归解析书签树
  const parseDlElement = (
    dlElement: HTMLDListElement,
    parentFolder?: string
  ): (ParsedBookmark | ParsedFolder)[] => {
    const children: (ParsedBookmark | ParsedFolder)[] = [];
    const dtElements = dlElement.querySelectorAll(':scope > dt');

    dtElements.forEach((dt) => {
      // 检查是否是文件夹 (h3 标签)
      const h3Element = dt.querySelector(':scope > h3');
      if (h3Element) {
        const folderId = `folder-${Math.random().toString(36).substr(2, 9)}`;
        const folder: ParsedFolder = {
          id: folderId,
          title: h3Element.textContent?.trim() || '未命名文件夹',
          addDate: parseInt(h3Element.getAttribute('add_date') || '0', 10) * 1000,
          lastModified: parseInt(h3Element.getAttribute('last_modified') || '0', 10) * 1000,
          children: [],
        };

        // 递归解析子文件夹
        const childDl = dt.querySelector(':scope > dl');
        if (childDl) {
          folder.children = parseDlElement(childDl as HTMLDListElement, folder.title);
        }

        folders.push(folder);
        children.push(folder);
      }

      // 检查是否是书签 (a 标签)
      const aElement = dt.querySelector(':scope > a');
      if (aElement) {
        const url = aElement.getAttribute('href') || '';
        const title = aElement.textContent?.trim() || '';

        // 跳过空链接或 javascript: 链接
        if (!url || url.startsWith('javascript:') || url === 'about:blank') {
          return;
        }

        // 从 URL 提取域名作为 favicon
        const icon = extractFaviconFromUrl(url);

        // 解析标签 (从 TAGS 属性或文件夹路径)
        const tags: string[] = [];
        const tagsAttr = aElement.getAttribute('tags');
        if (tagsAttr) {
          tags.push(...tagsAttr.split(',').map(t => t.trim()).filter(Boolean));
        }
        if (parentFolder) {
          tags.push(parentFolder);
        }

        const bookmark: ParsedBookmark = {
          id: `import-${Math.random().toString(36).substr(2, 9)}`,
          title,
          url,
          icon,
          addDate: parseInt(aElement.getAttribute('add_date') || '0', 10) * 1000,
          lastModified: parseInt(aElement.getAttribute('last_modified') || '0', 10) * 1000,
          folder: parentFolder,
          tags: [...new Set(tags)], // 去重
        };

        bookmarks.push(bookmark);
        children.push(bookmark);
      }
    });

    return children;
  };

  // 从根级别的 DL 开始解析
  const rootDl = doc.querySelector('dl');
  if (rootDl) {
    parseDlElement(rootDl as HTMLDListElement);
  }

  return {
    bookmarks,
    folders,
    totalCount: bookmarks.length,
    folderCount: folders.length,
  };
}

/**
 * 从 URL 提取域名并返回对应的 favicon emoji
 */
function extractFaviconFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    // 常用网站图标映射
    const iconMap: Record<string, string> = {
      'github.com': '🐙',
      'gist.github.com': '📝',
      'google.com': '🔍',
      'youtube.com': '📺',
      'youtu.be': '📺',
      'stackoverflow.com': '📚',
      'stackexchange.com': '📚',
      'twitter.com': '🐦',
      'x.com': '🐦',
      'facebook.com': '📘',
      'instagram.com': '📷',
      'linkedin.com': '💼',
      'reddit.com': '🔴',
      'medium.com': '📝',
      'notion.so': '📋',
      'figma.com': '🎨',
      'vercel.com': '▲',
      'netlify.com': '🌐',
      'npmjs.com': '📦',
      'amazon.com': '📦',
      'aws.amazon.com': '☁️',
      'azure.com': '☁️',
      'cloud.google.com': '☁️',
      'docker.com': '🐳',
      'kubernetes.io': '☸️',
      'gitlab.com': '🦊',
      'bitbucket.org': '🪣',
      'jira.com': '📋',
      'trello.com': '📋',
      'slack.com': '💬',
      'discord.com': '💬',
      'telegram.org': '✈️',
      'whatsapp.com': '💬',
      'wechat.com': '💬',
      'zhihu.com': '知',
      'bilibili.com': '📺',
      'weibo.com': '📱',
      'taobao.com': '🛒',
      'tmall.com': '🛒',
      'jd.com': '🛒',
      'alibaba.com': '🏭',
      'baidu.com': '🔍',
      'wikipedia.org': '📖',
      'wikimedia.org': '📖',
      'mozilla.org': '🦊',
      'apple.com': '🍎',
      'microsoft.com': '💻',
      'googleapis.com': '⚙️',
      'firebase.google.com': '🔥',
      'supabase.com': '⚡',
      'mongodb.com': '🍃',
      'postgresql.org': '🐘',
      'mysql.com': '🐬',
      'redis.io': '🔴',
      'elastic.co': '🔍',
      'nginx.com': '🌐',
      'apache.org': '🪶',
      'jenkins.io': '👷',
      'travis-ci.org': '🔧',
      'circleci.com': '⭕',
      'githubactions': '⚙️',
      'sentry.io': '🐛',
      'logrocket.com': '🚀',
      'mixpanel.com': '📊',
      'analytics.google.com': '📈',
      'segment.com': '📡',
      'stripe.com': '💳',
      'paypal.com': '💰',
      'alipay.com': '💰',
      'wechatpay.com': '💰',
      'visa.com': '💳',
      'mastercard.com': '💳',
      'bitcoin.org': '₿',
      'ethereum.org': 'Ξ',
      'binance.com': '💱',
      'coinbase.com': '💰',
    };

    // 精确匹配
    for (const [domain, icon] of Object.entries(iconMap)) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) {
        return icon;
      }
    }

    // 默认图标 - 根据 TLD 返回不同图标
    if (hostname.includes('github')) return '🐙';
    if (hostname.includes('google')) return '🔍';
    if (hostname.includes('docs')) return '📄';
    if (hostname.includes('blog')) return '📝';
    if (hostname.includes('news')) return '📰';
    if (hostname.includes('shop') || hostname.includes('store')) return '🛒';

    return '🔖';
  } catch {
    return '🔖';
  }
}

/**
 * 读取文件内容为文本
 * @param file - 文件对象
 * @returns 文件内容
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('读取文件失败'));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取错误'));
    };

    reader.readAsText(file);
  });
}

/**
 * 验证文件是否为有效的书签 HTML 文件
 * @param content - 文件内容
 * @returns 是否有效
 */
export function isValidBookmarkFile(content: string): boolean {
  // 检查是否包含 Netscape Bookmark File 格式的特征
  const hasDoctype = content.toLowerCase().includes('<!doctype netscape-bookmark-file-1>');
  const hasMeta = content.toLowerCase().includes('netscape-bookmark-file-1');
  const hasDlTag = content.includes('<dl');
  const hasAtag = content.includes('<a ');

  return (hasDoctype || hasMeta) && hasDlTag && hasAtag;
}

/**
 * 生成导入报告
 * @param result - 解析结果
 * @returns 报告文本
 */
export function generateImportReport(result: ParseResult): string {
  const lines: string[] = [];
  lines.push('📚 书签导入报告');
  lines.push('─'.repeat(40));
  lines.push(`总计导入书签: ${result.totalCount} 个`);
  lines.push(`文件夹数量: ${result.folderCount} 个`);
  lines.push('');

  if (result.folders.length > 0) {
    lines.push('📁 文件夹结构:');
    result.folders.forEach((folder, index) => {
      const count = countBookmarksInFolder(folder);
      lines.push(`  ${index + 1}. ${folder.title} (${count} 个书签)`);
    });
    lines.push('');
  }

  // 统计标签
  const allTags = new Set<string>();
  result.bookmarks.forEach(b => b.tags.forEach(t => allTags.add(t)));
  if (allTags.size > 0) {
    lines.push(`🏷️ 标签数量: ${allTags.size} 个`);
  }

  return lines.join('\n');
}

/**
 * 计算文件夹中的书签数量（递归）
 */
function countBookmarksInFolder(folder: ParsedFolder): number {
  let count = 0;
  for (const child of folder.children) {
    if ('url' in child) {
      count++;
    } else {
      count += countBookmarksInFolder(child);
    }
  }
  return count;
}
