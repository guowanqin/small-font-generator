import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "小字体生成器 - 在线文本样式转换工具 | Small Font Generator",
    template: "%s | 小字体生成器"
  },
  description: "免费在线小字体生成器，支持多种文本样式转换，包括小型大写字母、上标、下标、圆圈、方形等特殊字符。Free online small font generator supporting multiple text style conversions.",
  keywords: [
    "小字体生成器", "文本转换", "特殊字符", "上标", "下标", "圆圈文字", "方形文字",
    "small font generator", "text converter", "special characters", "superscript", "subscript",
    "circled text", "squared text", "unicode text", "font styles", "text decoration"
  ],
  authors: [{ name: "万青", url: "https://github.com/guowanqin" }],
  creator: "万青",
  publisher: "万青AI软件",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["zh_TW", "en_US"],
    url: "https://small-font-generator.vercel.app",
    title: "小字体生成器 - 在线文本样式转换工具",
    description: "免费在线小字体生成器，支持多种文本样式转换，包括小型大写字母、上标、下标、圆圈、方形等特殊字符",
    siteName: "小字体生成器",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "小字体生成器 - 在线文本样式转换工具",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "小字体生成器 - 在线文本样式转换工具",
    description: "免费在线小字体生成器，支持多种文本样式转换",
    images: ["/og-image.png"],
    creator: "@wanqing_ai",
  },
  alternates: {
    canonical: "https://small-font-generator.vercel.app",
    languages: {
      'zh-CN': 'https://small-font-generator.vercel.app',
      'zh-TW': 'https://small-font-generator.vercel.app?lang=zh-TW',
      'en': 'https://small-font-generator.vercel.app?lang=en',
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Web Tools",
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': '小字体生成器',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "小字体生成器",
              "alternateName": "Small Font Generator",
              "description": "免费在线小字体生成器，支持多种文本样式转换，包括小型大写字母、上标、下标、圆圈、方形等特殊字符",
              "url": "https://small-font-generator.vercel.app",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "万青",
                "url": "https://github.com/guowanqin"
              },
              "publisher": {
                "@type": "Organization",
                "name": "万青AI软件"
              },
              "inLanguage": ["zh-CN", "zh-TW", "en"],
              "featureList": [
                "小型大写字母转换",
                "上标下标转换", 
                "圆圈方形文字",
                "手写体粗体斜体",
                "倒置文字",
                "多语言支持",
                "实时转换",
                "一键复制"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
