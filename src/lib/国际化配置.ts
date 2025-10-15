export const 支持的语言 = [
  { 代码: 'zh-CN', 名称: '简体中文' },
  { 代码: 'zh-TW', 名称: '繁體中文' },
  { 代码: 'en', 名称: 'English' }
];

export const 翻译字典 = {
  'zh-CN': {
    title: '小字体生成器',
    subtitle: '在线文本样式转换工具，支持多种特殊字体效果',
    language: '语言',
    loginWithGoogle: 'Google 登录',
    logout: '退出登录',
    usage: '今日使用',
    total: '总计',
    fontDemo: '字体演示',
    inputText: '输入文本',
    placeholder: '请输入要转换的文本...',
    convertedResults: '转换结果',
    copy: '复制',
    copied: '已复制到剪贴板！',
    howToUse: '如何使用小字体生成器',
    step1: '在上方文本框中输入您想要转换的文本',
    step2: '系统会自动生成多种字体样式的转换结果',
    step3: '点击任意样式旁边的"复制"按钮',
    step4: '将复制的文本粘贴到您需要的地方使用',
    commonUses: '常见用途',
    socialMedia: '社交媒体',
    profile: '个人资料',
    username: '用户名装饰',
    math: '数学公式',
    design: '设计装饰',
    creative: '创意文本'
  },
  'zh-TW': {
    title: '小字體生成器',
    subtitle: '線上文本樣式轉換工具，支援多種特殊字體效果',
    language: '語言',
    loginWithGoogle: 'Google 登入',
    logout: '退出登入',
    usage: '今日使用',
    total: '總計',
    fontDemo: '字體演示',
    inputText: '輸入文本',
    placeholder: '請輸入要轉換的文本...',
    convertedResults: '轉換結果',
    copy: '複製',
    copied: '已複製到剪貼板！',
    howToUse: '如何使用小字體生成器',
    step1: '在上方文本框中輸入您想要轉換的文本',
    step2: '系統會自動生成多種字體樣式的轉換結果',
    step3: '點擊任意樣式旁邊的"複製"按鈕',
    step4: '將複製的文本貼上到您需要的地方使用',
    commonUses: '常見用途',
    socialMedia: '社交媒體',
    profile: '個人資料',
    username: '用戶名裝飾',
    math: '數學公式',
    design: '設計裝飾',
    creative: '創意文本'
  },
  'en': {
    title: 'Small Font Generator',
    subtitle: 'Online text style conversion tool with multiple special font effects',
    language: 'Language',
    loginWithGoogle: 'Login with Google',
    logout: 'Logout',
    usage: 'Today',
    total: 'Total',
    fontDemo: 'Font Demonstration',
    inputText: 'Input Text',
    placeholder: 'Enter text to convert...',
    convertedResults: 'Converted Results',
    copy: 'Copy',
    copied: 'Copied to clipboard!',
    howToUse: 'How to Use Small Font Generator',
    step1: 'Enter the text you want to convert in the text box above',
    step2: 'The system will automatically generate conversion results in multiple font styles',
    step3: 'Click the "Copy" button next to any style',
    step4: 'Paste the copied text wherever you need to use it',
    commonUses: 'Common Uses',
    socialMedia: 'Social Media',
    profile: 'Profile',
    username: 'Username Decoration',
    math: 'Math Formulas',
    design: 'Design Decoration',
    creative: 'Creative Text'
  }
};

export function 检测默认语言(): string {
  if (typeof window === 'undefined') return 'zh-CN';
  
  const 浏览器语言 = navigator.language || 'zh-CN';
  
  if (浏览器语言.startsWith('zh')) {
    if (浏览器语言.includes('TW') || 浏览器语言.includes('HK') || 浏览器语言.includes('MO')) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }
  
  if (浏览器语言.startsWith('en')) {
    return 'en';
  }
  
  return 'zh-CN';
}

export function 获取翻译(键: string, 语言: string): string {
  const 语言字典 = 翻译字典[语言 as keyof typeof 翻译字典];
  if (!语言字典) return 键;
  
  return 语言字典[键 as keyof typeof 语言字典] || 键;
}