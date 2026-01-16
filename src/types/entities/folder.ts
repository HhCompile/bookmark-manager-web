/**
 * 文件夹相关类型定义
 */

/**
 * 文件夹实体
 */
export interface Folder {
  id: string;
  name: string;
  description?: string;
  path: string;
  parentId?: string;
  level?: number;
  sort?: number;
  bookmarkCount?: number;
  children?: Folder[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建文件夹请求DTO
 */
export interface CreateFolderDTO {
  name: string;
  description?: string;
  parentId?: string;
}

/**
 * 更新文件夹请求DTO
 */
export interface UpdateFolderDTO {
  name?: string;
  description?: string;
  parentId?: string;
  sort?: number;
}
