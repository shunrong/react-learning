import { motion } from 'framer-motion';
import {
  Globe,
  ExternalLink,
  BookOpen,
  CheckCircle,
  Shield,
  Zap,
  Database,
  Monitor,
  Settings,
  AlertTriangle,
} from 'lucide-react';

export default function BestPractices() {
  const practiceCategories = [
    {
      title: '架构设计',
      icon: Settings,
      color: 'blue',
      practices: [
        '选择合适的渲染策略（SSR/SSG/ISR）',
        '设计合理的数据获取层次',
        '实现有效的错误边界策略',
        '规划组件和页面的代码分割',
        '设计缓存策略和失效机制',
      ],
    },
    {
      title: '性能优化',
      icon: Zap,
      color: 'yellow',
      practices: [
        '实现并行数据获取',
        '使用流式渲染减少 TTFB',
        '优化关键渲染路径',
        '实现资源预加载策略',
        '监控和优化 Web Vitals',
      ],
    },
    {
      title: '安全防护',
      icon: Shield,
      color: 'green',
      practices: [
        '防范 XSS 和 CSRF 攻击',
        '正确处理用户输入和输出',
        '实现安全的认证授权',
        '使用 HTTPS 和安全头',
        '定期更新依赖包',
      ],
    },
    {
      title: 'SEO 优化',
      icon: Monitor,
      color: 'purple',
      practices: [
        '优化页面元数据和标题',
        '实现结构化数据标记',
        '生成和维护站点地图',
        '优化页面加载速度',
        '确保移动设备友好',
      ],
    },
    {
      title: '数据管理',
      icon: Database,
      color: 'indigo',
      practices: [
        '设计合理的数据获取策略',
        '实现有效的缓存机制',
        '处理数据同步和一致性',
        '优化数据库查询性能',
        '实现数据预取和懒加载',
      ],
    },
  ];

  const commonPitfalls = [
    {
      problem: '水合失败',
      description: '服务端和客户端渲染结果不一致',
      solutions: [
        '确保初始状态在服务端和客户端一致',
        '避免使用浏览器特定的 API 在服务端',
        '正确处理动态内容和时间戳',
        '使用 suppressHydrationWarning 处理已知差异',
      ],
    },
    {
      problem: '性能问题',
      description: '服务端渲染导致响应时间过长',
      solutions: [
        '实现并行数据获取',
        '使用流式渲染',
        '优化数据库查询',
        '实现适当的缓存策略',
        '考虑降级到客户端渲染',
      ],
    },
    {
      problem: '内存泄漏',
      description: '长时间运行的服务器出现内存问题',
      solutions: [
        '正确清理事件监听器',
        '避免全局变量累积',
        '实现请求级别的内存管理',
        '监控内存使用情况',
        '定期重启服务实例',
      ],
    },
    {
      problem: 'SEO 问题',
      description: '搜索引擎无法正确索引内容',
      solutions: [
        '确保关键内容在服务端渲染',
        '提供正确的元数据',
        '实现结构化数据',
        '优化页面加载速度',
        '使用语义化 HTML',
      ],
    },
  ];

  const developmentWorkflow = [
    {
      phase: '开发阶段',
      tasks: [
        '设置开发环境和热重载',
        '配置 TypeScript 和 ESLint',
        '实现基础路由和组件结构',
        '集成状态管理方案',
        '添加样式解决方案',
      ],
    },
    {
      phase: '测试阶段',
      tasks: [
        '编写单元测试和集成测试',
        '测试服务端渲染功能',
        '验证 SEO 和可访问性',
        '进行性能测试',
        '测试错误处理',
      ],
    },
    {
      phase: '部署阶段',
      tasks: [
        '配置生产环境',
        '设置 CI/CD 流水线',
        '配置监控和日志',
        '实现健康检查',
        '准备回滚策略',
      ],
    },
    {
      phase: '维护阶段',
      tasks: [
        '监控性能指标',
        '定期更新依赖',
        '分析用户反馈',
        '优化性能瓶颈',
        '扩容和负载均衡',
      ],
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
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6'>
          <Globe className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>SSR 最佳实践</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          企业级服务端渲染应用的架构设计、开发流程和运维实践指南
        </p>

        <div className='mt-8'>
          <a
            href='/docs/concepts/ssr'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看 SSR 理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 最佳实践分类 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className='ssr-card mb-12'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>最佳实践指南</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {practiceCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className='bg-white border border-gray-200 rounded-lg p-6'
              >
                <div className='text-center mb-6'>
                  <div
                    className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {category.title}
                  </h3>
                </div>

                <div className='space-y-3'>
                  {category.practices.map((practice, idx) => (
                    <div
                      key={idx}
                      className='flex items-start text-sm text-gray-700'
                    >
                      <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 常见问题和解决方案 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='ssr-card mb-12'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          常见问题和解决方案
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {commonPitfalls.map((pitfall, index) => (
            <motion.div
              key={pitfall.problem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className='bg-white border border-gray-200 rounded-lg p-6'
            >
              <div className='flex items-start mb-4'>
                <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
                  <AlertTriangle className='w-5 h-5 text-red-600' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    {pitfall.problem}
                  </h3>
                  <p className='text-sm text-gray-600'>{pitfall.description}</p>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-semibold text-green-700 mb-3'>
                  解决方案：
                </h4>
                <div className='space-y-2'>
                  {pitfall.solutions.map((solution, idx) => (
                    <div
                      key={idx}
                      className='flex items-start text-sm text-gray-700'
                    >
                      <div className='w-1.5 h-1.5 bg-green-400 rounded-full mr-2 mt-2 flex-shrink-0'></div>
                      <span>{solution}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 开发流程 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className='ssr-card'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          企业级开发流程
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {developmentWorkflow.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className='bg-white border border-gray-200 rounded-lg p-6'
            >
              <div className='text-center mb-6'>
                <div className='w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                  <span className='text-lg font-bold text-teal-600'>
                    {index + 1}
                  </span>
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {phase.phase}
                </h3>
              </div>

              <div className='space-y-3'>
                {phase.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className='flex items-start text-sm text-gray-700'
                  >
                    <div className='w-1.5 h-1.5 bg-teal-400 rounded-full mr-2 mt-2 flex-shrink-0'></div>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className='mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg'>
          <h3 className='text-lg font-semibold text-teal-900 mb-4'>
            🎯 关键成功因素
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-teal-800'>
            <div className='space-y-2'>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 text-teal-600 mr-2' />
                <span>团队技能培训和知识分享</span>
              </div>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 text-teal-600 mr-2' />
                <span>建立完善的代码规范</span>
              </div>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 text-teal-600 mr-2' />
                <span>实施自动化测试和部署</span>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 text-teal-600 mr-2' />
                <span>建立性能监控体系</span>
              </div>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 text-teal-600 mr-2' />
                <span>定期进行技术回顾</span>
              </div>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 text-teal-600 mr-2' />
                <span>保持技术栈的持续更新</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
