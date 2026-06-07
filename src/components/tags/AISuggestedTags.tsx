/**
 * AI 推荐标签组件
 * 展示 AI 分析后推荐的标签，支持一键添加
 */

import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { useAITagSuggestionsMutation } from '@/api/tags';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button';

interface AISuggestedTagsProps {
  /** 书签 URL */
  url: string;
  /** 书签标题 */
  title: string;
  /** 当前已有标签 */
  currentTags: string[];
  /** 添加标签回调 */
  onAddTag: (tag: string) => void;
  /** 自定义类名 */
  className?: string;
}

export function AISuggestedTags({
  url,
  title,
  currentTags,
  onAddTag,
  className,
}: AISuggestedTagsProps) {
  const suggestMutation = useAITagSuggestionsMutation();

  // 获取建议
  const fetchSuggestions = () => {
    if (!url || !title) return;
    suggestMutation.mutate({ url, title });
  };

  // 过滤掉已存在的标签
  const suggestions =
    suggestMutation.data?.suggestions.filter(
      (s) => !currentTags.includes(s.tag.toLowerCase())
    ) || [];

  // 置信度颜色映射
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#10B981'; // 绿色 - 高置信度
    if (confidence >= 0.7) return '#F59E0B'; // 橙色 - 中等置信度
    return '#6B7280'; // 灰色 - 低置信度
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>AI 智能推荐</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchSuggestions}
          disabled={suggestMutation.isPending || !url}
          className="h-8 px-2"
        >
          <RefreshCw
            className={cn(
              'w-4 h-4 mr-1',
              suggestMutation.isPending && 'animate-spin'
            )}
          />
          {suggestMutation.isPending ? '分析中...' : '获取建议'}
        </Button>
      </div>

      {/* 建议标签列表 */}
      {suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.tag}
              onClick={() => onAddTag(suggestion.tag)}
              className={cn(
                'group flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                'border-2 border-dashed transition-all hover:border-solid',
                'hover:bg-gray-50'
              )}
              style={{
                borderColor: getConfidenceColor(suggestion.confidence),
              }}
              title={suggestion.reason}
            >
              <span
                className="text-sm font-medium"
                style={{ color: getConfidenceColor(suggestion.confidence) }}
              >
                {suggestion.tag}
              </span>
              <span className="text-xs text-gray-400">
                {Math.round(suggestion.confidence * 100)}%
              </span>
              <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
            </button>
          ))}
        </div>
      ) : suggestMutation.isPending ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          正在分析内容...
        </div>
      ) : suggestMutation.isError ? (
        <div className="text-sm text-red-500 py-2">
          获取建议失败，请重试
        </div>
      ) : suggestions.length === 0 && suggestMutation.isSuccess ? (
        <div className="text-sm text-gray-400 py-2">
          暂无推荐标签
        </div>
      ) : null}

      {/* 置信度说明 */}
      {suggestions.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>高置信度 (90%+)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>中等置信度 (70-90%)</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AISuggestedTags;
