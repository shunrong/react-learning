import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText,
  Palette,
  Zap,
  Wind,
  BarChart3,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Code2,
} from 'lucide-react';

const features = [
  {
    name: 'CSS Modules',
    description: '传统的作用域隔离方案，编译时处理，零运行时开销',
    href: '/css-modules',
    icon: FileText,
    color: 'from-green-400 to-blue-500',
    advantages: ['零运行时开销', '作用域隔离', '传统CSS语法'],
  },
  {
    name: 'Styled Components',
    description: '流行的CSS-in-JS库，组件级样式，动态主题支持',
    href: '/styled-components',
    icon: Palette,
    color: 'from-pink-400 to-red-500',
    advantages: ['动态样式', '主题支持', '组件封装'],
  },
  {
    name: 'Emotion',
    description: '高性能CSS-in-JS库，更好的性能和开发体验',
    href: '/emotion',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    advantages: ['高性能', 'TypeScript支持', '灵活API'],
  },
  {
    name: 'Tailwind CSS',
    description: '实用优先的CSS框架，快速构建现代界面',
    href: '/tailwind',
    icon: Wind,
    color: 'from-cyan-400 to-blue-500',
    advantages: ['快速开发', '一致性设计', '小体积'],
  },
];

const resources = [
  {
    name: '方案对比',
    description: '深入对比各种样式方案的优缺点和适用场景',
    href: '/comparison',
    icon: BookOpen,
  },
  {
    name: '性能测试',
    description: '真实性能数据对比，帮助你做出最佳选择',
    href: '/performance',
    icon: BarChart3,
  },
];

export default function Home() {
  return (
    <div className='max-w-7xl mx-auto'>
      {/* 头部介绍 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-16'
      >
        <h1 className='text-4xl font-bold text-gray-900 mb-6'>
          React 样式方案全解析
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          深入了解和对比 CSS Modules、Styled Components、Emotion 和 Tailwind CSS
          等主流样式解决方案， 通过实际示例和性能测试找到最适合你项目的方案。
        </p>
      </motion.div>

      {/* 样式方案卡片 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='group'
            >
              <Link to={feature.href}>
                <div className='relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 group-hover:border-gray-300'>
                  {/* 背景渐变 */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`}
                  />

                  {/* 图标 */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl mb-6`}
                  >
                    <Icon className='w-6 h-6 text-white' />
                  </div>

                  {/* 标题和描述 */}
                  <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
                    {feature.name}
                  </h3>
                  <p className='text-gray-600 mb-6 leading-relaxed'>
                    {feature.description}
                  </p>

                  {/* 优势列表 */}
                  <div className='space-y-2 mb-6'>
                    {feature.advantages.map(advantage => (
                      <div key={advantage} className='flex items-center'>
                        <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                        <span className='text-sm text-gray-700'>
                          {advantage}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 查看详情 */}
                  <div className='flex items-center text-blue-600 group-hover:text-blue-700 font-medium'>
                    <span>查看详情</span>
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 学习资源 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mb-16'
      >
        <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          深度学习资源
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Link to={resource.href}>
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group'>
                    <div className='flex items-start'>
                      <div className='flex-shrink-0'>
                        <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors'>
                          <Icon className='w-5 h-5 text-gray-600 group-hover:text-blue-600' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <h3 className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
                          {resource.name}
                        </h3>
                        <p className='text-gray-600 mt-1'>
                          {resource.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 学习路径建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200'
      >
        <div className='text-center'>
          <Code2 className='w-12 h-12 text-blue-600 mx-auto mb-4' />
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>
            推荐学习路径
          </h3>
          <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
            建议按照从传统到现代的顺序学习：CSS Modules → Styled Components →
            Emotion → Tailwind CSS， 每个方案都包含详细的示例代码和最佳实践。
          </p>
          <Link
            to='/css-modules'
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
          >
            开始学习
            <ArrowRight className='w-4 h-4 ml-2' />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
