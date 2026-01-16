/**
 * 工具索引文件
 * 导出所有工具实例
 */

import { bookmarkValidator } from './bookmarkValidator';
import { bookmarkImporter } from './bookmarkImporter';
import { aiOptimizer } from './aiOptimizer';
import { duplicateDetector } from './duplicateDetector';
import { folderOrganizer } from './folderOrganizer';
import { Tool } from '../toolManager';

// 导出所有工具
export const tools: Tool[] = [
  bookmarkValidator,
  bookmarkImporter,
  aiOptimizer,
  duplicateDetector,
  folderOrganizer,
];

// 导出单个工具
export {
  bookmarkValidator,
  bookmarkImporter,
  aiOptimizer,
  duplicateDetector,
  folderOrganizer,
};
