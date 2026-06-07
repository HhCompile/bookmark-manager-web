/**
 * 标签类型定义
 * 与后端 API 对齐
 */

// 标签基础类型
export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  parent_id?: string | null;
  is_system: boolean;
  is_ai_generated: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// 标签关系类型
export interface TagRelation {
  source_tag_id: string;
  target_tag_id: string;
  relation_type: 'related' | 'parent' | 'synonym' | 'child';
  weight: number;
}

// 标签建议（用于自动补全）
export interface TagSuggestion {
  id: string;
  name: string;
  color: string;
  usage_count: number;
}

// 标签统计
export interface TagStats {
  total: number;
  system: number;
  ai_generated: number;
  user_created: number;
  total_usage: number;
  synonyms: number;
}

// 带层级结构的标签（树形）
export interface TagWithChildren extends Tag {
  children: TagWithChildren[];
}

// 创建标签请求
export interface CreateTagRequest {
  name: string;
  color?: string;
  description?: string;
  parent_id?: string;
}

// 更新标签请求
export interface UpdateTagRequest {
  name?: string;
  color?: string;
  description?: string;
  parent_id?: string | null;
}

// 标签列表查询参数
export interface TagListParams {
  page?: number;
  limit?: number;
  parent_id?: string;
  search?: string;
  sort_by?: 'usage' | 'name' | 'created';
  include_system?: boolean;
}

// 标签列表响应
export interface TagListResponse {
  tags: Tag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 标签详情（含关联信息）
export interface TagDetail extends Tag {
  bookmark_count: number;
  related_tags: {
    name: string;
    count: number;
    relevance: number;
  }[];
}

// 批量标签操作
export interface BatchTagOperation {
  urls: string[];
  tags_to_add?: string[];
  tags_to_remove?: string[];
}

// AI 标签建议
export interface AITagSuggestion {
  tag: string;
  confidence: number;
  reason: string;
}

// 书签标签元数据
export interface BookmarkTagMetadata {
  confidence: number;
  source: 'manual' | 'ai' | 'imported' | 'auto';
  added_at: string;
}
