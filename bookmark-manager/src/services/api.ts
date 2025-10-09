import axios from 'axios';

// 创建Axios实例
const apiClient = axios.create({
  // 设置基础URL，使用代理路径
  baseURL: '/api',
  // 设置请求超时时间
  timeout: 10000,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 可以在这里添加认证token等
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response;
  },
  (error) => {
    // 对响应错误做些什么
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在2xx范围内
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('Network Error:', error.request);
    } else {
      // 发生了一些问题，触发了错误
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API端点函数封装
export const api = {
  // 健康检查接口
  healthCheck: () => apiClient.get('/health'),

  // 上传书签文件
  uploadBookmarkFile: (formData) => apiClient.post('/bookmark/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // 添加单个书签
  addBookmark: (bookmarkData) => apiClient.post('/bookmark', bookmarkData),

  // 批量添加书签
  addBookmarksBatch: (bookmarksData) => apiClient.post('/bookmarks/batch', bookmarksData),

  // 获取所有书签
  getAllBookmarks: () => apiClient.get('/bookmarks'),

  // 根据分类获取书签
  getBookmarksByCategory: (category) => apiClient.get(`/bookmarks/category/${category}`),

  // 根据标签获取书签
  getBookmarksByTag: (tag) => apiClient.get(`/bookmarks/tag/${tag}`),

  // 删除书签
  deleteBookmark: (url) => apiClient.delete(`/bookmark/${url}`),

  // 更新书签
  updateBookmark: (url, bookmarkData) => apiClient.put(`/bookmark/${url}`, bookmarkData),
};

export default apiClient;