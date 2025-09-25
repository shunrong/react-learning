import { motion } from 'framer-motion';
import {
  BarChart3,
  ExternalLink,
  BookOpen,
  Zap,
  Code,
  Server,
  CheckCircle,
  XCircle,
  Minus,
} from 'lucide-react';

export default function Comparison() {
  const frameworks = [
    {
      name: 'Next.js',
      icon: Zap,
      color: 'blue',
      description: 'React 生态最成熟的 SSR 框架',
      strengths: [
        '零配置开箱即用',
        '丰富的渲染模式',
        'Vercel 平台集成',
        '自动性能优化',
        '强大的生态系统'
      ],
      weaknesses: [
        '与 Vercel 绑定较深',
        '配置灵活性有限',
        '包体积相对较大',
        '某些特性有学习曲线'
      ],
      bestFor: [
        '企业级应用',
        '电商平台',
        '内容管理系统',
        '快速原型开发'
      ]
    },
    {
      name: 'Remix',
      icon: Code,
      color: 'purple',
      description: '现代 Web 标准的拥护者',
      strengths: [
        'Web 标准优先',
        '嵌套路由架构',
        '优秀的数据加载',
        '渐进增强支持',
        '多平台部署'
      ],
      weaknesses: [
        '生态相对较新',
        '学习曲线陡峭',
        '社区资源有限',
        '第三方集成需要额外工作'
      ],
      bestFor: [
        '表单密集应用',
        '后台管理系统',
        '原生 Web 体验',
        '多云部署需求'
      ]
    },
    {
      name: '自定义 SSR',
      icon: Server,
      color: 'green',
      description: '完全自主控制的解决方案',
      strengths: [
        '完全控制权',
        '极致性能优化',
        '轻量级实现',
        '深度定制能力',
        '无框架依赖'
      ],
      weaknesses: [
        '开发成本高',
        '维护负担重',
        '缺少最佳实践',
        '生态集成困难',
        '团队要求高'
      ],
      bestFor: [
        '特殊性能要求',
        '学习研究目的',
        '现有系统集成',
        '极端定制需求'
      ]
    }
  ];

  const comparisonAspects = [
    {
      aspect: '开发效率',
      nextjs: { score: 9, note: '零配置，开箱即用' },
      remix: { score: 7, note: '需要理解新概念' },
      custom: { score: 4, note: '需要大量开发工作' }
    },
    {
      aspect: '性能表现',
      nextjs: { score: 8, note: '自动优化，性能优秀' },
      remix: { score: 8, note: '数据加载优化出色' },
      custom: { score: 9, note: '可达到极致性能' }
    },
    {
      aspect: '生态丰富度',
      nextjs: { score: 10, note: '生态最为丰富' },
      remix: { score: 6, note: '生态正在快速发展' },
      custom: { score: 3, note: '需要自己实现大部分功能' }
    },
    {
      aspect: '学习成本',
      nextjs: { score: 8, note: '基于 React 开发经验' },
      remix: { score: 6, note: '需要学习新的开发模式' },
      custom: { score: 3, note: '需要深入理解 SSR 原理' }
    },
    {
      aspect: '部署灵活性',
      nextjs: { score: 7, note: 'Vercel 最佳，其他平台略复杂' },
      remix: { score: 9, note: '支持多种运行时环境' },
      custom: { score: 8, note: '完全自主控制部署' }
    },
    {
      aspect: '维护成本',
      nextjs: { score: 8, note: '框架团队持续维护' },
      remix: { score: 7, note: '社区积极，更新频繁' },
      custom: { score: 4, note: '需要团队自行维护' }
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFrameworkColor = (framework: string) => {
    switch (framework) {
      case 'nextjs': return 'text-blue-600';
      case 'remix': return 'text-purple-600';
      case 'custom': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SSR 方案对比分析
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          深入对比主流服务端渲染解决方案，帮助你做出最佳技术选型
        </p>

        <div className="mt-8">
          <a
            href="/docs/concepts/ssr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            查看 SSR 理论
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </motion.div>

      {/* 框架概览 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="ssr-card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          框架概览对比
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {frameworks.map((framework, index) => {
            const Icon = framework.icon;
            return (
              <motion.div
                key={framework.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-${framework.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 text-${framework.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {framework.name}
                  </h3>
                  <p className="text-sm text-gray-600">{framework.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    核心优势
                  </h4>
                  <div className="space-y-2">
                    {framework.strengths.map((strength, idx) => (
                      <div key={idx} className="text-sm text-gray-700 flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    主要限制
                  </h4>
                  <div className="space-y-2">
                    {framework.weaknesses.map((weakness, idx) => (
                      <div key={idx} className="text-sm text-gray-700 flex items-start">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        {weakness}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-700 mb-3">
                    适用场景
                  </h4>
                  <div className="space-y-2">
                    {framework.bestFor.map((useCase, idx) => (
                      <div key={idx} className="text-sm text-gray-700 flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        {useCase}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 详细对比表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="ssr-card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          详细评分对比
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-900">
                  对比维度
                </th>
                <th className="text-center py-4 px-4 font-semibold text-blue-600">
                  Next.js
                </th>
                <th className="text-center py-4 px-4 font-semibold text-purple-600">
                  Remix
                </th>
                <th className="text-center py-4 px-4 font-semibold text-green-600">
                  自定义 SSR
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonAspects.map((aspect, index) => (
                <tr key={aspect.aspect} className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {aspect.aspect}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-2 ${getScoreColor(aspect.nextjs.score)}`}>
                        {aspect.nextjs.score}
                      </span>
                      <span className="text-xs text-gray-500 text-center">
                        {aspect.nextjs.note}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-2 ${getScoreColor(aspect.remix.score)}`}>
                        {aspect.remix.score}
                      </span>
                      <span className="text-xs text-gray-500 text-center">
                        {aspect.remix.note}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-2 ${getScoreColor(aspect.custom.score)}`}>
                        {aspect.custom.score}
                      </span>
                      <span className="text-xs text-gray-500 text-center">
                        {aspect.custom.note}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">评分说明</h4>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">8+</span>
              <span className="text-gray-600">优秀</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs mr-2">6+</span>
              <span className="text-gray-600">良好</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs mr-2">&lt;6</span>
              <span className="text-gray-600">需要改进</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 选择建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="ssr-card"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          技术选型建议
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              选择 Next.js 当你需要：
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div>• 快速搭建生产级应用</div>
              <div>• 丰富的功能和优化</div>
              <div>• 强大的生态支持</div>
              <div>• Vercel 平台部署</div>
              <div>• 团队对 React 熟悉</div>
            </div>
            <div className="mt-4 text-xs text-blue-600">
              ✅ 推荐指数: ⭐⭐⭐⭐⭐
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">
              选择 Remix 当你需要：
            </h3>
            <div className="space-y-2 text-sm text-purple-800">
              <div>• 现代 Web 标准体验</div>
              <div>• 优秀的表单处理</div>
              <div>• 渐进增强支持</div>
              <div>• 多平台部署灵活性</div>
              <div>• 追求原生 Web 体验</div>
            </div>
            <div className="mt-4 text-xs text-purple-600">
              ✅ 推荐指数: ⭐⭐⭐⭐
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              选择自定义 SSR 当你需要：
            </h3>
            <div className="space-y-2 text-sm text-green-800">
              <div>• 极致的性能优化</div>
              <div>• 完全的控制权</div>
              <div>• 深度学习 SSR 原理</div>
              <div>• 特殊的定制需求</div>
              <div>• 与现有系统集成</div>
            </div>
            <div className="mt-4 text-xs text-green-600">
              ✅ 推荐指数: ⭐⭐⭐
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">
            💡 综合建议
          </h3>
          <div className="text-sm text-indigo-800 leading-relaxed">
            <p className="mb-3">
              <strong>初学者或时间紧张的项目</strong>：推荐 Next.js，成熟稳定，社区支持好。
            </p>
            <p className="mb-3">
              <strong>追求现代 Web 体验的项目</strong>：考虑 Remix，特别是表单密集型应用。
            </p>
            <p>
              <strong>有特殊需求或学习目的</strong>：可以尝试自定义 SSR，但要做好投入更多时间的准备。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
