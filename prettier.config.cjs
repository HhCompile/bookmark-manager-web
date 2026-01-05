// Prettier配置文件 (CommonJS格式)
// 用于统一项目代码格式化规则

module.exports = {
  // 代码末尾是否添加分号
  semi: true,

  // 尾随逗号配置，设置为es5表示仅在ES5语法允许的位置添加尾随逗号
  trailingComma: 'es5',

  // 使用单引号而不是双引号
  singleQuote: true,

  // 每行代码的最大宽度
  printWidth: 80,

  // 缩进宽度，使用2个空格
  tabWidth: 2,

  // 是否使用制表符(tab)进行缩进，设置为false表示使用空格
  useTabs: false,

  // 对象字面量中的括号之间是否添加空格，例如 { foo: bar } vs {foo: bar}
  bracketSpacing: true,

  // 箭头函数的参数是否使用括号，设置为avoid表示仅在需要时使用括号
  arrowParens: 'avoid',

  // 换行方式，设置为preserve表示保持原始换行方式
  proseWrap: 'preserve',

  // 使用的Prettier插件列表
  plugins: [
    // 用于Tailwind CSS类名自动排序
    'prettier-plugin-tailwindcss',
    // 用于导入语句自动排序
    'prettier-plugin-sort-imports',
  ],

  // 导入语句的排序规则
  importOrder: [
    '^react$', // React核心库
    '^react-dom$', // React DOM库
    '^@tanstack/.*$', // TanStack库
    '^axios$', // Axios HTTP客户端
    '^i18next$', // i18next国际化库
    '^react-i18next$', // React i18next绑定
    '^lucide-react$', // Lucide React图标库
    '^@/components/.*$', // 项目组件
    '^@/pages/.*$', // 项目页面
    '^@/store/.*$', // 项目状态管理
    '^@/services/.*$', // 项目服务
    '^@/utils/.*$', // 项目工具函数
    '^@/hooks/.*$', // 项目自定义hooks
    '^@/router/.*$', // 项目路由
    '^@/assets/.*$', // 项目静态资源
    '^@/.*$', // 其他项目内部导入
    '^\.\./.*$', // 父级目录导入
    '^\./.*$', // 当前目录导入
    '^.*\.css$', // CSS文件导入
    '^.*\.scss$', // SCSS文件导入
    '^.*\.svg$', // SVG文件导入
  ],

  // 是否在导入组之间添加空行
  importOrderSeparation: true,

  // 是否对导入的指定符进行排序
  importOrderSortSpecifiers: true,

  // 是否对命名空间导入进行分组
  importOrderGroupNamespaceSpecifiers: true,
};
