/**
 * 标签相关类型定义
 */

/**
 * 标签实体
 */
export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  category?: string;
  usageCount?: number;
  createdAt: string;
}

/**
 * 标签分组
 */
export interface TagGroup {
  category: string;
  tags: Tag[];
}
