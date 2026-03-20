/**
 * 书签解析 Web Worker
 * 在后台线程中解析大型 HTML 书签文件，避免阻塞主线程
 */

interface WorkerMessage {
  type: 'parse' | 'cancel';
  data?: {
    content: string;
    maxBookmarks?: number;
    filterFolders?: string[];
  };
}

interface ParsedBookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  addDate?: number;
  lastModified?: number;
  folder?: string;
  folderPath: string[];
  tags: string[];
}

interface ParsedFolder {
  id: string;
  title: string;
  addDate?: number;
  lastModified?: number;
  bookmarkCount: number;
  children: ParsedFolder[];
}

interface ParseProgress {
  type: 'progress';
  progress: number;
  currentItem: string;
  processedCount: number;
  totalEstimate: number;
}

interface ParseResult {
  type: 'complete';
  bookmarks: ParsedBookmark[];
  folders: ParsedFolder[];
  stats: {
    totalCount: number;
    folderCount: number;
    skippedCount: number;
    totalSize: number;
    parseTime: number;
  };
}

interface ParseError {
  type: 'error';
  error: string;
}

// 从 URL 提取 favicon
function extractFaviconFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const iconMap: Record<string, string> = {
      'github.com': '🐙', 'google.com': '🔍', 'youtube.com': '📺',
      'stackoverflow.com': '📚', 'twitter.com': '🐦', 'x.com': '🐦',
      'facebook.com': '📘', 'linkedin.com': '💼', 'reddit.com': '🔴',
      'medium.com': '📝', 'notion.so': '📋', 'figma.com': '🎨',
      'zhihu.com': '知', 'bilibili.com': '📺', 'baidu.com': '🔍',
    };
    for (const [domain, icon] of Object.entries(iconMap)) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) return icon;
    }
    if (hostname.includes('github')) return '🐙';
    if (hostname.includes('google')) return '🔍';
    return '🔖';
  } catch { return '🔖'; }
}

function generateId(): string {
  return `import-${Math.random().toString(36).substr(2, 9)}`;
}

async function parseBookmarkHtml(
  content: string,
  maxBookmarks?: number,
  filterFolders?: string[]
): Promise<{ bookmarks: ParsedBookmark[]; folders: ParsedFolder[]; stats: any }> {
  const startTime = performance.now();
  const bookmarks: ParsedBookmark[] = [];
  const folderMap = new Map<string, ParsedFolder>();
  let skippedCount = 0;

  const hrefMatches = content.match(/<A[^>]+HREF=/gi);
  const totalEstimate = hrefMatches ? hrefMatches.length : 100;

  let currentFolderPath: string[] = [];
  let folderDepth = 0;
  let lastProgressUpdate = 0;

  const lines = content.split(/[\r\n]+/);
  const totalLines = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i - lastProgressUpdate > 100) {
      self.postMessage({
        type: 'progress',
        progress: Math.min((i / totalLines) * 100, 99),
        currentItem: `解析第 ${i}/${totalLines} 行...`,
        processedCount: bookmarks.length,
        totalEstimate,
      } as ParseProgress);
      lastProgressUpdate = i;
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    const h3Match = line.match(/<H3[^>]*>([^<]*)<\/H3>/i);
    if (h3Match) {
      const folderTitle = h3Match[1].trim();
      const folderId = generateId();
      currentFolderPath = [...currentFolderPath.slice(0, folderDepth), folderTitle];
      folderMap.set(folderId, {
        id: folderId, title: folderTitle,
        bookmarkCount: 0, children: [],
      });
      continue;
    }

    if (/<DL[^>]*>/i.test(line)) { folderDepth++; continue; }
    if (/<\/DL>/i.test(line)) {
      folderDepth = Math.max(0, folderDepth - 1);
      currentFolderPath = currentFolderPath.slice(0, folderDepth);
      continue;
    }

    const aMatch = line.match(/<A\s+([^>]*)>([^<]*)<\/A>/i);
    if (aMatch) {
      const attrs = aMatch[1];
      const title = aMatch[2].trim();
      const hrefMatch = attrs.match(/HREF=["']([^"']+)["']/i);
      if (!hrefMatch) continue;

      const url = hrefMatch[1];
      if (!url || url.startsWith('javascript:') || url === 'about:blank') {
        skippedCount++; continue;
      }
      if (maxBookmarks && bookmarks.length >= maxBookmarks) {
        skippedCount++; continue;
      }

      const currentFolder = currentFolderPath[currentFolderPath.length - 1] || '未分类';
      if (filterFolders?.length > 0 && !filterFolders.some(f => currentFolder.includes(f))) {
        skippedCount++; continue;
      }

      const addDateMatch = attrs.match(/ADD_DATE=["'](\d+)["']/i);
      const tags: string[] = [...currentFolderPath];
      const tagsMatch = attrs.match(/TAGS=["']([^"']+)["']/i);
      if (tagsMatch) tags.push(...tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean));

      bookmarks.push({
        id: generateId(), title: title || '无标题', url,
        icon: extractFaviconFromUrl(url),
        addDate: addDateMatch ? parseInt(addDateMatch[1], 10) * 1000 : undefined,
        folder: currentFolder, folderPath: [...currentFolderPath],
        tags: [...new Set(tags)],
      });
    }
  }

  const rootFolders: ParsedFolder[] = [];
  const folderList = Array.from(folderMap.values());
  bookmarks.forEach(b => {
    const folder = folderList.find(f => f.title === b.folder);
    if (folder) folder.bookmarkCount++;
  });
  folderList.forEach(f => { if (f.bookmarkCount > 0) rootFolders.push(f); });

  return {
    bookmarks, folders: rootFolders,
    stats: {
      totalCount: bookmarks.length, folderCount: rootFolders.length,
      skippedCount, totalSize: content.length,
      parseTime: Math.round(performance.now() - startTime),
    },
  };
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;
  if (type === 'parse' && data) {
    try {
      const result = await parseBookmarkHtml(data.content, data.maxBookmarks, data.filterFolders);
      self.postMessage({ type: 'complete', ...result } as ParseResult);
    } catch (error) {
      self.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : '解析失败',
      } as ParseError);
    }
  }
};

export {};
