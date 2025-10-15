import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://small-font-generator.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          'zh-CN': `${baseUrl}`,
          'zh-TW': `${baseUrl}?lang=zh-TW`,
          'en': `${baseUrl}?lang=en`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'zh-CN': `${baseUrl}/about`,
          'zh-TW': `${baseUrl}/about?lang=zh-TW`,
          'en': `${baseUrl}/about?lang=en`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          'zh-CN': `${baseUrl}/contact`,
          'zh-TW': `${baseUrl}/contact?lang=zh-TW`,
          'en': `${baseUrl}/contact?lang=en`,
        },
      },
    },
  ]
}