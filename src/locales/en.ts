/**
 * English Translation File
 */

export default {
  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    confirm: 'Confirm',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    actions: 'Actions',
    noData: 'No data',
    more: 'More',
    less: 'Less',
    all: 'All',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  },
  
  // Navigation
  nav: {
    home: 'Home',
    bookmarks: 'Bookmarks',
    analytics: 'Analytics',
    quality: 'Quality',
    private: 'Private Vault',
    backToHome: 'Back to Home',
  },
  
  // Header
  header: {
    title: 'Smart Bookmark Manager',
    searchPlaceholder: 'Search bookmarks, titles, tags...',
    importHtml: 'Import HTML',
    chromeSync: 'Chrome Sync',
    aiOptimize: 'AI Optimize',
    taskManager: 'Tasks',
  },
  
  // Home
  home: {
    hero: {
      badge: 'AI-Powered Smart Bookmark Management',
      title: 'Smart Bookmark Management System',
      subtitle: 'Let AI intelligently organize, accurately classify, and deeply optimize every collection',
      subtitle2: 'Build your personalized knowledge graph, make information accessible',
    },
    stats: {
      totalOrganizations: 'Total Organizations',
      weeklyUsers: 'Weekly Users',
      aiClassifications: 'AI Classifications',
      avgPerUser: 'Avg Per User',
    times: 'times',
    },
    quickStart: {
      title: 'Quick Start',
      features: {
        sync: {
          title: 'Chrome Sync',
          desc: 'Real-time sync with browser bookmarks, supporting bidirectional data sync',
        },
        upload: {
          title: 'HTML Import',
          desc: 'Quick import from browser-exported HTML bookmark files',
        },
        ai: {
          title: 'AI Smart Optimize',
          desc: 'Auto-classify, generate aliases, extract tags',
        },
        bookmarks: {
          title: 'Bookmark Manager',
          desc: 'Three view modes, full-text search, annotations',
        },
        analytics: {
          title: 'Analytics',
          desc: 'Visual tag cloud, category stats, usage insights',
        },
        quality: {
          title: 'Quality Monitor',
          desc: 'Detect duplicate links, dead bookmarks, health score',
        },
        private: {
          title: 'Private Vault',
          desc: 'Encrypt sensitive bookmarks, secure storage for notes',
        },
      },
    },
    detailedFeatures: {
      title: 'Features',
      subtitle: 'Comprehensive bookmark management solution from import to optimization, search to analysis',
      items: {
        sync: {
          title: 'Dual Sync Mechanism',
          desc: 'Chrome API direct sync and HTML file import dual channels',
          features: ['Real-time browser sync', 'HTML batch import', 'Incremental updates', 'Smart conflict resolution'],
        },
        ai: {
          title: 'AI Smart Classification',
          desc: 'Content-based intelligent classification system',
          features: ['Content analysis', 'Auto tag extraction', 'Alias generation', 'Traffic light decision system'],
        },
        views: {
          title: 'Three Visual Views',
          desc: 'List, card, and tree view modes for different scenarios',
          features: ['List view', 'Card view', 'Tree view', 'Free switching'],
        },
        search: {
          title: 'Full-text Search',
          desc: 'Powerful search engine supporting title, URL, tags, annotations',
          features: ['Title search', 'URL search', 'Tag filter', 'Annotation search'],
        },
        reader: {
          title: 'Reader & Annotations',
          desc: 'Sidebar reading mode with text highlighting and notes',
          features: ['Sidebar reading', 'Text highlighting', 'Add annotations', 'Export notes'],
        },
        quality: {
          title: 'Quality Monitor',
          desc: 'Automated quality checks to maintain bookmark library health',
          features: ['Duplicate detection', 'Dead link checking', 'Health score', 'Regular reports'],
        },
        privacy: {
          title: 'Privacy Encryption',
          desc: 'Independent encrypted space for sensitive information',
          features: ['End-to-end encryption', 'Password protection', 'Privacy tags', 'Secure backup'],
        },
        analytics: {
          title: 'Data Visualization',
          desc: 'Tag cloud, usage stats, trend analysis for knowledge insights',
          features: ['Tag cloud visualization', 'Category statistics', 'Usage trends', 'Heatmap analysis'],
        },
      },
    },
    moreFeatures: {
      title: 'More Features',
    },
    aiDemo: {
      title: 'AI Smart Optimization Demo',
      description: 'Experience how AI automatically analyzes, classifies, and optimizes your bookmarks',
      tryNow: 'Try Now',
      compare: 'Compare Traditional',
    },
    usageTips: {
      title: 'Usage Tips',
      tips: [
        { title: 'Quick Import', desc: 'Support Chrome, Edge, Firefox bookmark one-click sync' },
        { title: 'AI Assistant', desc: 'AI automatically analyzes and gives optimization suggestions after upload' },
        { title: 'Privacy Protection', desc: 'Private bookmarks use AES-256 encryption, safe and reliable' },
      ],
    },
  },
  
  // Sidebar
  sidebar: {
    folders: 'Folders',
    allBookmarks: 'All Bookmarks',
    tagCloud: 'Tag Cloud',
  },
  
  // Bookmarks
  bookmarks: {
    title: 'All Bookmarks',
    folderTitle: '{{folder}}',
    count: '({{count}})',
    views: {
      list: 'List View',
      card: 'Card View',
      tree: 'Tree View',
    },
    columns: {
      bookmark: 'Bookmark',
      category: 'Category',
      tags: 'Tags',
      date: 'Date Added',
      actions: 'Actions',
    },
    noBookmarks: 'No bookmarks',
    quickOpen: 'Quick Open',
    alias: 'Alias',
    uncategorized: 'Uncategorized',
    moreTags: '+{{count}}',
  },
  
  // AI Panel
  ai: {
    title: 'AI Optimization Suggestions',
    subtitle: 'Found {{count}} suggestions, accepted {{accepted}}',
    acceptAll: 'Accept all high confidence suggestions',
    confidence: {
      high: 'High Confidence',
      medium: 'Need Confirmation',
      low: 'Low Confidence',
    },
    accept: 'Accept',
    reject: 'Ignore',
    done: 'All processed!',
    doneSubtitle: 'You have processed all AI suggestions',
    pending: '{{count}} suggestions pending',
    later: 'Later',
    fields: {
      category: 'Category',
      alias: 'Alias',
      tags: 'Tags',
    },
    recommendation: 'Recommended',
  },
  
  // Quality
  quality: {
    duplicateDetection: {
      title: 'Duplicate Detection',
      count: 'Found {{count}} duplicates',
      noDuplicates: 'No duplicate bookmarks found',
      duplicateUrl: 'Duplicate URL',
      merge: 'Merge Tags & Notes',
      mergeTip: 'Recommendation: Keep newest bookmark, merge all tags and notes',
    },
    deadLinks: {
      title: 'Dead Links',
      count: '{{count}} dead',
      noDeadLinks: 'All bookmark links are healthy',
      waybackMachine: 'Wayback Machine',
    },
    stats: {
      duplicateRate: 'Duplicate Rate',
      deadRate: 'Dead Rate',
      healthScore: 'Health Score',
    },
  },
  
  // Analytics
  analytics: {
    categoryDistribution: 'Bookmark Category Distribution',
    popularTags: 'Popular Tags',
    summary: {
      totalBookmarks: 'Total Bookmarks',
      totalCategories: 'Total Categories',
      totalTags: 'Total Tags',
    },
  },
  
  // Private Vault
  vault: {
    title: 'Private Vault',
    locked: {
      subtitle: 'This group is encrypted',
      description: 'Please enter password to view content',
      passwordPlaceholder: 'Enter password',
      unlock: 'Unlock',
      hint: 'Wrong password, try again (hint: enter "demo")',
    },
    unlocked: {
      subtitle: 'Unlocked, content visible',
      lock: 'Lock',
      encryptionStatus: 'Encryption Status',
      features: [
        'Content encrypted with AES-256',
        'Password stored locally in browser',
        'Auto-lock when window closes',
      ],
    },
    securityTips: {
      title: 'Security Tips',
      tips: [
        'Support fingerprint/Face ID biometric authentication',
        'Content encrypted in database',
        'Auto-lock when leaving page',
      ],
    },
  },
  
  // Sync
  sync: {
    title: 'Chrome Bookmark Sync',
    complete: 'Sync Complete',
    success: 'Successfully synced {{count}} bookmarks',
    progress: '{{percent}}% complete',
    steps: {
      connecting: 'Connecting to Chrome...',
      fetching: 'Fetching bookmarks ({{current}}/{{total}})...',
      preprocessing: 'AI preprocessing...',
      complete: 'Sync complete!',
    },
  },
  
  // Tasks
  tasks: {
    title: 'Task Manager',
    subtitle: 'Manage all project tasks, view progress and status',
    autoRefresh: 'Auto Refresh',
    summary: {
      total: 'Total Tasks',
      inProgress: 'In Progress',
      completed: 'Completed',
      pending: 'Pending',
    },
    status: {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      failed: 'Failed',
    },
    priority: {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority',
    },
    source: {
      user: 'User',
      system: 'System',
      ai: 'AI',
    },
    progress: 'Progress',
    noTasks: 'No Tasks',
    noTasksDesc: 'No tasks to execute for current project',
    actions: {
      start: 'Start',
      pause: 'Pause',
      skip: 'Skip',
      retry: 'Retry',
    },
    created: 'Created',
    started: 'Started',
    completed: 'Completed',
  },
  
  // Reader
  reader: {
    highlight: 'Highlight Selected Text',
    annotate: 'Add Annotation',
    selectedText: 'Selected Text',
    highlights: 'Highlights',
    annotations: 'Annotations',
    notePlaceholder: 'Enter your annotation...',
    save: 'Save',
  },
  
  // AI Demo
  aiDemo: {
    title: 'AI Optimization Demo',
    subtitle: 'Learn how AI helps you intelligently organize bookmarks',
    steps: {
      import: {
        title: 'Step 1: Import Bookmarks',
        desc: 'Sync with Chrome, Edge, Firefox or import HTML bookmark files',
      },
      analysis: {
        title: 'Step 2: AI Smart Analysis',
        desc: 'AI reads bookmark titles, URLs, content to understand topics and categories',
      },
      suggestions: {
        title: 'Step 3: Generate Suggestions',
        desc: 'AI generates category, alias, tag suggestions with confidence scores',
      },
      confirm: {
        title: 'Step 4: User Confirmation & Apply',
        desc: 'Confirm individually or accept all high-confidence suggestions',
      },
    },
    buttons: {
      prev: 'Previous',
      next: 'Next',
      start: 'Get Started',
    },
  },
};
