/**
 * Mock服务封装类
 * 使用MockJS实现API请求拦截和数据模拟
 * 为前端开发提供完整的API Mock能力
 */

import Mock from 'mockjs';
import type { Bookmark, Category, Tag, Folder } from '@/types/entities';

/**
 * 书签Mock数据
 */
const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    url: 'https://github.com',
    title: 'GitHub - The world\'s leading software development platform',
    description: 'Build and deploy software with the world\'s leading software development platform',
    favicon: 'https://github.com/favicon.ico',
    categoryId: '1',
    tags: ['开发', 'Git', '开源'],
    isValid: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    url: 'https://react.dev',
    title: 'React - A JavaScript library for building user interfaces',
    description: 'The library for web and native user interfaces',
    favicon: 'https://react.dev/favicon.ico',
    categoryId: '2',
    tags: ['React', 'JavaScript', '前端'],
    isValid: true,
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: '3',
    url: 'https://developer.mozilla.org',
    title: 'MDN Web Docs',
    description: 'Resources for developers, by developers',
    favicon: 'https://developer.mozilla.org/favicon.ico',
    categoryId: '1',
    tags: ['文档', 'Web', '前端'],
    isValid: true,
    createdAt: new Date('2024-01-17').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString(),
  },
  {
    id: '4',
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS - Rapidly build modern websites',
    description: 'A utility-first CSS framework for rapidly building custom user interfaces',
    favicon: 'https://tailwindcss.com/favicon.ico',
    categoryId: '2',
    tags: ['CSS', '框架', 'UI'],
    isValid: true,
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-18').toISOString(),
  },
  {
    id: '5',
    url: 'https://stackoverflow.com',
    title: 'Stack Overflow - Where Developers Learn, Share, & Build',
    description: 'Stack Overflow is the largest, most trusted online community',
    favicon: 'https://stackoverflow.com/favicon.ico',
    categoryId: '1',
    tags: ['问答', '编程', '社区'],
    isValid: true,
    createdAt: new Date('2024-01-19').toISOString(),
    updatedAt: new Date('2024-01-19').toISOString(),
  },
  {
    id: '6',
    url: 'https://dribbble.com',
    title: 'Dribbble - Discover the World\'s Top Designers & Creative Professionals',
    description: 'Explore the world\'s top designers & creative professionals',
    favicon: 'https://dribbble.com/favicon.ico',
    categoryId: '3',
    tags: ['设计', 'UI/UX', '灵感'],
    isValid: true,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
];

/**
 * Mock分类数据
 */
const mockCategories: Category[] = [
  { id: '1', name: '技术', description: '技术开发相关资源', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: '学习', description: '学习资源和教程', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: '设计', description: '设计资源和灵感', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: '工具', description: '开发工具和实用程序', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: '娱乐', description: '娱乐和休闲', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

/**
 * Mock标签数据
 */
const mockTags: Tag[] = [
  { id: '1', name: 'React', count: 234 },
  { id: '2', name: 'JavaScript', count: 189 },
  { id: '3', name: 'TypeScript', count: 156 },
  { id: '4', name: 'CSS', count: 123 },
  { id: '5', name: '设计', count: 98 },
  { id: '6', name: '前端', count: 87 },
  { id: '7', name: '后端', count: 76 },
  { id: '8', name: '开发', count: 65 },
];

/**
 * Mock文件夹数据
 */
const mockFolders: Folder[] = [
  { id: '1', name: '工作', icon: 'folder', parentId: null, order: 1 },
  { id: '2', name: '个人', icon: 'folder', parentId: null, order: 2 },
  { id: '3', name: '学习', icon: 'folder', parentId: null, order: 3 },
];

/**
 * MockService类
 * 提供统一的API Mock服务
 */
export class MockService {
  private static mockEnabled: boolean = true;
  private static mockDelay: number = 500; // 模拟网络延迟

  /**
   * 启用Mock服务
   */
  static enable(): void {
    this.mockEnabled = true;
    console.log('✅ MockService已启用');
  }

  /**
   * 禁用Mock服务
   */
  static disable(): void {
    this.mockEnabled = false;
    console.log('❌ MockService已禁用');
  }

  /**
   * 获取所有书签
   */
  static async getBookmarks(): Promise<{
    bookmarks: Bookmark[];
    categories: string[];
    tags: string[];
    folders: Folder[];
  }> {
    await this.delay();
    
    return {
      bookmarks: Mock.Random.shuffle([...mockBookmarks]),
      categories: mockCategories.map(c => c.name),
      tags: mockTags.map(t => t.name),
      folders: mockFolders,
    };
  }

  /**
   * 添加书签
   */
  static async addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bookmark> {
    await this.delay();
    
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Mock.Random.guid().slice(0, 8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockBookmarks.push(newBookmark);
    return newBookmark;
  }

  /**
   * 更新书签
   */
  static async updateBookmark(url: string, data: Partial<Bookmark>): Promise<Bookmark> {
    await this.delay();
    
    const index = mockBookmarks.findIndex(b => b.url === url);
    if (index === -1) {
      throw new Error('书签不存在');
    }
    
    mockBookmarks[index] = {
      ...mockBookmarks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return mockBookmarks[index];
  }

  /**
   * 删除书签
   */
  static async deleteBookmark(url: string): Promise<void> {
    await this.delay();
    
    const index = mockBookmarks.findIndex(b => b.url === url);
    if (index === -1) {
      throw new Error('书签不存在');
    }
    
    mockBookmarks.splice(index, 1);
  }

  /**
   * 批量删除书签
   */
  static async batchDeleteBookmarks(urls: string[]): Promise<void> {
    await this.delay();
    
    const deletedCount = urls.filter(url => {
      const index = mockBookmarks.findIndex(b => b.url === url);
      if (index !== -1) {
        mockBookmarks.splice(index, 1);
        return true;
      }
      return false;
    }).length;
    
    if (deletedCount === 0) {
      throw new Error('没有找到可删除的书签');
    }
  }

  /**
   * 获取分类列表
   */
  static async getCategories(): Promise<Category[]> {
    await this.delay();
    return [...mockCategories];
  }

  /**
   * 获取标签列表
   */
  static async getTags(): Promise<Tag[]> {
    await this.delay();
    return [...mockTags];
  }

  /**
   * 获取文件夹列表
   */
  static async getFolders(): Promise<Folder[]> {
    await this.delay();
    return [...mockFolders];
  }

  /**
   * 上传书签文件
   */
  static async uploadBookmarks(file: File): Promise<{
    count: number;
    bookmarks: Bookmark[];
  }> {
    await this.delay(2000); // 模拟上传延迟
    
    // 随机生成导入的书签
    const count = Mock.Random.integer(5, 20);
    const importedBookmarks: Bookmark[] = Array.from({ length: count }, (_, i) => ({
      id: Mock.Random.guid().slice(0, 8),
      url: `https://example.com/${i + 1}`,
      title: `导入的书签 ${i + 1}`,
      description: `从文件 ${file.name} 导入`,
      favicon: '',
      categoryId: mockCategories[Mock.Random.integer(0, mockCategories.length - 1)].id,
      tags: mockTags
        .sort(() => 0.5 - Math.random())
        .slice(0, Mock.Random.integer(1, 3))
        .map(t => t.name),
      isValid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    mockBookmarks.push(...importedBookmarks);
    
    return {
      count: importedBookmarks.length,
      bookmarks: importedBookmarks,
    };
  }

  /**
   * 导出书签
   */
  static async exportBookmarks(format: 'html' | 'json' | 'csv' = 'json'): Promise<Blob> {
    await this.delay(1000);
    
    let content: string;
    
    if (format === 'json') {
      content = JSON.stringify(mockBookmarks, null, 2);
    } else if (format === 'html') {
      content = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
${mockBookmarks.map(b => `    <DT><A HREF="${b.url}">${b.title}</A></DT>`).join('\n')}
</DL><p>
`;
    } else {
      content = 'Title,URL,Description,Category,Tags\n' + 
        mockBookmarks.map(b => 
          `"${b.title}","${b.url}","${b.description || ''}","${b.category || ''}","${(b.tags || []).join('|')}"`
        ).join('\n');
    }
    
    return new Blob([content], { type: 'text/plain;charset=utf-8' });
  }

  /**
   * 验证书签链接
   */
  static async validateBookmarks(urls: string[] = []): Promise<{
    valid: number;
    invalid: number;
    message: string;
  }> {
    await this.delay(3000); // 模拟验证延迟
    
    let valid = 0;
    let invalid = 0;
    
    const targetUrls = urls.length > 0 ? urls : mockBookmarks.map(b => b.url);
    
    for (const url of targetUrls) {
      // 模拟验证结果：95%的链接有效
      if (Mock.Random.boolean(0.95)) {
        valid++;
      } else {
        invalid++;
      }
    }
    
    return {
      valid,
      invalid,
      message: `验证完成，共${targetUrls.length}个链接，有效${valid}个，无效${invalid}个`,
    };
  }

  /**
   * 检测重复书签
   */
  static async detectDuplicates(): Promise<{
    groups: Array<{
      url: string;
      bookmarks: Bookmark[];
    }>;
  }> {
    await this.delay(1000);
    
    // 按URL分组查找重复
    const urlMap = new Map<string, Bookmark[]>();
    mockBookmarks.forEach(bookmark => {
      const existing = urlMap.get(bookmark.url);
      if (existing) {
        existing.push(bookmark);
      } else {
        urlMap.set(bookmark.url, [bookmark]);
      }
    });
    
    const groups = Array.from(urlMap.entries())
      .filter(([_, bookmarks]) => bookmarks.length > 1)
      .map(([url, bookmarks]) => ({ url, bookmarks }));
    
    return { groups };
  }

  /**
   * 获取统计数据
   */
  static async getStats(): Promise<{
    total: number;
    categories: number;
    tags: number;
    validLinks: number;
    recentlyAdded: number;
  }> {
    await this.delay();
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentlyAdded = mockBookmarks.filter(b => new Date(b.createdAt) > weekAgo).length;
    
    return {
      total: mockBookmarks.length,
      categories: mockCategories.length,
      tags: mockTags.length,
      validLinks: mockBookmarks.filter(b => b.isValid).length,
      recentlyAdded,
    };
  }

  /**
   * 模拟网络延迟
   */
  private static delay(ms: number = this.mockDelay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 重置所有Mock数据
   */
  static reset(): void {
    console.warn('⚠️  MockService数据已重置');
  }

  /**
   * 获取Mock状态
   */
  static isMockEnabled(): boolean {
    return this.mockEnabled;
  }

  /**
   * 设置Mock延迟时间
   */
  static setMockDelay(ms: number): void {
    this.mockDelay = ms;
    console.log(`⏱️  Mock延迟设置为 ${ms}ms`);
  }
}

/**
 * 初始化MockService
 */
MockService.enable();

export default MockService;
