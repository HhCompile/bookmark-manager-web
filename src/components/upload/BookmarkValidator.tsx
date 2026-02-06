import { Bookmark } from '../../types/bookmark';

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
      const bookmark: Bookmark = {
        id: `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: aElement.textContent || '',
        url: aElement.getAttribute('HREF') || '',
        dateAdded: aElement.getAttribute('ADD_DATE') || Date.now(),
        icon: aElement.getAttribute('ICON') || undefined,
        tags: aElement.getAttribute('TAGS')?.split(',') || [],
        category: getParentFolderName(dt),
      };
      bookmarks.push(bookmark);
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
      const bookmark: Bookmark = {
        id: `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: aElement.textContent || '',
        url: aElement.getAttribute('HREF') || '',
        dateAdded: aElement.getAttribute('ADD_DATE') || Date.now(),
        icon: aElement.getAttribute('ICON') || undefined,
        tags: aElement.getAttribute('TAGS')?.split(',') || [],
        category: folderName,
      };
      bookmarks.push(bookmark);
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
function parseJsonBookmarks(data: any): Bookmark[] {
  const bookmarks: Bookmark[] = [];

  function processNode(node: any, category: string = '未分类') {
    if (node.url) {
      // 是书签
      const bookmark: Bookmark = {
        id:
          node.id ||
          `json-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: node.title || '',
        url: node.url,
        dateAdded: node.dateAdded || Date.now(),
        icon: node.icon,
        tags: node.tags || [],
        category,
      };
      bookmarks.push(bookmark);
    } else if (node.children && Array.isArray(node.children)) {
      // 是文件夹
      const folderName = node.title || '未命名文件夹';
      node.children.forEach((child: any) => {
        processNode(child, folderName);
      });
    }
  }

  if (Array.isArray(data)) {
    data.forEach((node) => processNode(node));
  } else if (data.children && Array.isArray(data.children)) {
    data.children.forEach((node: any) => processNode(node));
  } else {
    processNode(data);
  }

  return bookmarks;
}

/**
 * 清理书签数据
 * @param bookmarks 原始书签数据
 * @returns 清理后的书签数据
 */
export function cleanBookmarks(bookmarks: any[]): Bookmark[] {
  return bookmarks
    .map((bookmark) => ({
      id:
        bookmark.id ||
        `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: bookmark.title || '未命名书签',
      url: bookmark.url || '',
      dateAdded: bookmark.dateAdded || Date.now(),
      icon: bookmark.icon,
      tags: bookmark.tags || [],
      category: bookmark.category || '未分类',
    }))
    .filter((bookmark) => bookmark.url); // 过滤掉没有 URL 的项
}
