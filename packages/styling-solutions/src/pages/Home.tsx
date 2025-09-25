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
  ExternalLink,
  Play,
} from 'lucide-react';

const stylingDemos = [
  {
    name: 'CSS Modules',
    description: '模块化CSS，编译时作用域隔离',
    href: '/css-modules',
    icon: FileText,
    color: 'from-green-400 to-blue-500',
    preview: 'button_abc123', // 示例类名
  },
  {
    name: 'Styled Components',
    description: 'CSS-in-JS，动态主题与样式',
    href: '/styled-components',
    icon: Palette,
    color: 'from-pink-400 to-red-500',
    preview: 'styled.button`...`',
  },
  {
    name: 'Emotion',
    description: '高性能CSS-in-JS，css prop',
    href: '/emotion',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    preview: 'css={{ color: "blue" }}',
  },
  {
    name: 'Tailwind CSS',
    description: '原子化CSS，快速构建界面',
    href: '/tailwind',
    icon: Wind,
    color: 'from-cyan-400 to-blue-500',
    preview: 'bg-blue-500 text-white',
  },
];

const quickActions = [
  {
    name: '效果对比',
    description: '并排对比四种方案的视觉效果',
    href: '/comparison',
    icon: BarChart3,
    color: 'bg-purple-500',
  },
  {
    name: '性能测试',
    description: '实时性能监控和测试结果',
    href: '/performance',
    icon: Play,
    color: 'bg-orange-500',
  },
  {
    name: '理论文档',
    description: '深入了解样式方案的技术原理',
    href: '/docs/concepts/styling',
    icon: ExternalLink,
    color: 'bg-blue-500',
    external: true,
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
          React 样式方案实战演示
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          通过交互式演示和实时对比，直观体验四种主流样式解决方案的特点和差异
        </p>
        <div className='mt-8 flex justify-center'>
          <Link
            to='/docs/concepts/styling'
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看理论文档
            <ExternalLink className='w-4 h-4 ml-2' />
          </Link>
        </div>
      </motion.div>

      {/* 样式方案演示卡片 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'
      >
        {stylingDemos.map((demo, index) => {
          const Icon = demo.icon;
          return (
            <motion.div
              key={demo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='group'
            >
              <Link to={demo.href}>
                <div className='relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 group-hover:border-gray-300'>
                  {/* 背景渐变 */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${demo.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`}
                  />

                  {/* 图标 */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${demo.color} rounded-xl mb-6`}
                  >
                    <Icon className='w-6 h-6 text-white' />
                  </div>

                  {/* 标题和描述 */}
                  <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
                    {demo.name}
                  </h3>
                  <p className='text-gray-600 mb-6 leading-relaxed'>
                    {demo.description}
                  </p>

                  {/* 代码预览 */}
                  <div className='bg-gray-50 rounded-lg p-4 mb-6 font-mono text-sm text-gray-700 border'>
                    <div className='text-gray-500 mb-1'>// 示例语法</div>
                    <div className='text-blue-600'>{demo.preview}</div>
                  </div>

                  {/* 查看详情 */}
                  <div className='flex items-center text-blue-600 group-hover:text-blue-700 font-medium'>
                    <span>查看演示</span>
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 快速操作 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mb-16'
      >
        <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          快速体验
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isExternal = action.external;

            const content = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group h-full'
              >
                <div className='flex items-start mb-4'>
                  <div className='flex-shrink-0'>
                    <div
                      className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className='w-6 h-6 text-white' />
                    </div>
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
                      {action.name}
                    </h3>
                    <p className='text-gray-600 mt-1 leading-relaxed'>
                      {action.description}
                    </p>
                  </div>
                </div>
                <div className='flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors'>
                  <span>{isExternal ? '查看文档' : '立即体验'}</span>
                  <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                </div>
              </motion.div>
            );

            return isExternal ? (
              <a
                key={action.name}
                href={action.href}
                target='_blank'
                rel='noopener noreferrer'
                className='block'
              >
                {content}
              </a>
            ) : (
              <Link key={action.name} to={action.href} className='block'>
                {content}
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* 实时预览演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8'
      >
        <div className='text-center mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>
            四种方案，一目了然
          </h3>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            相同的效果，不同的实现方式，选择最适合你的技术栈
          </p>
        </div>

        {/* 实时按钮演示 */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <div className='text-xs text-gray-500 mb-2 font-mono'>
              CSS Modules
            </div>
            <button className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-sm font-medium'>
              Button
            </button>
            <div className='text-xs text-gray-400 mt-2 font-mono'>
              .button_abc123
            </div>
          </div>

          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <div className='text-xs text-gray-500 mb-2 font-mono'>
              Styled Components
            </div>
            <button className='w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors text-sm font-medium'>
              Button
            </button>
            <div className='text-xs text-gray-400 mt-2 font-mono'>
              styled.button`...`
            </div>
          </div>

          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <div className='text-xs text-gray-500 mb-2 font-mono'>Emotion</div>
            <button className='w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors text-sm font-medium'>
              Button
            </button>
            <div className='text-xs text-gray-400 mt-2 font-mono'>
              css={`...`}
            </div>
          </div>

          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <div className='text-xs text-gray-500 mb-2 font-mono'>Tailwind</div>
            <button className='w-full bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600 transition-colors text-sm font-medium'>
              Button
            </button>
            <div className='text-xs text-gray-400 mt-2 font-mono'>
              bg-cyan-500
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            to='/comparison'
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl'
          >
            对比所有方案
            <BarChart3 className='w-4 h-4 ml-2' />
          </Link>
          <Link
            to='/performance'
            className='inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors'
          >
            性能测试
            <Play className='w-4 h-4 ml-2' />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
