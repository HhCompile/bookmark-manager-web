/**
 * 中文翻译文件
 */

export default {
  // 通用
  common: {
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    confirm: '确认',
    close: '关闭',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    actions: '操作',
    noData: '暂无数据',
    more: '更多',
    less: '收起',
    all: '全部',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',
  },
  
  // 导航
  nav: {
    home: '首页',
    bookmarks: '书签管理',
    analytics: '数据分析',
    quality: '质量监控',
    private: '隐私空间',
    backToHome: '返回首页',
  },
  
  // 头部
  header: {
    title: '智能书签管理',
    searchPlaceholder: '搜索书签内容、标题、标签...',
    importHtml: '导入 HTML',
    chromeSync: 'Chrome 同步',
    aiOptimize: 'AI 优化',
    taskManager: '任务管理',
  },
  
  // 首页
  home: {
    hero: {
      badge: 'AI 驱动的智能书签管理',
      title: '智能书签管理系统',
      subtitle: '让 AI 帮你智能整理、精准分类、深度优化每一个收藏',
      subtitle2: '打造属于你的个性化知识图谱，让信息触手可及',
    },
    stats: {
      totalOrganizations: '总整理次数',
      weeklyUsers: '本周整理人数',
      aiClassifications: 'AI 智能分类次数',
      avgPerUser: '人均分类次数',
    times: '次',
    },
    quickStart: {
      title: '快速开始',
      features: {
        sync: {
          title: 'Chrome 同步',
          desc: '实时同步浏览器书签，支持双向数据同步',
        },
        upload: {
          title: 'HTML 导入',
          desc: '支持从浏览器导出的 HTML 文件快速导入',
        },
        ai: {
          title: 'AI 智能优化',
          desc: '自动分类、生成别名、提取标签',
        },
        bookmarks: {
          title: '书签管理',
          desc: '三种视图模式、全文搜索、批注高亮',
        },
        analytics: {
          title: '数据分析',
          desc: '可视化标签云、分类统计、使用洞察',
        },
        quality: {
          title: '质量监控',
          desc: '检测重复链接、失效书签、健康度评分',
        },
        private: {
          title: '隐私空间',
          desc: '加密保护敏感书签，安全存储学习笔记',
        },
      },
    },
    detailedFeatures: {
      title: '功能详解',
      subtitle: '全面的书签管理解决方案，从导入到优化，从搜索到分析，一站式解决你的知识管理需求',
      items: {
        sync: {
          title: '双路同步机制',
          desc: 'Chrome API 直连同步与 HTML 文件导入双通道，灵活应对各种场景',
          features: ['实时浏览器同步', 'HTML 批量导入', '增量更新支持', '冲突智能处理'],
        },
        ai: {
          title: 'AI 智能分类',
          desc: '基于内容理解的智能分类系统，自动为书签打标签和分组',
          features: ['内容智能分析', '自动标签提取', '别名生成', '红绿灯决策系统'],
        },
        views: {
          title: '三种视觉视图',
          desc: '列表、卡片、树状三种视图模式，适配不同使用场景',
          features: ['列表视图', '卡片视图', '树状层级视图', '自由切换'],
        },
        search: {
          title: '全文搜索',
          desc: '强大的搜索引擎，支持标题、URL、标签、批注内容全文搜索',
          features: ['标题搜索', 'URL 检索', '标签筛选', '批注内容搜索'],
        },
        reader: {
          title: '阅读器与批注',
          desc: '侧边栏阅读模式，支持文本高亮、批注、笔记功能',
          features: ['侧边栏阅读', '文本高亮', '添加批注', '导出笔记'],
        },
        quality: {
          title: '质量监控',
          desc: '自动化质量检测，保持书签库健康度',
          features: ['重复检测', '失效链接巡检', '健康度评分', '定期报告'],
        },
        privacy: {
          title: '隐私加密',
          desc: '独立加密空间，保护敏感信息和学习资料',
          features: ['端到端加密', '密码保护', '隐私标签', '安全备份'],
        },
        analytics: {
          title: '数据可视化',
          desc: '标签云、使用统计、趋势分析，洞察你的知识结构',
          features: ['标签云可视化', '分类统计', '使用趋势', '热力图分析'],
        },
      },
    },
    moreFeatures: {
      title: '更多功能',
    },
    aiDemo: {
      title: 'AI 智能优化演示',
      description: '体验 AI 如何自动分析、分类和优化你的书签',
      tryNow: '立即体验',
      compare: '对比传统方式',
    },
    usageTips: {
      title: '使用提示',
      tips: [
        { title: '快捷导入', desc: '支持 Chrome、Edge、Firefox 书签一键同步' },
        { title: 'AI 助手', desc: '上传书签后，AI 会自动分析并给出优化建议' },
        { title: '隐私保护', desc: '私密书签使用 AES-256 加密，安全可靠' },
      ],
    },
  },
  
  // 侧边栏
  sidebar: {
    folders: '书签分组',
    allBookmarks: '全部书签',
    tagCloud: '标签云',
  },
  
  // 书签管理
  bookmarks: {
    title: '全部书签',
    folderTitle: '{{folder}}',
    count: '({{count}})',
    views: {
      list: '列表视图',
      card: '卡片视图',
      tree: '树状视图',
    },
    columns: {
      bookmark: '书签',
      category: '分类',
      tags: '标签',
      date: '添加日期',
      actions: '操作',
    },
    noBookmarks: '暂无书签',
    quickOpen: '快速打开',
    alias: '别名',
    uncategorized: '未分类',
    moreTags: '+{{count}}',
  },
  
  // AI 优化面板
  ai: {
    title: 'AI 优化建议',
    subtitle: '发现 {{count}} 个优化建议，已接受 {{accepted}} 个',
    acceptAll: '一键采用全部高置信度建议',
    confidence: {
      high: '高置信度',
      medium: '需确认',
      low: '低置信度',
    },
    accept: '接受',
    reject: '忽略',
    done: '全部处理完成！',
    doneSubtitle: '您已处理所有 AI 建议',
    pending: '还有 {{count}} 个建议待处理',
    later: '稍后处理',
    fields: {
      category: '分类',
      alias: '别名',
      tags: '标签',
    },
    recommendation: '推荐采用',
  },
  
  // 质量监控
  quality: {
    duplicateDetection: {
      title: '重复书签检测',
      count: '发现 {{count}} 组重复',
      noDuplicates: '没有发现重复的书签',
      duplicateUrl: '重复 URL',
      merge: '合并标签与批注',
      mergeTip: '建议：保留最新的书签，合并所有标签和批注',
    },
    deadLinks: {
      title: '失效链接',
      count: '{{count}} 个失效',
      noDeadLinks: '所有书签链接正常',
      waybackMachine: '时光机',
    },
    stats: {
      duplicateRate: '重复率',
      deadRate: '失效率',
      healthScore: '健康度',
    },
  },
  
  // 数据分析
  analytics: {
    categoryDistribution: '书签分类分布',
    popularTags: '热门标签',
    summary: {
      totalBookmarks: '总书签数',
      totalCategories: '总分类数',
      totalTags: '总标签数',
    },
  },
  
  // 隐私空间
  vault: {
    title: '私密学习库',
    locked: {
      subtitle: '此分组已加密保护',
      description: '请输入密码以查看内容',
      passwordPlaceholder: '输入密码',
      unlock: '解锁访问',
      hint: '密码错误，请重试（提示：输入 "demo"）',
    },
    unlocked: {
      subtitle: '已解锁，内容可见',
      lock: '锁定',
      encryptionStatus: '加密状态',
      features: [
        '内容已使用 AES-256 加密',
        '密码保存在本地浏览器',
        '关闭窗口自动锁定',
      ],
    },
    securityTips: {
      title: '安全提示',
      tips: [
        '支持指纹/Face ID 生物识别',
        '内容在数据库中加密存储',
        '离开页面自动锁定保护',
      ],
    },
  },
  
  // 同步进度
  sync: {
    title: 'Chrome 书签同步',
    complete: '同步完成',
    success: '成功同步 {{count}} 个书签',
    progress: '{{percent}}% 完成',
    steps: {
      connecting: '正在连接 Chrome...',
      fetching: '正在抓取书签 ({{current}}/{{total}})...',
      preprocessing: 'AI 预处理中...',
      complete: '同步完成！',
    },
  },
  
  // 任务管理
  tasks: {
    title: '任务管理面板',
    subtitle: '管理当前项目的所有任务，查看执行进度和状态',
    autoRefresh: '自动刷新',
    summary: {
      total: '总任务数',
      inProgress: '进行中',
      completed: '已完成',
      pending: '待处理',
    },
    status: {
      pending: '待处理',
      in_progress: '进行中',
      completed: '已完成',
      failed: '失败',
    },
    priority: {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级',
    },
    source: {
      user: '用户',
      system: '系统',
      ai: 'AI',
    },
    progress: '执行进度',
    noTasks: '无任务',
    noTasksDesc: '当前项目没有任务需要执行',
    actions: {
      start: '开始',
      pause: '暂停',
      skip: '跳过',
      retry: '重试',
    },
    created: '创建',
    started: '开始',
    completed: '完成',
  },
  
  // 阅读器
  reader: {
    highlight: '高亮选中文本',
    annotate: '添加批注',
    selectedText: '已选中文本',
    highlights: '高亮',
    annotations: '批注',
    notePlaceholder: '输入你的批注...',
    save: '保存',
  },
  
  // AI 演示
  aiDemo: {
    title: 'AI 优化演示',
    subtitle: '了解 AI 如何帮您智能整理书签',
    steps: {
      import: {
        title: '步骤 1：导入书签',
        desc: '通过 Chrome、Edge、Firefox 等浏览器同步或导入 HTML 文件获取书签数据',
      },
      analysis: {
        title: '步骤 2：AI 智能分析',
        desc: 'AI 读取书签标题、URL、内容，理解其主题和分类',
      },
      suggestions: {
        title: '步骤 3：生成优化建议',
        desc: 'AI 为每个书签生成分类、别名、标签建议，并标注置信度',
      },
      confirm: {
        title: '步骤 4：用户确认与应用',
        desc: '您可以逐个确认或一键接受高置信度建议，完成书签优化',
      },
    },
    buttons: {
      prev: '上一步',
      next: '下一步',
      start: '开始使用',
    },
  },
};
