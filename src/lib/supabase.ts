import { createClient } from '@supabase/supabase-js'

// 使用环境变量，如果不存在则使用默认值
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://joayryodxzhsxchuhscz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvYXlyeW9keHpoc3hjaHVoc2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MzI5MDgsImV4cCI6MjA3NTMwODkwOH0.kWP7IrFZrhehJLVH6r_KXOQfh_I1v_NSX08fj1HiAhQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 数据库类型定义
export interface 用户配置 {
  id: string
  用户id: string
  语言: string
  主题: string
  创建时间: string
  更新时间: string
}

export interface 使用记录 {
  id: string
  用户id?: string
  输入文本: string
  转换样式: string
  转换结果: string
  ip地址?: string
  用户代理?: string
  创建时间: string
}

// 本地存储的用户配置函数（替代数据库）
export async function 获取用户配置(用户id: string): Promise<{ 语言: string; 主题: string } | null> {
  try {
    const 配置 = localStorage.getItem(`用户配置_${用户id}`)
    if (配置) {
      return JSON.parse(配置)
    }
  } catch (error) {
    console.error('获取用户配置失败:', error)
  }
  return { 语言: 'zh-CN', 主题: 'light' }
}

export async function 保存用户配置(用户id: string, 配置: { 语言: string; 主题: string }): Promise<boolean> {
  try {
    localStorage.setItem(`用户配置_${用户id}`, JSON.stringify(配置))
    return true
  } catch (error) {
    console.error('保存用户配置失败:', error)
    return false
  }
}

// 本地存储的使用记录函数（替代数据库）
export async function 记录使用(记录: { 输入文本: string; 转换样式: string; 转换结果: string }): Promise<boolean> {
  try {
    const 现有记录 = JSON.parse(localStorage.getItem('使用记录') || '[]')
    现有记录.push({
      ...记录,
      创建时间: new Date().toISOString()
    })
    
    // 只保留最近1000条记录
    if (现有记录.length > 1000) {
      现有记录.splice(0, 现有记录.length - 1000)
    }
    
    localStorage.setItem('使用记录', JSON.stringify(现有记录))
    return true
  } catch (error) {
    console.error('记录使用失败:', error)
    return false
  }
}

export async function 获取使用统计(用户id?: string): Promise<{ 今日: number; 总计: number }> {
  try {
    const 记录列表 = JSON.parse(localStorage.getItem('使用记录') || '[]')
    const 今天开始 = new Date()
    今天开始.setHours(0, 0, 0, 0)
    
    const 今日记录 = 记录列表.filter((记录: any) => 
      new Date(记录.创建时间) >= 今天开始
    )
    
    return {
      今日: 今日记录.length,
      总计: 记录列表.length
    }
  } catch (error) {
    console.error('获取使用统计失败:', error)
    return { 今日: 0, 总计: 0 }
  }
}