import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wind,
  Code,
  Zap,
  Grid,
  Smartphone,
  Eye,
  Play,
  ArrowRight,
  CheckCircle,
  Settings,
  Monitor,
  Tablet,
  Copy,
  ExternalLink,
} from 'lucide-react';

export default function TailwindDemo() {
  const [activeDemo, setActiveDemo] = useState('utilities');
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const demos = [
    {
      id: 'utilities',
      title: '实用类演示',
      description: '展示 Tailwind 的核心实用类概念',
      component: (
        <div className='space-y-6'>
          {/* 间距和尺寸 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              间距和尺寸
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='p-2 bg-blue-100 rounded text-center text-sm'>
                p-2
              </div>
              <div className='p-4 bg-blue-200 rounded text-center text-sm'>
                p-4
              </div>
              <div className='p-6 bg-blue-300 rounded text-center text-sm'>
                p-6
              </div>
              <div className='p-8 bg-blue-400 rounded text-center text-sm text-white'>
                p-8
              </div>
            </div>
          </div>

          {/* 颜色 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              颜色系统
            </h4>
            <div className='grid grid-cols-5 gap-2'>
              {['gray', 'red', 'yellow', 'green', 'blue'].map(color => (
                <div key={color} className='space-y-1'>
                  {[100, 300, 500, 700, 900].map(shade => (
                    <div
                      key={shade}
                      className={`h-8 rounded text-xs flex items-center justify-center bg-${color}-${shade} ${
                        shade >= 500 ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {shade}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 布局 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              布局系统
            </h4>
            <div className='space-y-4'>
              <div className='flex space-x-4'>
                <div className='flex-1 p-4 bg-purple-100 rounded text-center'>
                  flex-1
                </div>
                <div className='flex-2 p-4 bg-purple-200 rounded text-center'>
                  flex-2
                </div>
                <div className='flex-1 p-4 bg-purple-300 rounded text-center'>
                  flex-1
                </div>
              </div>
              <div className='grid grid-cols-3 gap-4'>
                <div className='col-span-1 p-4 bg-green-100 rounded text-center'>
                  col-span-1
                </div>
                <div className='col-span-2 p-4 bg-green-200 rounded text-center'>
                  col-span-2
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `<!-- 间距和尺寸 -->
<div class="p-4 m-2 w-64 h-32">
  <div class="p-2 bg-blue-100">padding: 8px</div>
</div>

<!-- 颜色 -->
<div class="bg-blue-500 text-white p-4">
  蓝色背景，白色文字
</div>

<!-- 布局 -->
<div class="flex space-x-4">
  <div class="flex-1 bg-purple-100">弹性布局 1</div>
  <div class="flex-2 bg-purple-200">弹性布局 2</div>
</div>`,
    },
    {
      id: 'responsive',
      title: '响应式设计',
      description: '移动优先的响应式断点系统',
      component: (
        <div className='space-y-6'>
          <div className='bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-6 rounded-lg'>
            <h4 className='text-lg font-semibold mb-2'>响应式容器</h4>
            <p className='text-sm opacity-90'>
              在不同屏幕尺寸下调整窗口大小查看效果
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='bg-red-100 p-4 rounded text-center'>
              <Monitor className='w-8 h-8 mx-auto mb-2 text-red-600' />
              <p className='text-sm font-medium'>桌面端</p>
              <p className='text-xs text-gray-600'>lg: 3列布局</p>
            </div>
            <div className='bg-orange-100 p-4 rounded text-center'>
              <Tablet className='w-8 h-8 mx-auto mb-2 text-orange-600' />
              <p className='text-sm font-medium'>平板</p>
              <p className='text-xs text-gray-600'>md: 2列布局</p>
            </div>
            <div className='bg-green-100 p-4 rounded text-center'>
              <Smartphone className='w-8 h-8 mx-auto mb-2 text-green-600' />
              <p className='text-sm font-medium'>手机</p>
              <p className='text-xs text-gray-600'>默认: 1列布局</p>
            </div>
          </div>

          <div className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 rounded-lg text-center'>
            文字大小随屏幕尺寸变化：xs → sm → md → lg → xl
          </div>
        </div>
      ),
      code: `<!-- 响应式网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>移动端1列，平板2列，桌面3列</div>
</div>

<!-- 响应式文字 -->
<div class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
  响应式文字大小
</div>

<!-- 响应式显示/隐藏 -->
<div class="block md:hidden">只在移动端显示</div>
<div class="hidden md:block">只在桌面端显示</div>`,
    },
    {
      id: 'components',
      title: '组件构建',
      description: '使用 Tailwind 快速构建常用组件',
      component: (
        <div className='space-y-6'>
          {/* 按钮组件 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              按钮组件
            </h4>
            <div className='flex flex-wrap gap-3'>
              <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'>
                Primary
              </button>
              <button className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'>
                Secondary
              </button>
              <button className='px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors'>
                Outline
              </button>
              <button className='px-4 py-2 text-blue-500 rounded hover:bg-blue-50 transition-colors'>
                Ghost
              </button>
            </div>
          </div>

          {/* 卡片组件 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              卡片组件
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center'>
                    <Zap className='w-6 h-6 text-white' />
                  </div>
                  <div className='ml-4'>
                    <h5 className='font-semibold text-gray-900'>快速开发</h5>
                    <p className='text-sm text-gray-600'>提升开发效率</p>
                  </div>
                </div>
                <p className='text-gray-700 text-sm'>
                  通过预定义的实用类，快速构建美观的界面组件。
                </p>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                    <CheckCircle className='w-6 h-6 text-white' />
                  </div>
                  <div className='ml-4'>
                    <h5 className='font-semibold text-gray-900'>一致性</h5>
                    <p className='text-sm text-gray-600'>设计系统支持</p>
                  </div>
                </div>
                <p className='text-gray-700 text-sm'>
                  内置的设计标准确保整个应用的视觉一致性。
                </p>
              </div>
            </div>
          </div>

          {/* 表单组件 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              表单组件
            </h4>
            <div className='bg-white rounded-lg p-6 border border-gray-200'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    邮箱地址
                  </label>
                  <input
                    type='email'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='请输入邮箱地址'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    消息内容
                  </label>
                  <textarea
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='请输入消息内容'
                  />
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label className='ml-2 text-sm text-gray-700'>
                    我同意隐私政策
                  </label>
                </div>
                <button className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'>
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `<!-- 按钮组件 -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
  Primary Button
</button>

<!-- 卡片组件 -->
<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
  <h3 class="font-semibold text-gray-900 mb-2">卡片标题</h3>
  <p class="text-gray-700">卡片内容...</p>
</div>

<!-- 表单组件 -->
<input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />`,
    },
    {
      id: 'animations',
      title: '动画和交互',
      description: 'Tailwind 的动画和交互效果',
      component: (
        <div className='space-y-6'>
          {/* 过渡动画 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              过渡动画
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='p-4 bg-blue-100 rounded text-center hover:bg-blue-200 transition-colors duration-300 cursor-pointer'>
                hover:colors
              </div>
              <div className='p-4 bg-green-100 rounded text-center hover:scale-105 transform transition-transform duration-300 cursor-pointer'>
                hover:scale
              </div>
              <div className='p-4 bg-purple-100 rounded text-center hover:rotate-3 transform transition-transform duration-300 cursor-pointer'>
                hover:rotate
              </div>
              <div className='p-4 bg-pink-100 rounded text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
                hover:shadow
              </div>
            </div>
          </div>

          {/* 内置动画 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              内置动画
            </h4>
            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 bg-blue-500 rounded-full animate-ping'></div>
                <span className='text-sm'>animate-ping</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-sm'>animate-pulse</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 bg-purple-500 rounded animate-bounce'></div>
                <span className='text-sm'>animate-bounce</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 bg-pink-500 rounded animate-spin'></div>
                <span className='text-sm'>animate-spin</span>
              </div>
            </div>
          </div>

          {/* 悬停效果 */}
          <div>
            <h4 className='text-lg font-semibold text-gray-800 mb-3'>
              悬停效果卡片
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='group cursor-pointer'>
                <div className='bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg p-6 text-white transform group-hover:scale-105 transition-transform duration-300'>
                  <h5 className='font-semibold mb-2'>悬停缩放</h5>
                  <p className='text-sm opacity-90'>鼠标悬停时卡片会放大</p>
                  <div className='mt-4 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300'>
                    <ArrowRight className='w-5 h-5' />
                  </div>
                </div>
              </div>

              <div className='group cursor-pointer'>
                <div className='bg-white border-2 border-gray-200 rounded-lg p-6 group-hover:border-purple-500 group-hover:shadow-lg transition-all duration-300'>
                  <h5 className='font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-300'>
                    悬停变色
                  </h5>
                  <p className='text-sm text-gray-600'>
                    鼠标悬停时边框和文字会变色
                  </p>
                  <div className='mt-4 w-8 h-1 bg-gray-300 group-hover:bg-purple-500 group-hover:w-12 transition-all duration-300'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `<!-- 过渡动画 -->
<div class="transition-colors duration-300 hover:bg-blue-200">
  颜色过渡
</div>

<div class="transform transition-transform duration-300 hover:scale-105">
  缩放过渡
</div>

<!-- 内置动画 -->
<div class="animate-ping">闪烁动画</div>
<div class="animate-pulse">脉冲动画</div>
<div class="animate-bounce">弹跳动画</div>
<div class="animate-spin">旋转动画</div>

<!-- 群组悬停 -->
<div class="group">
  <div class="group-hover:text-blue-500">群组悬停效果</div>
</div>`,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: '快速开发',
      description: '预定义的实用类让开发速度提升数倍',
      benefits: ['无需写CSS', '即时预览', '快速迭代'],
    },
    {
      icon: Grid,
      title: '设计一致性',
      description: '内置的设计系统确保视觉一致性',
      benefits: ['统一间距', '一致配色', '标准组件'],
    },
    {
      icon: Smartphone,
      title: '响应式优先',
      description: '移动优先的响应式设计方法',
      benefits: ['断点系统', '灵活布局', '设备适配'],
    },
    {
      icon: Settings,
      title: '高度可定制',
      description: '通过配置文件定制设计系统',
      benefits: ['自定义主题', '扩展工具', '插件系统'],
    },
  ];

  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mb-6'>
          <Wind className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Tailwind CSS 演示
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          实用优先的 CSS 框架，通过预定义的实用类快速构建现代界面
        </p>
      </motion.div>

      {/* 演示选项卡 */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='border-b border-gray-200'>
          <div className='flex flex-wrap gap-1 p-2'>
            {demos.map(demo => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeDemo === demo.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {demo.id === 'utilities' && <Code className='w-4 h-4' />}
                {demo.id === 'responsive' && <Smartphone className='w-4 h-4' />}
                {demo.id === 'components' && <Grid className='w-4 h-4' />}
                {demo.id === 'animations' && <Play className='w-4 h-4' />}
                {demo.title}
              </button>
            ))}
          </div>
        </div>

        {/* 当前演示内容 */}
        <div className='p-8'>
          {demos.map(
            demo =>
              activeDemo === demo.id && (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-6'
                >
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                      {demo.title}
                    </h2>
                    <p className='text-gray-600 mb-6'>{demo.description}</p>
                  </div>

                  {/* 演示组件 */}
                  <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
                    {demo.component}
                  </div>

                  {/* 代码示例 */}
                  <div className='bg-gray-900 rounded-lg overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-2 bg-gray-800'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span className='text-gray-400 text-sm'>
                          {demo.title}.html
                        </span>
                        <button
                          onClick={() => copyToClipboard(demo.code)}
                          className='p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors'
                          title='复制代码'
                        >
                          {copiedCode === demo.code ? (
                            <CheckCircle className='w-4 h-4 text-green-400' />
                          ) : (
                            <Copy className='w-4 h-4' />
                          )}
                        </button>
                      </div>
                    </div>
                    <pre className='p-4 text-sm text-gray-100 overflow-x-auto leading-relaxed'>
                      <code>{demo.code}</code>
                    </pre>
                  </div>
                </motion.div>
              )
          )}
        </div>
      </div>

      {/* 特性展示 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className='bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
          >
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-4'>
                <feature.icon className='w-6 h-6 text-white' />
              </div>
              <h3 className='font-semibold text-gray-900'>{feature.title}</h3>
            </div>
            <p className='text-gray-600 text-sm mb-4 leading-relaxed'>
              {feature.description}
            </p>
            <ul className='space-y-1'>
              {feature.benefits.map((benefit, idx) => (
                <li
                  key={idx}
                  className='flex items-center text-sm text-gray-700'
                >
                  <CheckCircle className='w-3 h-3 text-green-500 mr-2 flex-shrink-0' />
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* 配置示例 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'
      >
        <div className='p-8'>
          <div className='flex items-center mb-6'>
            <Settings className='w-6 h-6 text-blue-500 mr-3' />
            <h2 className='text-2xl font-bold text-gray-900'>配置定制</h2>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                tailwind.config.js
              </h3>
              <div className='bg-gray-900 rounded-lg overflow-hidden'>
                <div className='px-4 py-2 bg-gray-800 text-gray-400 text-sm'>
                  配置文件示例
                </div>
                <pre className='p-4 text-sm text-gray-100 overflow-x-auto leading-relaxed'>
                  <code>{`module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                自定义组件类
              </h3>
              <div className='bg-gray-900 rounded-lg overflow-hidden'>
                <div className='px-4 py-2 bg-gray-800 text-gray-400 text-sm'>
                  组件样式示例
                </div>
                <pre className='p-4 text-sm text-gray-100 overflow-x-auto leading-relaxed'>
                  <code>{`@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
    @apply hover:bg-blue-600 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md border;
    @apply border-gray-200 p-6;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300;
    @apply rounded-md focus:ring-2 focus:ring-blue-500;
  }
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 使用建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200'
      >
        <div className='flex items-center mb-6'>
          <Eye className='w-6 h-6 text-cyan-600 mr-3' />
          <h2 className='text-2xl font-bold text-gray-900'>使用建议</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-green-600 font-bold mb-3'>✅ 适用场景</h3>
            <ul className='space-y-2 text-gray-700'>
              <li className='flex items-start'>
                <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                快速原型开发和MVP项目
              </li>
              <li className='flex items-start'>
                <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                需要快速迭代的产品
              </li>
              <li className='flex items-start'>
                <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                团队协作的大型项目
              </li>
              <li className='flex items-start'>
                <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                响应式设计要求高的应用
              </li>
            </ul>
          </div>

          <div className='text-center'>
            <h3 className='text-cyan-600 font-bold mb-4 text-xl'>
              🌪️ Tailwind CSS 演示完成
            </h3>
            <p className='text-gray-600 mb-6'>
              体验了 Tailwind CSS 的实用优先方法，想了解更多设计理念和技术细节？
            </p>
            <a
              href='/docs/concepts/styling'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              查看深度理论分析
              <ArrowRight className='w-4 h-4 ml-2' />
            </a>
          </div>
        </div>

        <div className='mt-8 p-4 bg-white rounded-lg border border-cyan-200'>
          <div className='flex items-center justify-between'>
            <span className='text-gray-700 font-medium'>
              💡 Tailwind CSS 是现代前端开发的优秀选择，特别适合快速构建产品原型
            </span>
            <a
              href='https://tailwindcss.com/docs'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors'
            >
              查看文档
              <ExternalLink className='w-4 h-4 ml-2' />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
