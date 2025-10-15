import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '小字体生成器 - 特殊字符文本转换工具',
    short_name: '小字体生成器',
    description: '免费在线小字体生成器，支持上标、下标、圆圈、方框、斜体、粗体等9种特殊字符样式转换',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['utilities', 'productivity'],
    lang: 'zh-CN',
  }
}