/**
 * 用户菜单组件
 * 显示在 Header 中，包含用户信息和操作
 */

import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/login')}
          className="text-gray-600 hover:text-gray-900"
        >
          登录
        </Button>
        <Button
          size="sm"
          onClick={() => navigate('/register')}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          注册
        </Button>
      </div>
    );
  }

  // 获取用户姓名首字母
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-gray-100">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-violet-100 text-violet-700 text-sm">
              {user?.name ? getInitials(user.name) : '?'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[120px] truncate">
            {user?.name}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/app/bookmarks')}>
            <Bookmark className="mr-2 h-4 w-4" />
            我的书签
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/app/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            设置
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
