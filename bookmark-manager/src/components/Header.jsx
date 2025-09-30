// 页头组件 - 显示应用标题和导航
export default function Header() {
  return (
    // 页头容器，使用白色背景和阴影效果
    <header className="bg-white shadow">
      {/* 内容容器，限制最大宽度并添加内边距 */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* 应用标题，使用大号字体和粗体 */}
        <h1 className="text-3xl font-bold text-gray-900">书签管理器</h1>
      </div>
    </header>
  );
}