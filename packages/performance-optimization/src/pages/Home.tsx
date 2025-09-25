import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap,
  MemoryStick,
  Split,
  Layers,
  Activity,
  BarChart3,
  Timer,
  ArrowRight,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Target,
  Cpu,
} from 'lucide-react';

const optimizationAreas = [
  {
    name: '渲染优化',
    description: 'React.memo, useMemo, useCallback 最佳实践',
    href: '/render-optimization',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    features: ['React.memo', 'useMemo 缓存', 'useCallback 优化'],
  },
  {
    name: '内存管理',
    description: '内存泄漏检测与优化策略',
    href: '/memory-management',
    icon: MemoryStick,
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    features: ['内存监控', '泄漏检测', '垃圾回收'],
  },
  {
    name: '代码分割',
    description: '动态导入与懒加载策略',
    href: '/code-splitting',
    icon: Split,
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    features: ['React.lazy', '路由分割', '组件懒加载'],
  },
  {
    name: '虚拟化技术',
    description: '大列表渲染优化方案',
    href: '/virtualization',
    icon: Layers,
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    features: ['虚拟滚动', '窗口化', '大数据优化'],
  },
  {
    name: '性能监控',
    description: '实时性能指标监控',
    href: '/performance-monitoring',
    icon: Activity,
    color: 'from-red-400 to-rose-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    features: ['Web Vitals', '渲染监控', '内存追踪'],
  },
  {
    name: '对比分析',
    description: '优化前后效果对比',
    href: '/comparison',
    icon: BarChart3,
    color: 'from-cyan-400 to-teal-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    features: ['性能对比', '指标分析', '优化效果'],
  },
];

const performanceMetrics = [
  {
    name: '渲染时间',
    value: '< 16ms',
    description: '保持 60fps 流畅体验',
    icon: Timer,
    color: 'text-green-600',
  },
  {
    name: '内存使用',
    value: '< 50MB',
    description: '合理的内存占用',
    icon: MemoryStick,
    color: 'text-blue-600',
  },
  {
    name: '包体积',
    value: '< 500KB',
    description: '优化后的包大小',
    icon: Target,
    color: 'text-purple-600',
  },
  {
    name: '首屏时间',
    value: '< 1.5s',
    description: '快速的页面加载',
    icon: TrendingUp,
    color: 'text-orange-600',
  },
];

export default function Home() {
  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* 头部介绍 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-16'
      >
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-performance-500 to-performance-600 rounded-2xl mb-6'>
          <Cpu className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-6'>
          React 性能优化实践
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          探索现代 React
          应用的性能优化技术，从渲染优化到内存管理，掌握构建高性能应用的核心技能
        </p>
        <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
          <a
            href='/docs/concepts/performance'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-performance-600 text-white rounded-lg hover:bg-performance-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看理论文档
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
          <Link
            to='/performance-monitoring'
            className='inline-flex items-center px-6 py-3 bg-white text-performance-600 border-2 border-performance-600 rounded-lg hover:bg-performance-50 transition-colors'
          >
            <Activity className='w-5 h-5 mr-2' />
            实时性能监控
            <ArrowRight className='w-4 h-4 ml-2' />
          </Link>
        </div>
      </motion.div>

      {/* 性能指标展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='mb-16'
      >
        <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          性能目标
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className='performance-card text-center'
              >
                <div className='flex items-center justify-center mb-4'>
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                </div>
                <div className='text-2xl font-bold text-gray-900 mb-2'>
                  {metric.value}
                </div>
                <div className='text-lg font-medium text-gray-700 mb-2'>
                  {metric.name}
                </div>
                <p className='text-sm text-gray-500'>{metric.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 优化领域卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mb-16'
      >
        <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          优化技术领域
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {optimizationAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className='group'
              >
                <Link to={area.href}>
                  <div className='performance-card group-hover:scale-105 transition-transform duration-300'>
                    {/* 背景渐变 */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${area.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`}
                    />

                    {/* 图标 */}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${area.color} rounded-xl mb-6`}
                    >
                      <Icon className='w-6 h-6 text-white' />
                    </div>

                    {/* 标题和描述 */}
                    <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-performance-600 transition-colors'>
                      {area.name}
                    </h3>
                    <p className='text-gray-600 mb-6 leading-relaxed'>
                      {area.description}
                    </p>

                    {/* 特性列表 */}
                    <div className='space-y-2 mb-6'>
                      {area.features.map(feature => (
                        <div
                          key={feature}
                          className='flex items-center text-sm text-gray-500'
                        >
                          <div
                            className={`w-2 h-2 ${area.bgColor} rounded-full mr-3`}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* 查看详情 */}
                    <div className='flex items-center text-performance-600 group-hover:text-performance-700 font-medium'>
                      <span>开始实践</span>
                      <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 快速开始 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='bg-gradient-to-br from-performance-50 to-blue-50 rounded-2xl p-8'
      >
        <div className='text-center mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>
            开始你的性能优化之旅
          </h3>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            从基础的渲染优化开始，逐步掌握高级的性能优化技术，构建真正高性能的
            React 应用
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            to='/render-optimization'
            className='inline-flex items-center px-6 py-3 bg-performance-600 text-white font-medium rounded-lg hover:bg-performance-700 transition-colors shadow-lg hover:shadow-xl'
          >
            从渲染优化开始
            <Zap className='w-4 h-4 ml-2' />
          </Link>
          <Link
            to='/comparison'
            className='inline-flex items-center px-6 py-3 bg-white text-performance-600 font-medium rounded-lg border-2 border-performance-600 hover:bg-performance-50 transition-colors'
          >
            查看优化效果对比
            <BarChart3 className='w-4 h-4 ml-2' />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
