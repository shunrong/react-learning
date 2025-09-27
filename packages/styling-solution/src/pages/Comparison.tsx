import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Palette,
  Zap,
  Wind,
  BarChart3,
  ExternalLink,
  Eye,
  Monitor,
  Smartphone,
  Timer,
  ArrowRight,
  Play,
  Pause,
} from 'lucide-react';

const stylingMethods = [
  {
    id: 'css-modules',
    name: 'CSS Modules',
    icon: FileText,
    color: 'bg-green-500',
    borderColor: 'border-green-500',
    textColor: 'text-green-600',
    bgLight: 'bg-green-50',
    description: '模块化CSS，编译时隔离',
    syntax: '.button_abc123',
    bundleSize: '0KB',
    performance: 95,
    popularity: 85,
  },
  {
    id: 'styled-components',
    name: 'Styled Components',
    icon: Palette,
    color: 'bg-pink-500',
    borderColor: 'border-pink-500',
    textColor: 'text-pink-600',
    bgLight: 'bg-pink-50',
    description: 'CSS-in-JS，动态样式',
    syntax: 'styled.button`...`',
    bundleSize: '15KB',
    performance: 75,
    popularity: 90,
  },
  {
    id: 'emotion',
    name: 'Emotion',
    icon: Zap,
    color: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-600',
    bgLight: 'bg-yellow-50',
    description: '高性能CSS-in-JS',
    syntax: 'css={{ ... }}',
    bundleSize: '7KB',
    performance: 85,
    popularity: 70,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: Wind,
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-600',
    bgLight: 'bg-cyan-50',
    description: '原子化CSS框架',
    syntax: 'bg-blue-500 text-white',
    bundleSize: '可变',
    performance: 95,
    popularity: 95,
  },
];

export default function Comparison() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState('button');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const demos = [
    { id: 'button', name: '按钮组件', icon: Monitor },
    { id: 'card', name: '卡片组件', icon: Eye },
    { id: 'form', name: '表单组件', icon: Smartphone },
    { id: 'responsive', name: '响应式布局', icon: Timer },
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
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-6'>
          <BarChart3 className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>实时效果对比</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          并排对比四种样式方案的实际渲染效果，直观感受差异与特点
        </p>

        {/* 理论文档链接 */}
        <div className='mt-8'>
          <a
            href='/docs/concepts/styling'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            查看深度理论分析
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 对比控制面板 */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
        <div className='flex flex-wrap gap-4 items-center justify-between mb-4'>
          <div className='flex items-center gap-4'>
            <span className='text-sm font-medium text-gray-700'>演示组件:</span>
            <div className='flex gap-2'>
              {demos.map(demo => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeDemo === demo.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                    {demo.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-gray-700'>主题:</span>
              <select
                value={currentTheme}
                onChange={e => setCurrentTheme(e.target.value)}
                className='px-3 py-1 border border-gray-300 rounded-md text-sm'
              >
                <option value='light'>浅色</option>
                <option value='dark'>深色</option>
                <option value='colorful'>彩色</option>
              </select>
            </div>

            <button
              onClick={toggleAnimation}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isAnimating
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {isAnimating ? (
                <Pause className='w-4 h-4' />
              ) : (
                <Play className='w-4 h-4' />
              )}
              {isAnimating ? '停止动画' : '启动动画'}
            </button>
          </div>
        </div>
      </div>

      {/* 实时对比展示 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
        {stylingMethods.map((method, index) => {
          const Icon = method.icon;

          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 overflow-hidden ${
                selectedMethod === method.id
                  ? `${method.borderColor} shadow-lg`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() =>
                setSelectedMethod(
                  selectedMethod === method.id ? null : method.id
                )
              }
            >
              {/* 方案标题 */}
              <div className={`${method.bgLight} p-4 border-b border-gray-100`}>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className='w-5 h-5 text-white' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {method.name}
                      </h3>
                      <p className='text-xs text-gray-500'>
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='mt-3 text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded'>
                  {method.syntax}
                </div>
              </div>

              {/* 实时演示区域 */}
              <div className='p-4'>
                {activeDemo === 'button' && (
                  <div className='space-y-3'>
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                        method.id === 'css-modules'
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : method.id === 'styled-components'
                            ? 'bg-pink-500 hover:bg-pink-600 text-white'
                            : method.id === 'emotion'
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      } ${isAnimating ? 'animate-pulse' : ''}`}
                    >
                      {method.name}
                    </button>

                    <button
                      className={`w-full py-2 px-4 rounded-lg font-medium border-2 transition-all duration-300 ${
                        method.id === 'css-modules'
                          ? 'border-green-500 text-green-600 hover:bg-green-50'
                          : method.id === 'styled-components'
                            ? 'border-pink-500 text-pink-600 hover:bg-pink-50'
                            : method.id === 'emotion'
                              ? 'border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                              : 'border-cyan-500 text-cyan-600 hover:bg-cyan-50'
                      } ${isAnimating ? 'animate-bounce' : ''}`}
                    >
                      Outline
                    </button>
                  </div>
                )}

                {activeDemo === 'card' && (
                  <div
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      method.id === 'css-modules'
                        ? 'border-green-200 bg-green-50'
                        : method.id === 'styled-components'
                          ? 'border-pink-200 bg-pink-50'
                          : method.id === 'emotion'
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-cyan-200 bg-cyan-50'
                    } ${isAnimating ? 'transform scale-105' : ''}`}
                  >
                    <h4 className='font-semibold text-gray-900 mb-2'>
                      Card Title
                    </h4>
                    <p className='text-sm text-gray-600'>
                      这是一个使用 {method.name} 实现的卡片组件。
                    </p>
                  </div>
                )}

                {activeDemo === 'form' && (
                  <div className='space-y-3'>
                    <input
                      type='text'
                      placeholder='输入文本'
                      className={`w-full p-2 border rounded-lg transition-all duration-300 ${
                        method.id === 'css-modules'
                          ? 'border-green-300 focus:border-green-500'
                          : method.id === 'styled-components'
                            ? 'border-pink-300 focus:border-pink-500'
                            : method.id === 'emotion'
                              ? 'border-yellow-300 focus:border-yellow-500'
                              : 'border-cyan-300 focus:border-cyan-500'
                      } ${isAnimating ? 'animate-pulse' : ''}`}
                    />

                    <select
                      className={`w-full p-2 border rounded-lg transition-all duration-300 ${
                        method.id === 'css-modules'
                          ? 'border-green-300'
                          : method.id === 'styled-components'
                            ? 'border-pink-300'
                            : method.id === 'emotion'
                              ? 'border-yellow-300'
                              : 'border-cyan-300'
                      }`}
                    >
                      <option>选择选项</option>
                      <option>选项 1</option>
                      <option>选项 2</option>
                    </select>
                  </div>
                )}

                {activeDemo === 'responsive' && (
                  <div className='grid grid-cols-2 gap-2'>
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-12 rounded transition-all duration-300 ${
                          method.id === 'css-modules'
                            ? 'bg-green-200'
                            : method.id === 'styled-components'
                              ? 'bg-pink-200'
                              : method.id === 'emotion'
                                ? 'bg-yellow-200'
                                : 'bg-cyan-200'
                        } ${isAnimating ? 'animate-ping' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 性能指标 */}
              <div className='border-t border-gray-100 p-4'>
                <div className='grid grid-cols-3 gap-2 text-xs'>
                  <div className='text-center'>
                    <div className='text-gray-500'>包大小</div>
                    <div className='font-semibold'>{method.bundleSize}</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-gray-500'>性能</div>
                    <div className='font-semibold'>{method.performance}%</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-gray-500'>流行度</div>
                    <div className='font-semibold'>{method.popularity}%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 详细对比表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'
      >
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>快速对比表</h2>
          <p className='text-gray-600'>关键指标一目了然</p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  方案
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  语法特点
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  包大小
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  运行时性能
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  学习成本
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  动态样式
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {stylingMethods.map(method => {
                const Icon = method.icon;
                return (
                  <tr key={method.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`w-8 h-8 ${method.color} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className='w-4 h-4 text-white' />
                        </div>
                        <div>
                          <div className='font-medium text-gray-900'>
                            {method.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <code className='text-sm bg-gray-100 px-2 py-1 rounded'>
                        {method.syntax}
                      </code>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      {method.bundleSize}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div className='w-16 bg-gray-200 rounded-full h-2'>
                          <div
                            className={`h-2 rounded-full ${method.color}`}
                            style={{ width: `${method.performance}%` }}
                          />
                        </div>
                        <span className='text-sm text-gray-600'>
                          {method.performance}%
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          method.performance > 90
                            ? 'bg-green-100 text-green-800'
                            : method.performance > 80
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {method.performance > 90
                          ? '容易'
                          : method.performance > 80
                            ? '中等'
                            : '困难'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          method.id === 'css-modules'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {method.id === 'css-modules' ? '有限' : '强大'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 底部链接 */}
      <div className='mt-8 text-center'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {stylingMethods.map(method => (
            <a
              key={method.id}
              href={`/${method.id.replace('-', '-')}`}
              className={`group p-4 bg-white rounded-lg border-2 border-gray-200 hover:${method.borderColor} transition-colors`}
            >
              <div className='flex items-center justify-center mb-2'>
                <method.icon className={`w-6 h-6 ${method.textColor}`} />
              </div>
              <div className='text-sm font-medium text-gray-900 mb-1'>
                {method.name}
              </div>
              <div className='text-xs text-gray-500 mb-2'>详细演示</div>
              <div className='flex items-center justify-center text-blue-600 text-sm font-medium'>
                <span>查看演示</span>
                <ArrowRight className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
