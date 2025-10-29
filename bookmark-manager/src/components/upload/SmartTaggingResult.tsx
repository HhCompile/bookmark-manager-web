import { useState } from 'react';
import { Tag, Folder, CheckCircle, AlertCircle } from 'lucide-react';

interface SmartTaggingResultProps {
  taggingResult: {
    totalBookmarks: number;
    taggedBookmarks: number;
    categories: Array<{
      name: string;
      count: number;
    }>;
    tags: Array<{
      name: string;
      count: number;
    }>;
  } | null;
}

/**
 * 智能标记结果展示组件
 * 显示上传文件后系统自动为书签添加的标签和分类信息
 * 
 * @param props - 组件属性
 */
export default function SmartTaggingResult({ taggingResult }: SmartTaggingResultProps) {
  // 如果没有标记结果，不渲染任何内容
  if (!taggingResult) {
    return null;
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">智能标记结果</h3>
        
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <div className="flex">
            <CheckCircle className="flex-shrink-0 w-5 h-5 text-primary mt-0.5" />
            <div className="ml-4">
              <h4 className="text-base font-medium text-primary">标记完成</h4>
              <div className="mt-3 text-sm text-text-secondary space-y-2">
                <p>系统已为 <span className="font-medium text-text-primary">{taggingResult.taggedBookmarks}</span> 个书签添加了智能标签</p>
                <p>共处理 <span className="font-medium text-text-primary">{taggingResult.totalBookmarks}</span> 个书签</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 分类统计 */}
        <div className="mt-6">
          <h4 className="text-base font-medium text-text-primary mb-3 flex items-center">
            <Folder className="w-4 h-4 text-primary mr-2" />
            分类统计
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {taggingResult.categories.map((category, index) => (
              <div key={index} className="bg-gray-50/50 rounded-lg p-3 border border-border">
                <p className="text-sm font-medium text-text-primary truncate">{category.name}</p>
                <p className="text-xs text-text-secondary mt-1">{category.count} 个书签</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* 标签云 */}
        <div className="mt-6">
          <h4 className="text-base font-medium text-text-primary mb-3 flex items-center">
            <Tag className="w-4 h-4 text-primary mr-2" />
            标签云
          </h4>
          <div className="flex flex-wrap gap-2">
            {taggingResult.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {tag.name} <span className="ml-1 text-primary/70">{tag.count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}