/**
 * 书签编辑弹窗 - 宽屏优化版
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bookmark } from '@/types/bookmark';
import { useUpdateBookmark } from '@/hooks';
import { useBookmarkContext } from '@/contexts/BookmarkContext';
import { toast } from 'sonner';
import { Bookmark as BookmarkIcon, Sparkles, Link2, FolderOpen, Tag, FileText } from 'lucide-react';
interface BookmarkEditDialogProps {
  bookmark: Bookmark | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_ICONS = ['🔖','📚','💻','🌐','📝','📰','🎓','💡','📊','🎨','🎵','🎬','📷','🎮','🛒','💰','📧','📅','📍','⭐','🔍','⚙️','🔐','📂','📈','📋','✅','⚠️'];

const PRESET_CATEGORIES = ['技术','设计','产品','工具','学习','工作','生活','娱乐','新闻','其他'];

export function BookmarkEditDialog({ bookmark, isOpen, onClose }: BookmarkEditDialogProps) {
  const { folders } = useBookmarkContext();
  const updateBookmark = useUpdateBookmark();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [category, setCategory] = useState('');
  const [favicon, setFavicon] = useState('');
  const [notes, setNotes] = useState('');
  const [folderId, setFolderId] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title || '');
      setUrl(bookmark.url || '');
      setAlias(bookmark.alias || bookmark.metadata?.alias || '');
      setCategory(bookmark.category || '');
      setFavicon(bookmark.favicon || '🔖');
      setNotes(bookmark.metadata?.notes || bookmark.summary || '');
      setFolderId(bookmark.metadata?.folder_id || '');
      
      if (bookmark.category && !PRESET_CATEGORIES.includes(bookmark.category)) {
        setIsCustomCategory(true);
        setCustomCategory(bookmark.category);
      } else {
        setIsCustomCategory(false);
        setCustomCategory('');
      }
    }
  }, [bookmark, isOpen]);

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomCategory(true);
      setCategory(customCategory);
    } else if (value === 'none') {
      setIsCustomCategory(false);
      setCategory('');
      setCustomCategory('');
    } else {
      setIsCustomCategory(false);
      setCategory(value);
      setCustomCategory('');
    }
  };

  const handleSubmit = async () => {
    if (!bookmark?.url) { toast.error('书签URL不存在'); return; }
    if (!title.trim()) { toast.error('请输入标题'); return; }
    if (!url.trim()) { toast.error('请输入链接'); return; }

    try {
      await updateBookmark.mutateAsync({
        id: bookmark.url,
        data: {
          title: title.trim(),
          url: url.trim(),
          alias: alias.trim() || undefined,
          category: category.trim() || undefined,
          summary: notes.trim() || undefined,
          metadata: {
            url_hash: bookmark.metadata?.url_hash || '',
            ...bookmark.metadata,
            alias: alias.trim() || undefined,
            notes: notes.trim() || undefined,
            folder_id: folderId || undefined,
          },
        },
      });
      toast.success('书签更新成功');
      onClose();
    } catch {
      toast.error('更新失败');
    }
  };

  const currentFolder = folderId ? folders.find((f) => f.id === folderId) : null;

  if (!bookmark) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50/50">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookmarkIcon className="w-5 h-5 text-blue-600" />
            编辑书签
            <span className="text-sm font-normal text-gray-400 ml-2">
              {bookmark.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* 第一行：图标 + 标题 + 别名 */}
          <div className="flex gap-4 items-start">
            {/* 图标 */}
            <div className="w-14 flex-shrink-0">
              <Label className="text-xs text-gray-500 mb-1.5 block">图标</Label>
              <Select value={favicon} onValueChange={setFavicon}>
                <SelectTrigger className="h-11 text-2xl px-2 justify-center">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <div className="grid grid-cols-7 gap-1 p-2">
                    {PRESET_ICONS.map((icon) => (
                      <SelectItem key={icon} value={icon} className="justify-center text-xl h-9 w-9 p-0">
                        {icon}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* 标题 */}
            <div className="flex-1">
              <Label className="text-xs text-gray-500 mb-1.5 block">
                标题 <span className="text-red-500">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="书签标题"
                className="h-11"
              />
            </div>

            {/* 别名 */}
            <div className="w-40 flex-shrink-0">
              <Label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                别名
              </Label>
              <Input
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="如：git"
                className="h-11"
              />
            </div>
          </div>

          {/* 第二行：分类 + 文件夹 */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                分类
              </Label>
              <Select value={isCustomCategory ? 'custom' : (category || 'none')} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未分类</SelectItem>
                  {PRESET_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="custom">自定义...</SelectItem>
                </SelectContent>
              </Select>
              {isCustomCategory && (
                <Input
                  value={customCategory}
                  onChange={(e) => { setCustomCategory(e.target.value); setCategory(e.target.value); }}
                  placeholder="输入自定义分类"
                  className="h-9 mt-2"
                />
              )}
            </div>

            <div className="w-1/2">
              <Label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                <FolderOpen className="w-3 h-3" />
                归属文件夹
              </Label>
              <Select value={folderId || 'none'} onValueChange={(val) => setFolderId(val === 'none' ? '' : val)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="选择文件夹" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无文件夹</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 链接 */}
          <div>
            <Label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              链接 <span className="text-red-500">*</span>
            </Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="h-11"
            />
          </div>

          {/* 备注 */}
          <div>
            <Label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              用途/备注
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="记录这个书签的用途、使用场景等..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 预览卡片 */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-2">预览效果</p>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{favicon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-gray-900 truncate">
                    {title || '未命名书签'}
                  </p>
                  {alias && (
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                      {alias}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">{url || 'https://...'}</p>
                <div className="flex items-center gap-2 mt-2">
                  {category && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {category}
                    </span>
                  )}
                  {currentFolder && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      {currentFolder.name}
                    </span>
                  )}
                  {notes && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                      有备注
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50/50 gap-3">
          <Button variant="outline" onClick={onClose} className="px-6">取消</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={updateBookmark.isPending} 
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            {updateBookmark.isPending ? '保存中...' : '保存修改'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BookmarkEditDialog;
