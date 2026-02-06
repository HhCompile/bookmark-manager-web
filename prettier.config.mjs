// Prettier 配置文件
export default {
  // 使用 2 个空格进行缩进
  tabWidth: 2,
  // 使用空格代替制表符
  useTabs: false,
  // 行尾添加分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 为对象属性添加引号
  quoteProps: 'as-needed',
  // 多行对象的最后一个属性后添加逗号
  trailingComma: 'es5',
  // 多行数组的括号前后不添加空格
  bracketSpacing: true,
  // 箭头函数的参数括号
  arrowParens: 'always',
  // 换行符风格
  endOfLine: 'lf',
  // 最大行宽
  printWidth: 80,
  // 嵌入 HTML 中的代码是否使用 Prettier 格式化
  htmlWhitespaceSensitivity: 'css',
  // Vue 文件的脚本和样式标签是否缩进
  vueIndentScriptAndStyle: true
}