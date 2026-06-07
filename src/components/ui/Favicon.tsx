/**
 * 网站图标组件
 * 从多个源获取网站 favicon
 */

import { useState, useCallback, useEffect } from 'react';
import { Globe } from 'lucide-react';

interface FaviconProps {
  url: string;
  size?: number;
  className?: string;
}

// 生成 favicon URL 的多个源
const getFaviconUrls = (url: string): string[] => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    return [
      // Google Favicon 服务
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      // DuckDuckGo Favicon 服务
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      // 直接获取网站 favicon
      `${urlObj.protocol}//${domain}/favicon.ico`,
      // 备用：直接请求根路径
      `${urlObj.protocol}//${domain}`,
    ];
  } catch {
    return [];
  }
};

// 获取域名首字母作为备选
const getInitial = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.charAt(0).toUpperCase();
  } catch {
    return '?';
  }
};

// 域名颜色映射
const getDomainColor = (url: string): string => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-orange-500 to-orange-600',
    'from-cyan-500 to-cyan-600',
  ];
  
  try {
    const urlObj = new URL(url);
    const hash = urlObj.hostname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  } catch {
    return colors[0];
  }
};

export default function Favicon({ url, size = 32, className = '' }: FaviconProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const faviconUrls = getFaviconUrls(url);
  const currentUrl = faviconUrls[currentIndex];
  
  const handleError = useCallback(() => {
    if (currentIndex < faviconUrls.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  }, [currentIndex, faviconUrls.length]);
  
  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);
  
  // 重置状态当 URL 变化时
  useEffect(() => {
    setCurrentIndex(0);
    setHasError(false);
    setLoaded(false);
  }, [url]);
  
  // 如果所有源都失败，显示首字母图标
  if (hasError || faviconUrls.length === 0) {
    const initial = getInitial(url);
    const gradient = getDomainColor(url);
    
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
        title={url}
      >
        {initial}
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* 加载占位 */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
          <Globe className="text-gray-300" style={{ width: size * 0.6, height: size * 0.6 }} />
        </div>
      )}
      
      {/* 图标图片 */}
      <img
        src={currentUrl}
        alt=""
        className={`w-full h-full object-contain rounded-lg transition-opacity duration-200 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        style={{ width: size, height: size }}
      />
    </div>
  );
}

// 小型图标版本（用于列表）
export function FaviconSmall({ url, size = 20 }: Omit<FaviconProps, 'className'>) {
  return <Favicon url={url} size={size} className="flex-shrink-0" />;
}

// 大型图标版本（用于卡片）
export function FaviconLarge({ url, size = 64 }: Omit<FaviconProps, 'className'>) {
  return <Favicon url={url} size={size} className="flex-shrink-0" />;
}
