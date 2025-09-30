// 导入路由相关组件
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 导入全局样式
import './App.css';

// 导入页面组件
import UploadPage from './pages/UploadPage';
import BookmarkList from './pages/BookmarkList';
import DuplicateCheck from './pages/DuplicateCheck';

// 导入公共组件
import Header from './components/Header';
import Footer from './components/Footer';

/**
 * 应用根组件
 * 包含路由配置和整体布局结构
 */
function App() {
  return (
    // 路由器组件，用于包裹整个应用以启用路由功能
    <Router>
      <div className="App">
        {/* 页头组件 */}
        <Header />
        
        {/* 路由配置 */}
        <Routes>
          {/* 首页 - 文件上传页面 */}
          <Route path="/" element={<UploadPage />} />
          {/* 书签列表页面 */}
          <Route path="/bookmarks" element={<BookmarkList />} />
          {/* 重复书签检查页面 */}
          <Route path="/duplicates" element={<DuplicateCheck />} />
        </Routes>
        
        {/* 页脚组件 */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
