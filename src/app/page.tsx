'use client'

import { useState, useEffect } from 'react'
import { 文本样式列表 } from '@/lib/文本转换器'
import { 支持的语言, 获取翻译, 检测默认语言 } from '@/lib/国际化配置'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 保存用户配置, 获取用户配置, 记录使用, 获取使用统计 } from '@/lib/supabase'

export default function 首页() {
  const [输入文本, 设置输入文本] = useState('')
  const [复制状态, 设置复制状态] = useState<{ [key: string]: boolean }>({})
  const [当前语言, 设置当前语言] = useState('zh-CN')
  const [主题, 设置主题] = useState<'light' | 'dark'>('light')
  const [用户, 设置用户] = useState<any>(null)
  const [使用统计, 设置使用统计] = useState({ 今日: 0, 总计: 0 })
  const [显示语言菜单, 设置显示语言菜单] = useState(false)
  const [演示文本] = useState('Hello World 你好世界')

  const supabase = createClientComponentClient();

  useEffect(() => {
    设置当前语言(检测默认语言());
    
    // 检查用户认证状态
    supabase.auth.getSession().then(({ data: { session } }) => {
      设置用户(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      设置用户(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (用户) {
      获取用户配置(用户.id).then(配置 => {
        if (配置) {
          设置当前语言(配置.语言);
          设置主题(配置.主题);
        }
      });
      
      获取使用统计(用户.id).then(统计 => {
        设置使用统计(统计);
      });
    } else {
      // 未登录用户也显示统计
      获取使用统计().then(统计 => {
        设置使用统计(统计);
      });
    }
  }, [用户]);

  const 复制到剪贴板 = async (文本: string, 样式名称: string) => {
    try {
      await navigator.clipboard.writeText(文本);
      设置复制状态(prev => ({ ...prev, [样式名称]: true }));
      
      // 记录使用情况
      await 记录使用({
        输入文本: 输入文本,
        转换样式: 样式名称,
        转换结果: 文本
      });
      
      const 新统计 = await 获取使用统计(用户?.id);
      设置使用统计(新统计);
      
      setTimeout(() => {
        设置复制状态(prev => ({ ...prev, [样式名称]: false }));
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const 切换语言 = async (新语言: string) => {
    设置当前语言(新语言);
    设置显示语言菜单(false);
    
    if (用户) {
      await 保存用户配置(用户.id, { 语言: 新语言, 主题 });
    }
  };

  const 切换主题 = async () => {
    const 新主题 = 主题 === 'light' ? 'dark' : 'light';
    设置主题(新主题);
    
    if (用户) {
      await 保存用户配置(用户.id, { 语言: 当前语言, 主题: 新主题 });
    }
  };

  const 登录 = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const 登出 = async () => {
    await supabase.auth.signOut();
  };

  const 翻译 = (键: string) => 获取翻译(键, 当前语言);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      主题 === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    }`}>
      {/* 导航栏 */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        主题 === 'dark' 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {翻译('title')}
              </h1>
              {用户 && (
                <div className={`text-sm px-3 py-1 rounded-full ${
                  主题 === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {翻译('usage')}: {使用统计.今日} | {翻译('total')}: {使用统计.总计}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 语言切换 */}
              <div className="relative">
                <button
                  onClick={() => 设置显示语言菜单(!显示语言菜单)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover-scale hover-lift ${
                    主题 === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{翻译('language')}</span>
                </button>
                
                {显示语言菜单 && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border transition-all duration-200 animate-fade-in z-50 ${
                    主题 === 'dark' 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {支持的语言.map((语言) => (
                      <button
                        key={语言.代码}
                        onClick={() => 切换语言(语言.代码)}
                        className={`w-full text-left px-4 py-2 transition-all duration-200 hover-lift first:rounded-t-lg last:rounded-b-lg ${
                          当前语言 === 语言.代码
                            ? (主题 === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800')
                            : (主题 === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700')
                        }`}
                      >
                        {语言.名称}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 主题切换 */}
              <button
                onClick={切换主题}
                className={`p-2 rounded-lg transition-all duration-200 hover-scale hover-lift active:animate-bounce ${
                  主题 === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {主题 === 'dark' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* 用户认证 */}
              {用户 ? (
                <button
                  onClick={登出}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
                >
                  {翻译('logout')}
                </button>
              ) : (
                <button
                  onClick={登录}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {翻译('loginWithGoogle')}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题区域 */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse-hover">
            {翻译('title')}
          </h1>
          <p className={`text-lg md:text-xl mb-8 animate-slide-in ${
            主题 === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`} style={{ animationDelay: '0.2s' }}>
            {翻译('subtitle')}
          </p>
        </div>

        {/* 字体演示 */}
        <div className={`mb-4 p-4 rounded-2xl shadow-xl transition-all duration-300 animate-fade-in hover-lift ${
          主题 === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white/70 border border-gray-200'
        }`} style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-bounce-hover">
            {翻译('fontDemo')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {文本样式列表.slice(0, 6).map((样式, 索引) => (
              <div
                key={样式.名称}
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  主题 === 'dark' 
                    ? 'bg-gray-700/50 border border-gray-600' 
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
                style={{ animationDelay: `${索引 * 100}ms` }}
              >
                <h3 className={`text-sm font-medium mb-3 ${
                  主题 === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {当前语言 === 'zh-CN' ? 样式.名称 : 样式.英文名称}
                </h3>
                <div className="text-2xl font-bold text-center py-3 min-h-[60px] flex items-center justify-center">
                  {样式.转换函数(演示文本)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 输入区域 */}
        <div className={`mb-8 p-8 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in hover-lift ${
          主题 === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white/70 border border-gray-200'
        }`} style={{ animationDelay: '0.8s' }}>
          <label className={`block text-lg font-medium mb-2 ${
            主题 === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {翻译('inputText')}
          </label>
          <p className={`text-sm mb-4 ${
            主题 === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {当前语言 === 'zh-CN' ? '输入文本后会自动在下方显示转换结果' : 
             当前语言 === 'zh-TW' ? '輸入文本後會自動在下方顯示轉換結果' : 
             'Conversion results will automatically appear below after entering text'}
          </p>
          <textarea
            value={输入文本}
            onChange={(e) => 设置输入文本(e.target.value)}
            placeholder={翻译('placeholder')}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none ${
              主题 === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            rows={4}
          />
        </div>

        {/* 转换结果 */}
        {输入文本 && (
          <div className={`mb-12 p-8 rounded-2xl shadow-xl transition-all duration-300 animate-fade-in hover-lift ${
            主题 === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/70 border border-gray-200'
          }`} style={{ animationDelay: '1s' }}>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {翻译('convertedResults')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {文本样式列表.map((样式, 索引) => {
                const 转换后文本 = 样式.转换函数(输入文本);
                const 是否已复制 = 复制状态[样式.名称];
                
                return (
                  <div
                    key={样式.名称}
                    className={`group p-6 rounded-xl border transition-all duration-300 hover-scale hover-lift animate-fade-in ${
                      主题 === 'dark' 
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70' 
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-xl'
                    }`}
                    style={{ animationDelay: `${索引 * 100 + 600}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`font-semibold ${
                        主题 === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {当前语言 === 'zh-CN' ? 样式.名称 : 样式.英文名称}
                      </h3>
                      <button
                        onClick={() => 复制到剪贴板(转换后文本, 样式.名称)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover-scale active:animate-bounce ${
                          是否已复制
                            ? 'bg-green-500 text-white animate-pulse'
                            : (主题 === 'dark' 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white')
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {是否已复制 ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          )}
                        </svg>
                        <span className="text-sm">
                          {是否已复制 ? 翻译('copied') : 翻译('copy')}
                        </span>
                      </button>
                    </div>
                    <div className={`text-lg font-medium p-4 rounded-lg break-all ${
                      主题 === 'dark' 
                        ? 'bg-gray-800 text-gray-100' 
                        : 'bg-gray-50 text-gray-800'
                    }`}>
                      {转换后文本}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className={`p-8 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] ${
            主题 === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/70 border border-gray-200'
          }`}>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {翻译('howToUse')}
            </h2>
            <ol className={`space-y-4 ${主题 === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>{翻译('step1')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>{翻译('step2')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>{翻译('step3')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>{翻译('step4')}</span>
              </li>
            </ol>
          </div>

          <div className={`p-8 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] ${
            主题 === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/70 border border-gray-200'
          }`}>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {翻译('commonUses')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'socialMedia', icon: '📱' },
                { key: 'profile', icon: '👤' },
                { key: 'username', icon: '✨' },
                { key: 'math', icon: '🔢' },
                { key: 'design', icon: '🎨' },
                { key: 'creative', icon: '💡' }
              ].map((用途) => (
                <div
                  key={用途.key}
                  className={`p-4 rounded-lg text-center transition-all duration-200 hover:scale-105 ${
                    主题 === 'dark' 
                      ? 'bg-gray-700/50 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-2">{用途.icon}</div>
                  <div className={`text-sm ${主题 === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {翻译(用途.key)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className={`border-t mt-16 ${
        主题 === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-white/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className={`text-sm ${主题 === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              © 2024 小字体生成器. 保留所有权利.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
