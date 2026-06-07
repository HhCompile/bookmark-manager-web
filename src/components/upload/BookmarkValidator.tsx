import { Bookmark } from '@/types/bookmark';

/**
 * 验证书签文件格式
 * @param content 文件内容
 * @param fileName 文件名
 * @returns 验证结果
 */
export function validateBookmarkFile(content: string, fileName: string) {
  // 检查文件大小
  if (content.length > 10 * 1024 * 1024) {
    // 10MB
    return { valid: false, message: '文件大小超过限制（最大 10MB）' };
  }

  // 尝试作为 HTML 书签文件验证
  if (
    fileName.endsWith('.html') ||
    fileName.endsWith('.htm') ||
    content.includes('<TITLE>Bookmarks</TITLE>')
  ) {
    return validateHtmlBookmarkFile(content);
  }

  // 尝试作为 JSON 书签文件验证
  if (fileName.endsWith('.json')) {
    return validateJsonBookmarkFile(content);
  }

  // 尝试自动检测
  if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
    return validateJsonBookmarkFile(content);
  } else if (content.includes('<')) {
    return validateHtmlBookmarkFile(content);
  }

  return {
    valid: false,
    message: '不支持的文件格式，请上传 HTML 或 JSON 格式的书签文件',
  };
}

/**
 * 验证 HTML 书签文件
 * @param content 文件内容
 * @returns 验证结果
 */
function validateHtmlBookmarkFile(content: string) {
  try {
    // 检查是否包含书签标记
    if (!content.includes('<DL>') || !content.includes('<DT>')) {
      return {
        valid: false,
        message: 'HTML 书签文件格式不正确，缺少必要的书签标记',
      };
    }

    // 解析 HTML 书签
    const bookmarks = parseHtmlBookmarks(content);

    if (bookmarks.length === 0) {
      return { valid: false, message: 'HTML 书签文件中未找到书签' };
    }

    return {
      valid: true,
      message: `HTML 书签验证成功，共 ${bookmarks.length} 个书签`,
      bookmarks,
    };
  } catch (error) {
    return {
      valid: false,
      message: `HTML 书签文件解析错误: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

/**
 * 验证 JSON 书签文件
 * @param content 文件内容
 * @returns 验证结果
 */
function validateJsonBookmarkFile(content: string) {
  try {
    const parsed = JSON.parse(content);

    // 检查 JSON 结构
    if (
      !Array.isArray(parsed) &&
      (!parsed.children || !Array.isArray(parsed.children))
    ) {
      return {
        valid: false,
        message: 'JSON 书签文件格式不正确，缺少必要的书签结构',
      };
    }

    // 解析 JSON 书签
    const bookmarks = parseJsonBookmarks(parsed);

    if (bookmarks.length === 0) {
      return { valid: false, message: 'JSON 书签文件中未找到书签' };
    }

    return {
      valid: true,
      message: `JSON 书签验证成功，共 ${bookmarks.length} 个书签`,
      bookmarks,
    };
  } catch (error) {
    return {
      valid: false,
      message: `JSON 书签文件解析错误: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

/**
 * 清理标题中的 base64 图片数据
 * @param title 原始标题
 * @returns 清理后的标题
 */
function cleanTitle(title: string): string {
  if (!title) return '';
  
  // 移除 base64 图片数据 (data:image/png;base64,...)
  let cleaned = title.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');
  
  // 移除其他可能的 data URI
  cleaned = cleaned.replace(/data:[^;]+;[^,]+,.+/g, '');
  
  // 清理多余空格
  cleaned = cleaned.trim();
  
  // 如果标题过长，截断
  if (cleaned.length > 200) {
    cleaned = cleaned.substring(0, 200) + '...';
  }
  
  return cleaned;
}

/**
 * 解析 HTML 书签文件
 * @param content 文件内容
 * @returns 书签数组
 */
function parseHtmlBookmarks(content: string): Bookmark[] {
  const bookmarks: Bookmark[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');

  // 查找所有书签项
  const dtElements = doc.querySelectorAll('DT');
  dtElements.forEach((dt) => {
    const aElement = dt.querySelector('A');
    if (aElement) {
      const addDateAttr = aElement.getAttribute('ADD_DATE');
      
      // 获取原始标题并清洗
      const rawTitle = aElement.textContent || '';
      const cleanedTitle = cleanTitle(rawTitle);
      
      // 获取 URL 并清洗
      let url = aElement.getAttribute('HREF') || '';
      url = cleanUrl(url);
      
      // 获取 favicon，如果是 base64 则不保存
      let favicon = aElement.getAttribute('ICON') || undefined;
      if (favicon && favicon.startsWith('data:')) {
        favicon = undefined; // 不保存 base64 图片
      }
      
      const bookmark: Bookmark = {
        id: `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: cleanedTitle,
        url: url,
        addedDate: new Date(addDateAttr ? parseInt(addDateAttr) * 1000 : Date.now()).toISOString(),
        favicon: favicon,
        tags: aElement.getAttribute('TAGS')?.split(',') || [],
        category: getParentFolderName(dt),
        isLocked: false,
      };
      
      // 只添加有效的书签
      if (bookmark.url && bookmark.title) {
        bookmarks.push(bookmark);
      }
    }

    // 处理文件夹
    const dlElement = dt.nextElementSibling;
    if (dlElement && dlElement.tagName === 'DL') {
      const folderName = dt.textContent || '未命名文件夹';
      // 递归处理文件夹内的书签
      processFolder(dlElement, folderName, bookmarks);
    }
  });

  return bookmarks;
}

/**
 * 清理 URL
 * @param url 原始 URL
 * @returns 清理后的 URL
 */
function cleanUrl(url: string): string {
  if (!url) return '';
  
  // 移除可能的 base64 数据
  if (url.startsWith('data:')) {
    return '';
  }
  
  // 清理空格
  url = url.trim();
  
  // 确保是有效的 URL
  try {
    new URL(url);
    return url;
  } catch {
    // 如果不是完整 URL，可能是相对路径或其他格式
    return url;
  }
}

/**
 * 处理文件夹内的书签
 * @param dlElement 文件夹元素
 * @param folderName 文件夹名称
 * @param bookmarks 书签数组
 */
function processFolder(
  dlElement: Element,
  folderName: string,
  bookmarks: Bookmark[]
) {
  const dtElements = dlElement.querySelectorAll('DT');
  dtElements.forEach((dt) => {
    const aElement = dt.querySelector('A');
    if (aElement) {
      const addDateAttr = aElement.getAttribute('ADD_DATE');
      
      // 获取原始标题并清洗
      const rawTitle = aElement.textContent || '';
      const cleanedTitle = cleanTitle(rawTitle);
      
      // 获取 URL 并清洗
      let url = aElement.getAttribute('HREF') || '';
      url = cleanUrl(url);
      
      // 获取 favicon，如果是 base64 则不保存
      let favicon = aElement.getAttribute('ICON') || undefined;
      if (favicon && favicon.startsWith('data:')) {
        favicon = undefined;
      }
      
      const bookmark: Bookmark = {
        id: `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: cleanedTitle,
        url: url,
        addedDate: new Date(addDateAttr ? parseInt(addDateAttr) * 1000 : Date.now()).toISOString(),
        favicon: favicon,
        tags: aElement.getAttribute('TAGS')?.split(',') || [],
        category: folderName,
        isLocked: false,
      };
      
      // 只添加有效的书签
      if (bookmark.url && bookmark.title) {
        bookmarks.push(bookmark);
      }
    }

    // 处理子文件夹
    const subDlElement = dt.nextElementSibling;
    if (subDlElement && subDlElement.tagName === 'DL') {
      const subFolderName = dt.textContent || '未命名文件夹';
      processFolder(subDlElement, `${folderName}/${subFolderName}`, bookmarks);
    }
  });
}

/**
 * 获取父文件夹名称
 * @param dtElement 书签元素
 * @returns 文件夹名称
 */
function getParentFolderName(dtElement: Element): string {
  let parent = dtElement.parentElement;
  while (parent) {
    if (parent.tagName === 'DL') {
      const previousSibling = parent.previousElementSibling;
      if (previousSibling && previousSibling.tagName === 'DT') {
        return previousSibling.textContent || '未分类';
      }
    }
    parent = parent.parentElement;
  }
  return '未分类';
}

/**
 * 解析 JSON 书签文件
 * @param data JSON 数据
 * @returns 书签数组
 */
function parseJsonBookmarks(data: unknown): Bookmark[] {
  const bookmarks: Bookmark[] = [];

  function processNode(node: unknown, category: string = '未分类') {
    if (typeof node !== 'object' || node === null) return;
    
    const nodeObj = node as Record<string, unknown>;
    
    if (nodeObj.url) {
      // 是书签
      const dateAdded = nodeObj.dateAdded || nodeObj.addedDate;
      const bookmark: Bookmark = {
        id:
          (typeof nodeObj.id === 'string' ? nodeObj.id : undefined) ||
          `json-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: typeof nodeObj.title === 'string' ? nodeObj.title : '',
        url: typeof nodeObj.url === 'string' ? nodeObj.url : '',
        addedDate: (dateAdded instanceof Date 
          ? dateAdded 
          : new Date(typeof dateAdded === 'number' ? dateAdded : Date.now())).toISOString(),
        favicon: typeof nodeObj.icon === 'string' ? nodeObj.icon : undefined,
        tags: Array.isArray(nodeObj.tags) ? nodeObj.tags : [],
        category,
        isLocked: false,
      };
      bookmarks.push(bookmark);
    } else if (Array.isArray(nodeObj.children)) {
      // 是文件夹
      const folderName = typeof nodeObj.title === 'string' ? nodeObj.title : '未命名文件夹';
      nodeObj.children.forEach((child: unknown) => {
        processNode(child, folderName);
      });
    }
  }

  if (Array.isArray(data)) {
    data.forEach((node) => processNode(node));
  } else if (typeof data === 'object' && data !== null) {
    const dataObj = data as Record<string, unknown>;
    if (Array.isArray(dataObj.children)) {
      dataObj.children.forEach((node: unknown) => processNode(node));
    } else {
      processNode(data);
    }
  }

  return bookmarks;
}

/**
 * 清理书签数据
 * @param bookmarks 原始书签数据
 * @returns 清理后的书签数据
 */
export function cleanBookmarks(bookmarks: unknown[]): Bookmark[] {
  return bookmarks
    .map((bookmark): Bookmark | null => {
      if (typeof bookmark !== 'object' || bookmark === null) return null;
      const b = bookmark as Record<string, unknown>;
      const dateAdded = b.dateAdded || b.addedDate;
      return {
        id:
          (typeof b.id === 'string' ? b.id : undefined) ||
          `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: typeof b.title === 'string' ? b.title : '未命名书签',
        url: typeof b.url === 'string' ? b.url : '',
        addedDate: (dateAdded instanceof Date 
          ? dateAdded 
          : new Date(typeof dateAdded === 'number' ? dateAdded : Date.now())).toISOString(),
        favicon: typeof b.icon === 'string' ? b.icon : undefined,
        tags: Array.isArray(b.tags) ? b.tags : [],
        category: typeof b.category === 'string' ? b.category : '未分类',
        isLocked: false,
      };
    })
    .filter((bookmark): bookmark is Bookmark => bookmark !== null && !!bookmark.url); // 过滤掉没有 URL 的项
}
