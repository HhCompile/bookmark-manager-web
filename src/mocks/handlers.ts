/**
 * Mock Service Worker 处理器
 * 拦截 API 请求并返回 Mock 数据
 */

import { http, HttpResponse } from 'msw';
import {
  mockBookmarks,
  mockFolders,
  mockAISuggestions,
  mockStats,
  mockTasks,
} from './data';

// 模拟延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// 创建标准响应
const createResponse = <T>(data: T, message?: string) => ({
  data,
  success: true,
  message,
  timestamp: new Date().toISOString(),
});

export const handlers = [
  // ===== 书签 API =====
  
  // 获取书签列表
  http.get('/api/bookmarks', async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const folderId = url.searchParams.get('folderId');
    const search = url.searchParams.get('search')?.toLowerCase();
    const tag = url.searchParams.get('tag');
    
    let filtered = [...mockBookmarks];
    
    // 按文件夹筛选
    if (folderId) {
      const folder = mockFolders.find((f) => f.id === folderId);
      if (folder) {
        filtered = filtered.filter((b) => folder.bookmarks.includes(b.id));
      }
    }
    
    // 按搜索词筛选
    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(search) ||
          b.url.toLowerCase().includes(search) ||
          b.alias?.toLowerCase().includes(search) ||
          b.tags.some((t) => t.toLowerCase().includes(search))
      );
    }
    
    // 按标签筛选
    if (tag) {
      filtered = filtered.filter((b) => b.tags.includes(tag));
    }
    
    return HttpResponse.json(createResponse(filtered));
  }),
  
  // 获取单个书签
  http.get('/api/bookmarks/:id', async ({ params }) => {
    await delay();
    const bookmark = mockBookmarks.find((b) => b.id === params.id);
    if (!bookmark) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(createResponse(bookmark));
  }),
  
  // 创建书签
  http.post('/api/bookmarks', async ({ request }) => {
    await delay();
    const data = await request.json() as Omit<typeof mockBookmarks[0], 'id' | 'addedDate'>;
    const newBookmark = {
      ...data,
      id: Math.random().toString(36).substring(2, 15),
      addedDate: new Date(),
    };
    mockBookmarks.push(newBookmark);
    return HttpResponse.json(createResponse(newBookmark, '书签创建成功'));
  }),
  
  // 更新书签
  http.put('/api/bookmarks/:id', async ({ request, params }) => {
    await delay();
    const data = await request.json() as Partial<typeof mockBookmarks[0]>;
    const index = mockBookmarks.findIndex((b) => b.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockBookmarks[index] = { ...mockBookmarks[index], ...data };
    return HttpResponse.json(createResponse(mockBookmarks[index], '书签更新成功'));
  }),
  
  // 删除书签
  http.delete('/api/bookmarks/:id', async ({ params }) => {
    await delay();
    const index = mockBookmarks.findIndex((b) => b.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockBookmarks.splice(index, 1);
    return HttpResponse.json(createResponse(null, '书签删除成功'));
  }),
  
  // ===== 文件夹 API =====
  
  // 获取文件夹列表
  http.get('/api/folders', async () => {
    await delay();
    return HttpResponse.json(createResponse(mockFolders));
  }),
  
  // 创建文件夹
  http.post('/api/folders', async ({ request }) => {
    await delay();
    const data = await request.json() as Omit<typeof mockFolders[0], 'id'>;
    const newFolder = {
      ...data,
      id: Math.random().toString(36).substring(2, 15),
    };
    mockFolders.push(newFolder);
    return HttpResponse.json(createResponse(newFolder, '文件夹创建成功'));
  }),
  
  // ===== AI API =====
  
  // 获取 AI 建议
  http.get('/api/ai/suggestions', async () => {
    await delay(800);
    return HttpResponse.json(createResponse(mockAISuggestions));
  }),
  
  // 分析书签
  http.post('/api/ai/analyze', async ({ request }) => {
    await delay(1500);
    const data = await request.json() as { bookmarkId: string; url: string; title: string };
    const analysis = {
      bookmarkId: data.bookmarkId,
      title: data.title,
      category: '前端开发',
      tags: ['AI分析', '自动标签'],
      alias: 'ai-alias',
      summary: `AI 分析结果：这是一个关于 ${data.title} 的链接`,
    };
    return HttpResponse.json(createResponse(analysis));
  }),
  
  // 接受建议
  http.post('/api/ai/suggestions/:id/accept', async ({ params }) => {
    await delay();
    const index = mockAISuggestions.findIndex((s) => s.id === params.id);
    if (index !== -1) {
      mockAISuggestions.splice(index, 1);
    }
    return HttpResponse.json(createResponse(null, '建议已接受'));
  }),
  
  // 拒绝建议
  http.post('/api/ai/suggestions/:id/reject', async ({ params }) => {
    await delay();
    const index = mockAISuggestions.findIndex((s) => s.id === params.id);
    if (index !== -1) {
      mockAISuggestions.splice(index, 1);
    }
    return HttpResponse.json(createResponse(null, '建议已忽略'));
  }),
  
  // 接受所有高置信度建议
  http.post('/api/ai/suggestions/accept-all', async () => {
    await delay();
    const highConfidence = mockAISuggestions.filter((s) => s.confidence === 'high');
    for (let i = mockAISuggestions.length - 1; i >= 0; i--) {
      if (mockAISuggestions[i].confidence === 'high') {
        mockAISuggestions.splice(i, 1);
      }
    }
    return HttpResponse.json(createResponse({ accepted: highConfidence.length }));
  }),
  
  // ===== 统计 API =====
  
  // 获取标签统计
  http.get('/api/analytics/tags', async () => {
    await delay();
    const tagStats = mockBookmarks
      .flatMap((b) => b.tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const stats = Object.entries(tagStats)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / mockBookmarks.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
    
    return HttpResponse.json(createResponse(stats));
  }),
  
  // 获取分类统计
  http.get('/api/analytics/categories', async () => {
    await delay();
    const categoryStats = mockBookmarks.reduce((acc, b) => {
      const cat = b.category || '未分类';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const stats = Object.entries(categoryStats).map(([name, count]) => ({
      name,
      count,
      percentage: ((count / mockBookmarks.length) * 100).toFixed(1),
    }));
    
    return HttpResponse.json(createResponse(stats));
  }),
  
  // ===== 质量检查 API =====
  
  // 获取重复书签
  http.get('/api/quality/duplicates', async () => {
    await delay();
    const urlMap = mockBookmarks.reduce((acc, b) => {
      if (!acc[b.url]) acc[b.url] = [];
      acc[b.url].push(b);
      return acc;
    }, {} as Record<string, typeof mockBookmarks>);
    
    const duplicates = Object.entries(urlMap)
      .filter(([_, items]) => items.length > 1)
      .map(([url, items]) => ({
        url,
        bookmarks: items.map((b) => ({
          id: b.id,
          title: b.title,
          category: b.category || '未分类',
          addedDate: b.addedDate,
          tags: b.tags,
        })),
      }));
    
    return HttpResponse.json(createResponse(duplicates));
  }),
  
  // 获取失效链接
  http.get('/api/quality/dead-links', async () => {
    await delay();
    const deadLinks = mockBookmarks
      .filter((b) => b.isDead)
      .map((b) => ({
        id: b.id,
        title: b.title,
        url: b.url,
        lastChecked: new Date(),
        statusCode: 404,
      }));
    return HttpResponse.json(createResponse(deadLinks));
  }),
  
  // 获取质量报告
  http.get('/api/quality/report', async () => {
    await delay();
    const deadLinks = mockBookmarks.filter((b) => b.isDead).length;
    const duplicateCount = 1; // 简化计算
    const report = {
      totalBookmarks: mockBookmarks.length,
      duplicateCount,
      duplicateGroups: 1,
      deadLinkCount: deadLinks,
      duplicateRate: ((duplicateCount / mockBookmarks.length) * 100).toFixed(1),
      deadLinkRate: ((deadLinks / mockBookmarks.length) * 100).toFixed(1),
      healthScore: Math.round(100 - ((duplicateCount + deadLinks) / mockBookmarks.length) * 100),
    };
    return HttpResponse.json(createResponse(report));
  }),
  
  // ===== 同步 API =====
  
  // Chrome 书签同步
  http.post('/api/sync/chrome', async () => {
    await delay(2000);
    return HttpResponse.json(createResponse({ count: 150 }, '同步成功'));
  }),
  
  // ===== 隐私空间 API =====
  
  // 解锁
  http.post('/api/vault/unlock', async ({ request }) => {
    await delay(500);
    const data = await request.json() as { password: string };
    if (data.password === 'demo') {
      return HttpResponse.json(
        createResponse({
          success: true,
          token: 'mock-token',
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        })
      );
    }
    return HttpResponse.json(
      { success: false, message: '密码错误', timestamp: new Date().toISOString() },
      { status: 401 }
    );
  }),
  
  // 获取隐私书签
  http.get('/api/vault/bookmarks', async () => {
    await delay();
    const vaultBookmarks = mockBookmarks.filter((b) => b.isLocked);
    return HttpResponse.json(createResponse(vaultBookmarks));
  }),
];
