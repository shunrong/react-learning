import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Timer,
  ExternalLink,
  BookOpen,
  CheckCircle,
  Lightbulb,
  Target,
  Code,
  Monitor,
  Zap,
  TrendingUp,
  Settings,
  Users,
} from 'lucide-react';

// 最佳实践分类
const practiceCategories = [
  {
    id: 'development',
    name: '开发阶段',
    icon: Code,
    color: 'blue',
    practices: [
      {
        title: '组件设计原则',
        level: 'high',
        description: '遵循单一职责原则，保持组件简单和可重用',
        tips: [
          '每个组件只做一件事',
          '避免过度抽象和复杂的 props 接口',
          '合理使用组合而非继承',
          '保持组件的纯函数特性',
        ],
        antiPattern: '创建过于复杂、包含多种职责的大组件',
        bestPractice: '拆分成多个小组件，每个组件专注于单一功能',
      },
      {
        title: 'Hooks 使用规范',
        level: 'high',
        description: '正确使用 React Hooks，避免常见陷阱',
        tips: [
          '遵循 Hooks 调用规则，不在条件语句中使用',
          '合理设置依赖数组，避免无限循环',
          '使用 ESLint 规则检查 Hook 使用',
          '自定义 Hook 提取复用逻辑',
        ],
        antiPattern: 'useEffect 依赖数组不完整，导致 bug 或性能问题',
        bestPractice: '使用 eslint-plugin-react-hooks 自动检查依赖',
      },
      {
        title: '状态管理策略',
        level: 'medium',
        description: '选择合适的状态管理方案',
        tips: [
          '本地状态优先，避免过度全局化',
          '复杂状态使用 useReducer',
          '跨组件状态考虑 Context 或状态库',
          '区分服务端状态和客户端状态',
        ],
        antiPattern: '所有状态都放在全局，导致不必要的重渲染',
        bestPractice: '就近管理状态，只在需要时提升状态层级',
      },
    ],
  },
  {
    id: 'performance',
    name: '性能优化',
    icon: Zap,
    color: 'green',
    practices: [
      {
        title: '渲染优化',
        level: 'high',
        description: '减少不必要的重渲染，提升组件性能',
        tips: [
          '使用 React.memo 包装纯组件',
          'useMemo 缓存昂贵计算',
          'useCallback 缓存函数引用',
          '避免在渲染中创建对象和函数',
        ],
        antiPattern: '每次渲染都创建新的对象作为 props 传递',
        bestPractice: '将静态值提取到组件外部或使用 useMemo 缓存',
      },
      {
        title: '代码分割',
        level: 'medium',
        description: '按需加载代码，减少初始包大小',
        tips: [
          '路由级别的懒加载',
          '大型组件按需导入',
          '第三方库按需引入',
          '合理设置代码分割粒度',
        ],
        antiPattern: '一次性加载所有代码，导致首屏时间过长',
        bestPractice: '使用 React.lazy 和动态 import 实现代码分割',
      },
      {
        title: '内存管理',
        level: 'high',
        description: '防止内存泄漏，确保应用稳定性',
        tips: [
          '清理事件监听器',
          '取消未完成的网络请求',
          '清理定时器和间隔器',
          '避免闭包陷阱',
        ],
        antiPattern: '组件卸载时未清理副作用，导致内存泄漏',
        bestPractice: '在 useEffect 返回清理函数，使用 AbortController',
      },
    ],
  },
  {
    id: 'production',
    name: '生产环境',
    icon: Monitor,
    color: 'purple',
    practices: [
      {
        title: '构建优化',
        level: 'high',
        description: '优化生产环境构建配置',
        tips: [
          '启用生产模式构建',
          '配置合适的代码压缩',
          '使用 Tree Shaking 移除死代码',
          '优化图片和静态资源',
        ],
        antiPattern: '生产环境使用开发模式构建',
        bestPractice: '配置专门的生产环境构建流程和优化',
      },
      {
        title: '性能监控',
        level: 'medium',
        description: '建立完善的性能监控体系',
        tips: [
          '监控 Core Web Vitals',
          '设置性能预算',
          '定期性能测试',
          '用户体验监控',
        ],
        antiPattern: '没有性能监控，问题发现滞后',
        bestPractice: '使用 Web Vitals 和 APM 工具持续监控',
      },
      {
        title: '错误处理',
        level: 'high',
        description: '完善的错误处理和恢复机制',
        tips: [
          '使用 Error Boundary 捕获错误',
          '优雅的错误降级',
          '错误上报和监控',
          '提供重试机制',
        ],
        antiPattern: '未处理的错误导致整个应用崩溃',
        bestPractice: '在关键边界设置 Error Boundary，提供错误恢复',
      },
    ],
  },
  {
    id: 'team',
    name: '团队协作',
    icon: Users,
    color: 'orange',
    practices: [
      {
        title: '代码规范',
        level: 'high',
        description: '统一的代码风格和规范',
        tips: [
          '使用 ESLint 和 Prettier',
          '统一的命名约定',
          '组件和文件组织规范',
          'TypeScript 类型定义',
        ],
        antiPattern: '团队成员使用不同的代码风格',
        bestPractice: '建立统一的代码规范和自动化检查',
      },
      {
        title: '文档规范',
        level: 'medium',
        description: '完善的文档和注释体系',
        tips: [
          'README 文档完善',
          '组件 API 文档',
          '代码注释规范',
          '架构决策记录',
        ],
        antiPattern: '缺乏文档，新人难以上手',
        bestPractice: '使用 JSDoc、Storybook 等工具维护文档',
      },
      {
        title: '测试策略',
        level: 'medium',
        description: '合理的测试覆盖和策略',
        tips: [
          '单元测试覆盖核心逻辑',
          '集成测试验证业务流程',
          'E2E 测试关键用户路径',
          '性能回归测试',
        ],
        antiPattern: '没有测试或测试覆盖不足',
        bestPractice: '建立分层测试策略，自动化测试流程',
      },
    ],
  },
];

// 性能检查清单
const performanceChecklist = [
  {
    category: '渲染性能',
    items: [
      { text: '使用 React.memo 包装纯组件', checked: true },
      { text: '使用 useMemo 缓存昂贵计算', checked: true },
      { text: '使用 useCallback 缓存函数引用', checked: true },
      { text: '避免在渲染中创建对象和函数', checked: false },
      { text: '正确使用 key 属性', checked: true },
      { text: '避免深层嵌套的组件结构', checked: false },
    ],
  },
  {
    category: '内存管理',
    items: [
      { text: '清理事件监听器', checked: true },
      { text: '清理定时器和间隔器', checked: true },
      { text: '取消未完成的网络请求', checked: false },
      { text: '避免闭包内存泄漏', checked: true },
      { text: '使用 WeakMap 和 WeakSet', checked: false },
    ],
  },
  {
    category: '代码分割',
    items: [
      { text: '路由级别代码分割', checked: true },
      { text: '组件级别懒加载', checked: false },
      { text: '第三方库按需导入', checked: true },
      { text: '智能预加载策略', checked: false },
    ],
  },
  {
    category: '构建优化',
    items: [
      { text: '生产环境构建配置', checked: true },
      { text: 'Tree Shaking 配置', checked: true },
      { text: '代码压缩和混淆', checked: true },
      { text: '静态资源优化', checked: false },
      { text: 'Bundle 分析和优化', checked: false },
    ],
  },
];

// 实践卡片组件
function PracticeCard({ practice }: { practice: any }) {
  const [expanded, setExpanded] = useState(false);

  const levelColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  const levelLabels = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-4'>
        <div>
          <h4 className='text-lg font-semibold text-gray-900 mb-2'>
            {practice.title}
          </h4>
          <p className='text-sm text-gray-600 mb-3'>{practice.description}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded border ${levelColors[practice.level as keyof typeof levelColors]}`}
        >
          {levelLabels[practice.level as keyof typeof levelLabels]}
        </span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className='flex items-center text-sm text-performance-600 hover:text-performance-700 font-medium mb-4'
      >
        <Settings className='w-4 h-4 mr-1' />
        {expanded ? '收起详情' : '查看详情'}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-4'
        >
          <div>
            <h5 className='text-sm font-medium text-gray-900 mb-2 flex items-center'>
              <CheckCircle className='w-4 h-4 text-green-600 mr-1' />
              最佳实践
            </h5>
            <ul className='space-y-1'>
              {practice.tips.map((tip: string, index: number) => (
                <li
                  key={index}
                  className='text-sm text-gray-600 flex items-start'
                >
                  <span className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0'></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-3 bg-red-50 border border-red-200 rounded'>
              <div className='flex items-center text-sm font-medium text-red-800 mb-2'>
                <span className='w-4 h-4 mr-1 text-red-600'>❌</span>
                反模式
              </div>
              <p className='text-sm text-red-700'>{practice.antiPattern}</p>
            </div>

            <div className='p-3 bg-green-50 border border-green-200 rounded'>
              <div className='flex items-center text-sm font-medium text-green-800 mb-2'>
                <CheckCircle className='w-4 h-4 mr-1' />
                推荐做法
              </div>
              <p className='text-sm text-green-700'>{practice.bestPractice}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function BestPractices() {
  const [activeCategory, setActiveCategory] = useState('development');
  const [checklistProgress] = useState(() => {
    const total = performanceChecklist.reduce(
      (sum, cat) => sum + cat.items.length,
      0
    );
    const checked = performanceChecklist.reduce(
      (sum, cat) => sum + cat.items.filter(item => item.checked).length,
      0
    );
    return Math.round((checked / total) * 100);
  });

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
          <Timer className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          性能优化最佳实践
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          企业级 React 应用性能优化的完整指南和最佳实践
        </p>

        <div className='mt-8'>
          <a
            href='/docs/concepts/performance'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-performance-600 text-white rounded-lg hover:bg-performance-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看最佳实践理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 分类导航 */}
      <div className='performance-card mb-8'>
        <div className='flex flex-wrap gap-2'>
          {practiceCategories.map(category => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? `bg-${category.color}-600 text-white`
                    : `bg-${category.color}-50 text-${category.color}-700 hover:bg-${category.color}-100`
                }`}
              >
                <Icon className='w-4 h-4 mr-2' />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 最佳实践内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='mb-8'
      >
        {practiceCategories.map(
          category =>
            activeCategory === category.id && (
              <div key={category.id}>
                <div className='flex items-center mb-6'>
                  <category.icon
                    className={`w-6 h-6 text-${category.color}-600 mr-3`}
                  />
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {category.name}最佳实践
                  </h2>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {category.practices.map((practice, index) => (
                    <PracticeCard key={index} practice={practice} />
                  ))}
                </div>
              </div>
            )
        )}
      </motion.div>

      {/* 性能检查清单 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='performance-card mb-8'
      >
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-xl font-bold text-gray-900 flex items-center'>
            <Target className='w-5 h-5 mr-2 text-performance-600' />
            性能优化检查清单
          </h3>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>完成度:</span>
            <span className='text-lg font-bold text-performance-600'>
              {checklistProgress}%
            </span>
            <div className='w-20 bg-gray-200 rounded-full h-2'>
              <div
                className='bg-performance-600 h-2 rounded-full transition-all duration-300'
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {performanceChecklist.map((category, catIndex) => (
            <div key={catIndex} className='bg-gray-50 rounded-lg p-4'>
              <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                {category.category}
              </h4>
              <div className='space-y-3'>
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className='flex items-center'>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                        item.checked
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {item.checked && (
                        <CheckCircle className='w-3 h-3 text-white' />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        item.checked ? 'text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 性能优化路线图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='performance-card'
      >
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <TrendingUp className='w-5 h-5 mr-2 text-performance-600' />
          性能优化实施路线图
        </h3>

        <div className='space-y-6'>
          <div className='flex items-start'>
            <div className='flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4'>
              1
            </div>
            <div className='flex-1'>
              <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                基础优化 (第1-2周)
              </h4>
              <p className='text-gray-600 mb-3'>
                建立性能优化基础，解决最明显的性能问题
              </p>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded'>
                  React.memo
                </span>
                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded'>
                  useMemo
                </span>
                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded'>
                  useCallback
                </span>
                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded'>
                  Key 优化
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-start'>
            <div className='flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4'>
              2
            </div>
            <div className='flex-1'>
              <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                高级优化 (第3-4周)
              </h4>
              <p className='text-gray-600 mb-3'>实施更深层次的性能优化策略</p>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
                <span className='px-2 py-1 bg-green-100 text-green-800 rounded'>
                  代码分割
                </span>
                <span className='px-2 py-1 bg-green-100 text-green-800 rounded'>
                  虚拟化
                </span>
                <span className='px-2 py-1 bg-green-100 text-green-800 rounded'>
                  预加载
                </span>
                <span className='px-2 py-1 bg-green-100 text-green-800 rounded'>
                  内存优化
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-start'>
            <div className='flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4'>
              3
            </div>
            <div className='flex-1'>
              <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                监控与持续优化 (第5-6周)
              </h4>
              <p className='text-gray-600 mb-3'>
                建立监控体系，持续跟踪和优化性能
              </p>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
                <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded'>
                  性能监控
                </span>
                <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded'>
                  自动化测试
                </span>
                <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded'>
                  CI/CD集成
                </span>
                <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded'>
                  持续优化
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg'>
          <div className='flex items-start'>
            <Lightbulb className='w-5 h-5 text-indigo-600 mr-2 mt-0.5' />
            <div>
              <div className='text-sm font-medium text-indigo-800 mb-1'>
                专家建议
              </div>
              <div className='text-sm text-indigo-700'>
                性能优化是一个渐进的过程，不要试图一次性解决所有问题。
                从影响最大的优化开始，建立度量基线，然后逐步改进。
                记住：过早的优化是万恶之源，但合理的优化是必要的。
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
