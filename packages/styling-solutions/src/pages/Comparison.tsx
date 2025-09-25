import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Palette,
  Zap,
  Wind,
  BarChart3,
  CheckCircle,
  XCircle,
  Code,
  Package,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

const stylingMethods = [
  {
    name: 'CSS Modules',
    icon: FileText,
    color: 'green',
    description: '通过模块化 CSS 实现作用域隔离，编译时处理样式',
    bundleSize: '0kb (编译时)',
    runtimePerformance: 'high',
    learningCurve: 'easy',
    pros: [
      '零运行时开销，性能最佳',
      '自动作用域隔离，避免样式冲突', 
      '保持传统 CSS 语法，学习成本低',
      '与现有 CSS 工具链兼容'
    ],
    cons: [
      '动态样式支持有限',
      '主题切换相对复杂',
      '需要额外的构建配置'
    ],
    useCases: [
      '传统企业级应用',
      '性能要求极高的项目',
      '大型团队协作项目'
    ]
  },
  {
    name: 'Styled Components',
    icon: Palette,
    color: 'pink',
    description: '最流行的 CSS-in-JS 解决方案，提供组件级样式封装',
    bundleSize: '~15kb gzipped',
    runtimePerformance: 'medium',
    learningCurve: 'medium',
    pros: [
      '强大的动态样式支持',
      '组件级样式封装',
      '内置主题系统',
      '活跃的社区支持'
    ],
    cons: [
      '运行时性能开销',
      '增加包体积',
      '服务端渲染复杂'
    ],
    useCases: [
      '中小型React应用',
      '需要动态主题的项目',
      '组件库开发'
    ]
  },
  {
    name: 'Emotion',
    icon: Zap,
    color: 'yellow',
    description: '高性能的 CSS-in-JS 库，更好的 TypeScript 支持',
    bundleSize: '~7kb gzipped',
    runtimePerformance: 'high',
    learningCurve: 'medium',
    pros: [
      '优秀的性能表现',
      '强大的TypeScript支持',
      '灵活的API设计',
      '更小的包体积'
    ],
    cons: [
      '相对较新，生态不如Styled Components',
      '某些高级特性需要配置',
      '文档相对较少'
    ],
    useCases: [
      'TypeScript项目',
      '性能敏感应用',
      '现代React应用'
    ]
  },
  {
    name: 'Tailwind CSS',
    icon: Wind,
    color: 'cyan',
    description: '实用优先的 CSS 框架，通过预定义类快速构建界面',
    bundleSize: '~10kb (purged)',
    runtimePerformance: 'high',
    learningCurve: 'medium',
    pros: [
      '极快的开发速度',
      '一致的设计系统',
      '优秀的响应式支持',
      '零运行时开销'
    ],
    cons: [
      'HTML类名冗长',
      '初期学习成本',
      '设计灵活性受限'
    ],
    useCases: [
      '快速原型开发',
      '设计系统项目',
      '响应式应用'
    ]
  }
];

function getRatingIcon(rating: string) {
  switch (rating) {
    case 'high':
    case 'easy':
      return <TrendingUp className='w-4 h-4 text-green-500' />;
    case 'medium':
      return <Minus className='w-4 h-4 text-yellow-500' />;
    case 'low':
    case 'hard':
      return <TrendingDown className='w-4 h-4 text-red-500' />;
    default:
      return <Minus className='w-4 h-4 text-gray-500' />;
  }
}

export default function Comparison() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6'>
          <BookOpen className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          样式方案全面对比
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          深入分析四种主流 React 样式解决方案的优缺点、性能表现和适用场景
        </p>
      </motion.div>

      {/* 选项卡 */}
      <div className='flex justify-center mb-8'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-1'>
          {[
            { id: 'overview', label: '概览对比', icon: BarChart3 },
            { id: 'detailed', label: '详细分析', icon: BookOpen },
            { id: 'recommendations', label: '选择建议', icon: CheckCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className='w-4 h-4' />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 概览对比 */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='space-y-8'
        >
          {/* 方案卡片 */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {stylingMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                    selectedMethod === method.name
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(selectedMethod === method.name ? null : method.name)}
                >
                  <div className='flex items-center mb-4'>
                    <div className={`w-12 h-12 bg-gradient-to-br from-${method.color}-400 to-${method.color}-600 rounded-xl flex items-center justify-center mr-3`}>
                      <Icon className='w-6 h-6 text-white' />
                    </div>
                    <h3 className='font-semibold text-gray-900'>{method.name}</h3>
                  </div>
                  
                  <p className='text-gray-600 text-sm mb-4 leading-relaxed'>
                    {method.description}
                  </p>
                  
                  {/* 核心指标 */}
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>包体积</span>
                      <span className='font-medium'>{method.bundleSize}</span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>运行时性能</span>
                      <div className='flex items-center'>
                        {getRatingIcon(method.runtimePerformance)}
                        <span className='ml-1 font-medium capitalize'>{method.runtimePerformance}</span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>学习成本</span>
                      <div className='flex items-center'>
                        {getRatingIcon(method.learningCurve)}
                        <span className='ml-1 font-medium capitalize'>{method.learningCurve}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 选中方案的详细信息 */}
          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden'
            >
              {stylingMethods
                .filter(method => method.name === selectedMethod)
                .map(method => (
                  <div key={method.name} className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                      <div>
                        <h4 className='text-lg font-semibold text-green-600 mb-3'>✅ 优势</h4>
                        <ul className='space-y-2'>
                          {method.pros.map((pro, idx) => (
                            <li key={idx} className='flex items-start text-sm text-gray-700'>
                              <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                              {pro}
                            </li>
                          ))}
                        </ul>
                        
                        <h4 className='text-lg font-semibold text-blue-600 mb-3 mt-6'>🎯 适用场景</h4>
                        <ul className='space-y-2'>
                          {method.useCases.map((useCase, idx) => (
                            <li key={idx} className='flex items-start text-sm text-gray-700'>
                              <ArrowRight className='w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0' />
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className='text-lg font-semibold text-red-600 mb-3'>❌ 劣势</h4>
                        <ul className='space-y-2'>
                          {method.cons.map((con, idx) => (
                            <li key={idx} className='flex items-start text-sm text-gray-700'>
                              <XCircle className='w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0' />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 详细分析 */}
      {activeTab === 'detailed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='space-y-8'
        >
          {/* 性能对比图表 */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>性能对比分析</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {[
                { metric: '包体积', icon: Package },
                { metric: '运行时性能', icon: Zap },
                { metric: '学习成本', icon: Code }
              ].map((item) => (
                <div key={item.metric} className='space-y-4'>
                  <div className='flex items-center'>
                    <item.icon className='w-5 h-5 text-indigo-600 mr-2' />
                    <h3 className='font-semibold text-gray-900'>{item.metric}</h3>
                  </div>
                  
                  <div className='space-y-3'>
                    {stylingMethods.map((method) => {
                      let value: string;
                      if (item.metric === '包体积') {
                        value = method.bundleSize;
                      } else if (item.metric === '运行时性能') {
                        value = method.runtimePerformance;
                      } else {
                        value = method.learningCurve;
                      }
                      
                      return (
                        <div key={method.name} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                          <span className='text-sm font-medium text-gray-900'>
                            {method.name}
                          </span>
                          <div className='flex items-center'>
                            {item.metric !== '包体积' && getRatingIcon(value)}
                            <span className='ml-1 text-sm font-medium'>
                              {value}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 功能对比表 */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='p-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>功能对比表</h2>
            </div>
            
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      功能特性
                    </th>
                    {stylingMethods.map(method => (
                      <th key={method.name} className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        {method.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {[
                    {
                      feature: '作用域隔离',
                      values: ['✅ 自动', '✅ 自动', '✅ 自动', '❌ 无']
                    },
                    {
                      feature: '动态样式',
                      values: ['⚠️ 有限', '✅ 强大', '✅ 强大', '⚠️ 有限']
                    },
                    {
                      feature: '主题支持',
                      values: ['⚠️ 复杂', '✅ 内置', '✅ 内置', '✅ 配置']
                    },
                    {
                      feature: 'TypeScript',
                      values: ['⚠️ 基础', '✅ 良好', '✅ 优秀', '⚠️ 基础']
                    },
                    {
                      feature: 'SSR支持',
                      values: ['✅ 原生', '⚠️ 需配置', '⚠️ 需配置', '✅ 原生']
                    }
                  ].map((row, index) => (
                    <tr key={row.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {row.feature}
                      </td>
                      {row.values.map((value, idx) => (
                        <td key={idx} className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* 选择建议 */}
      {activeTab === 'recommendations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='space-y-8'
        >
          {/* 项目类型推荐 */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-8'>根据项目类型选择</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-6'>
                <div className='border-l-4 border-green-500 pl-4'>
                  <h3 className='font-semibold text-gray-900'>企业级应用</h3>
                  <p className='text-sm text-gray-600 mb-2'>大型、长期维护的项目</p>
                  <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                    推荐：CSS Modules
                  </span>
                </div>
                
                <div className='border-l-4 border-cyan-500 pl-4'>
                  <h3 className='font-semibold text-gray-900'>快速原型</h3>
                  <p className='text-sm text-gray-600 mb-2'>MVP 或快速迭代项目</p>
                  <span className='text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded'>
                    推荐：Tailwind CSS
                  </span>
                </div>
              </div>
              
              <div className='space-y-6'>
                <div className='border-l-4 border-blue-500 pl-4'>
                  <h3 className='font-semibold text-gray-900'>中型 React 应用</h3>
                  <p className='text-sm text-gray-600 mb-2'>需要动态样式和主题</p>
                  <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                    推荐：Styled Components / Emotion
                  </span>
                </div>
                
                <div className='border-l-4 border-purple-500 pl-4'>
                  <h3 className='font-semibold text-gray-900'>组件库</h3>
                  <p className='text-sm text-gray-600 mb-2'>需要发布的组件库</p>
                  <span className='text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded'>
                    推荐：Emotion
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2024年推荐 */}
          <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200'>
            <div className='text-center mb-8'>
              <TrendingUp className='w-12 h-12 text-indigo-600 mx-auto mb-4' />
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                2024 年推荐排序
              </h3>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <h4 className='font-semibold text-gray-900 mb-4'>推荐排序</h4>
                <ol className='space-y-3'>
                  {[
                    { name: 'Tailwind CSS', reason: '快速开发，设计一致性' },
                    { name: 'Emotion', reason: '现代 CSS-in-JS，TypeScript 友好' },
                    { name: 'CSS Modules', reason: '稳定可靠，零运行时' },
                    { name: 'Styled Components', reason: '成熟生态，社区支持' }
                  ].map((item, index) => (
                    <li key={item.name} className='flex items-center'>
                      <span className='w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm mr-4'>
                        {index + 1}
                      </span>
                      <div>
                        <strong className='text-gray-900'>{item.name}</strong>
                        <p className='text-sm text-gray-600'>{item.reason}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h4 className='font-semibold text-gray-900 mb-4'>选择原则</h4>
                <ul className='space-y-3'>
                  {[
                    '优先考虑团队经验和项目需求',
                    '新项目优先选择现代方案',
                    '性能敏感项目选择零运行时方案',
                    '可以在同一项目中混合使用多种方案'
                  ].map((principle, idx) => (
                    <li key={idx} className='flex items-start'>
                      <CheckCircle className='w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0' />
                      <span className='text-gray-700'>{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
