import { useState } from 'react';
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Database, 
  Download, 
  Upload,
  Trash2,
  Check,
  Moon,
  Sun,
  Monitor,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/services/apiClient';

type Theme = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('system');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const [language, setLanguage] = useState('zh-CN');
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: '账户', icon: User },
    { id: 'appearance', label: '外观', icon: Palette },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'privacy', label: '隐私', icon: Shield },
    { id: 'data', label: '数据', icon: Database },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast.success('主题已更新');
  };

  const handleExportData = async () => {
    try {
      const response = await apiClient.get('/bookmarks/export');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bookmarks-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('数据导出成功');
    } catch (error: any) {
      toast.error('导出失败: ' + error.message);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('确定要清除所有缓存数据吗？此操作不可撤销。')) {
      localStorage.clear();
      sessionStorage.clear();
      toast.success('缓存已清除');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('确定要删除账户吗？此操作不可撤销，所有数据将被永久删除。')) {
      toast.success('账户删除请求已提交');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">设置</h1>
        <p className="text-text-secondary">管理您的账户和偏好设置</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 侧边栏 */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1">
          {/* 账户设置 */}
          {activeTab === 'account' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">账户信息</h2>
              
              {/* 头像 */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                    更换头像
                  </button>
                  <p className="text-sm text-text-tertiary mt-2">
                    支持 JPG、PNG 格式，最大 2MB
                  </p>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    用户名
                  </label>
                  <input
                    type="text"
                    defaultValue="Bookmark User"
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    defaultValue="user@example.com"
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                保存更改
              </button>

              <div className="pt-6 border-t border-border">
                <button className="flex items-center px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </button>
              </div>
            </div>
          )}

          {/* 外观设置 */}
          {activeTab === 'appearance' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">外观</h2>

              {/* 主题选择 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-4">
                  主题模式
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', icon: Sun, label: '亮色' },
                    { value: 'dark', icon: Moon, label: '暗色' },
                    { value: 'system', icon: Monitor, label: '跟随系统' },
                  ].map((option) => {
                    const Icon = option.icon;
                    const isSelected = theme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value as Theme)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <Icon className="w-6 h-6 mx-auto mb-2 text-text-primary" />
                        <span className="block text-sm font-medium text-text-primary">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 语言设置 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  语言
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>
            </div>
          )}

          {/* 通知设置 */}
          {activeTab === 'notifications' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">通知设置</h2>

              <div className="space-y-4">
                {/* 邮件通知 */}
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-text-primary">邮件通知</h3>
                    <p className="text-sm text-text-secondary">
                      接收关于书签更新的邮件提醒
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailNotifications ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 桌面通知 */}
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-text-primary">桌面通知</h3>
                    <p className="text-sm text-text-secondary">
                      在浏览器中显示推送通知
                    </p>
                  </div>
                  <button
                    onClick={() => setDesktopNotifications(!desktopNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      desktopNotifications ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        desktopNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 隐私设置 */}
          {activeTab === 'privacy' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">隐私设置</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-text-primary">公开收藏</h3>
                    <p className="text-sm text-text-secondary">
                      允许其他人查看您的公开收藏
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-text-primary">统计信息</h3>
                    <p className="text-sm text-text-secondary">
                      允许收集使用统计信息以改进服务
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 数据管理 */}
          {activeTab === 'data' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">数据管理</h2>

              {/* 导出数据 */}
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  导出数据
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  导出您的所有书签数据为JSON文件
                </p>
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出书签
                </button>
              </div>

              {/* 导入数据 */}
              <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100">
                <h3 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  导入数据
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  从JSON文件导入书签数据
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  <Upload className="w-4 h-4 mr-2" />
                  选择文件
                </button>
              </div>

              {/* 清除缓存 */}
              <div className="p-4 bg-orange-50/50 rounded-lg border border-orange-100">
                <h3 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  清除缓存
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  清除本地缓存数据，可能需要重新加载
                </p>
                <button
                  onClick={handleClearCache}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  清除缓存
                </button>
              </div>

              {/* 危险区域 */}
              <div className="p-4 bg-red-50/50 rounded-lg border border-red-100">
                <h3 className="font-medium text-red-600 mb-2">危险操作</h3>
                <p className="text-sm text-red-600/80 mb-4">
                  以下操作不可撤销，请谨慎操作
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除账户
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
