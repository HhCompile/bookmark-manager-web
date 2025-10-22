import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Define API response types
interface Bookmark {
  url: string;
  title: string;
  alias?: string;
  tags: string[];
  category?: string;
  isValid: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Tag {
  id: string;
  name: string;
  description?: string;
  category: string;
}

interface Folder {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ValidationTask {
  id: string;
  bookmarkUrl: string;
  round: number;
  method: string;
  result?: boolean;
  details?: string;
  createdAt: string;
  completedAt?: string;
}

interface UploadResponse {
  message: string;
  filename: string;
  file_path: string;
  processed_count: number;
}

interface BatchBookmarkRequest {
  bookmarks: Array<{
    url: string;
    title: string;
    tags?: string[];
    category?: string;
  }>;
}

interface UpdateBookmarkRequest {
  title?: string;
  alias?: string;
  tags?: string[];
  category?: string;
  reprocess?: boolean;
}

interface ValidationStatus {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  bookmark_status: {
    [url: string]: {
      title: string;
      total_rounds: number;
      completed_rounds: number;
      is_valid: boolean;
      tasks: ValidationTask[];
    };
  };
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:9001', // Default backend URL
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // You can add authentication tokens here if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck(): Promise<AxiosResponse<any>> {
    return this.api.get('/health');
  }

  // Upload bookmark file
  async uploadBookmarkFile(file: File): Promise<AxiosResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.api.post('/bookmark/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Add single bookmark
  async addBookmark(bookmark: {
    url: string;
    title: string;
    tags?: string[];
    category?: string;
  }): Promise<AxiosResponse<{ message: string; bookmark: Bookmark }>> {
    return this.api.post('/bookmark', bookmark);
  }

  // Batch add bookmarks
  async addBookmarksBatch(data: BatchBookmarkRequest): Promise<AxiosResponse<{
    message: string;
    bookmarks: Bookmark[];
  }>> {
    return this.api.post('/bookmarks/batch', data);
  }

  // Get all bookmarks
  async getBookmarks(isValid?: boolean): Promise<AxiosResponse<{ bookmarks: Bookmark[] }>> {
    const params = isValid !== undefined ? { is_valid: isValid.toString() } : {};
    return this.api.get('/bookmarks', { params });
  }

  // Get bookmarks by category
  async getBookmarksByCategory(category: string): Promise<AxiosResponse<{ bookmarks: Bookmark[] }>> {
    return this.api.get(`/bookmarks/category/${category}`);
  }

  // Get bookmarks by tag
  async getBookmarksByTag(tag: string): Promise<AxiosResponse<{ bookmarks: Bookmark[] }>> {
    return this.api.get(`/bookmarks/tag/${tag}`);
  }

  // Update bookmark
  async updateBookmark(url: string, data: UpdateBookmarkRequest): Promise<AxiosResponse<{
    message: string;
    bookmark: Bookmark;
  }>> {
    return this.api.put(`/bookmark/${encodeURIComponent(url)}`, data);
  }

  // Delete bookmark
  async deleteBookmark(url: string): Promise<AxiosResponse<{ message: string }>> {
    return this.api.delete(`/bookmark/${encodeURIComponent(url)}`);
  }

  // Start bookmark validation
  async startValidation(): Promise<AxiosResponse<{ 
    message: string; 
    total_tasks: number; 
    completed_tasks: number 
  }>> {
    return this.api.post('/bookmark/validate');
  }

  // Get validation status
  async getValidationStatus(): Promise<AxiosResponse<ValidationStatus>> {
    return this.api.get('/bookmark/validate/status');
  }

  // Get invalid bookmarks
  async getInvalidBookmarks(): Promise<AxiosResponse<{ bookmarks: Bookmark[] }>> {
    return this.api.get('/bookmarks/invalid');
  }

  // Export bookmarks
  async exportBookmarks(): Promise<AxiosResponse<Blob>> {
    return this.api.get('/bookmark/export', {
      responseType: 'blob'
    });
  }

  // Get folder suggestions
  async getFolderSuggestions(): Promise<AxiosResponse<any>> {
    return this.api.get('/bookmark/folder-suggestions');
  }

  // Export bookmarks with folders
  async exportBookmarksWithFolders(folderStructure: any): Promise<AxiosResponse<Blob>> {
    return this.api.post('/bookmark/export-with-folders', { folder_structure: folderStructure }, {
      responseType: 'blob'
    });
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type { 
  Bookmark,
  Tag,
  Folder,
  ValidationTask,
  UploadResponse,
  BatchBookmarkRequest,
  UpdateBookmarkRequest,
  ValidationStatus
};