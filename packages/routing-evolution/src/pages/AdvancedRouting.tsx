import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Layers,
  Code,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Settings,
  Cpu,
  Globe,
  Clock,
} from 'lucide-react';

function AdvancedRouting() {
  const features = [
    {
      title: '路由守卫',
      description: '保护敏感页面，控制访问权限',
      icon: Shield,
      color: 'red',
      examples: ['认证守卫', '角色权限', '动态权限', '路由拦截'],
      link: '/examples/protected',
    },
    {
      title: '懒加载路由',
      description: '按需加载，优化应用性能',
      icon: Zap,
      color: 'green',
      examples: ['代码分割', '动态导入', '加载状态', '错误边界'],
      link: '/examples/lazy',
    },
    {
      title: '模态路由',
      description: 'URL 驱动的模态窗口管理',
      icon: Layers,
      color: 'indigo',
      examples: ['模态状态', 'URL 同步', '动画过渡', '嵌套模态'],
      link: '/examples/modal',
    },
    {
      title: '动态路由',
      description: 'URL 参数处理和验证',
      icon: Settings,
      color: 'orange',
      examples: ['参数验证', '404 处理', '重定向', '查询参数'],
      link: '/examples/dynamic',
    },
  ];

  const patterns = [
    {
      title: '高阶组件模式',
      description: '通过 HOC 包装组件来添加路由逻辑',
      icon: Code,
      example: `function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Component {...props} />;
  };
}`,
    },
    {
      title: '钩子模式',
      description: '使用自定义 Hook 封装路由逻辑',
      icon: Settings,
      example: `function useRequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);
  
  return user;
}`,
    },
    {
      title: '组件模式',
      description: '通过组件包装来实现路由控制',
      icon: Layers,
      example: `function ProtectedRoute({ children, permission }) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return <Unauthorized />;
  }
  
  return children;
}`,
    },
  ];

  const bestPractices = [
    {
      category: '性能优化',
      tips: [
        '使用 React.lazy() 进行代码分割',
        '实现路由级别的预加载',
        '合理使用 React.memo 避免不必要的重渲染',
        '监控路由切换性能指标',
      ],
    },
    {
      category: '用户体验',
      tips: [
        '提供加载状态和错误边界',
        '实现平滑的页面过渡动画',
        '支持浏览器前进后退按钮',
        '处理深层链接和书签',
      ],
    },
    {
      category: '安全性',
      tips: [
        '实现多层路由守卫机制',
        '避免在 URL 中暴露敏感信息',
        '验证所有路由参数',
        '实现 CSRF 保护',
      ],
    },
    {
      category: '可维护性',
      tips: [
        '保持路由结构清晰简洁',
        '使用语义化的路由命名',
        '集中管理路由配置',
        '编写路由相关的单元测试',
      ],
    },
  ];

  const roadmap = [
    {
      phase: '基础阶段',
      topics: ['声明式导航', '程序化导航', '路由参数', '嵌套路由'],
      status: 'completed',
    },
    {
      phase: '进阶阶段',
      topics: ['动态路由', '路由守卫', '懒加载', '错误处理'],
      status: 'current',
    },
    {
      phase: '高级阶段',
      topics: ['模态路由', '路由动画', '性能优化', 'SSR 路由'],
      status: 'upcoming',
    },
    {
      phase: '专家阶段',
      topics: ['微前端路由', '路由测试', '国际化路由', '自定义路由'],
      status: 'future',
    },
  ];

  return (
    <div className='min-h-full bg-gray-50'>
      {/* 头部 */}
      <div className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
        <div className='max-w-7xl mx-auto px-6 py-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='flex items-center mb-4'>
              <Zap className='w-8 h-8 mr-3' />
              <h1 className='text-3xl md:text-4xl font-bold'>高级路由特性</h1>
            </div>
            <p className='text-xl text-purple-100 max-w-3xl'>
              掌握复杂应用场景下的路由解决方案，构建安全、高效、用户友好的路由系统
            </p>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* 核心特性 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Cpu className='w-6 h-6 mr-2 text-purple-600' />
              核心特性
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className='card hover:shadow-lg transition-all duration-300'
                >
                  <div className='card-header'>
                    <div className='flex items-center'>
                      <div
                        className={`w-10 h-10 bg-${feature.color}-100 rounded-lg flex items-center justify-center mr-3`}
                      >
                        <feature.icon
                          className={`w-5 h-5 text-${feature.color}-600`}
                        />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {feature.title}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='card-content'>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {feature.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 bg-${feature.color}-50 text-${feature.color}-700 rounded text-xs`}
                        >
                          {example}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={feature.link}
                      className='inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700'
                    >
                      查看示例
                      <ArrowRight className='w-4 h-4 ml-1' />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 设计模式 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Code className='w-6 h-6 mr-2 text-purple-600' />
              设计模式
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {patterns.map((pattern, index) => (
                <motion.div
                  key={pattern.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className='card'
                >
                  <div className='card-header'>
                    <div className='flex items-center mb-3'>
                      <pattern.icon className='w-5 h-5 text-purple-600 mr-2' />
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {pattern.title}
                      </h3>
                    </div>
                    <p className='text-sm text-gray-600'>
                      {pattern.description}
                    </p>
                  </div>

                  <div className='card-content'>
                    <div className='bg-gray-900 rounded-lg p-3'>
                      <pre className='text-xs text-gray-100 overflow-x-auto'>
                        <code>{pattern.example}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 最佳实践 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <CheckCircle className='w-6 h-6 mr-2 text-green-600' />
              最佳实践
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {bestPractices.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className='card'
                >
                  <div className='card-header'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {category.category}
                    </h3>
                  </div>

                  <div className='card-content'>
                    <ul className='space-y-2'>
                      {category.tips.map((tip, idx) => (
                        <li
                          key={idx}
                          className='flex items-start text-sm text-gray-600'
                        >
                          <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 学习路径 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Globe className='w-6 h-6 mr-2 text-purple-600' />
              学习路径
            </h2>

            <div className='space-y-6'>
              {roadmap.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className={`relative pl-8 pb-8 ${index < roadmap.length - 1 ? 'border-l-2 border-gray-200' : ''}`}
                >
                  <div
                    className={`absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-2 ${
                      phase.status === 'completed'
                        ? 'bg-green-500'
                        : phase.status === 'current'
                          ? 'bg-purple-500'
                          : phase.status === 'upcoming'
                            ? 'bg-yellow-500'
                            : 'bg-gray-300'
                    }`}
                  ></div>

                  <div className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
                    <div className='flex items-center justify-between mb-3'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {phase.phase}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          phase.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : phase.status === 'current'
                              ? 'bg-purple-100 text-purple-800'
                              : phase.status === 'upcoming'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {phase.status === 'completed'
                          ? '已完成'
                          : phase.status === 'current'
                            ? '进行中'
                            : phase.status === 'upcoming'
                              ? '即将开始'
                              : '规划中'}
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      {phase.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className='px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm'
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 实践建议 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8'
        >
          <div className='text-center mb-6'>
            <Clock className='w-12 h-12 text-purple-600 mx-auto mb-4' />
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>
              开始高级路由之旅
            </h3>
            <p className='text-gray-600'>
              通过系统化的学习和实践，掌握现代 React 路由开发
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link
              to='/examples/protected'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Shield className='w-8 h-8 text-red-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>路由守卫</h4>
                <p className='text-sm text-gray-600 mb-3'>保护应用安全</p>
                <div className='flex items-center justify-center text-red-600 text-sm font-medium'>
                  开始学习
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>

            <Link
              to='/examples/lazy'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Zap className='w-8 h-8 text-green-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>懒加载</h4>
                <p className='text-sm text-gray-600 mb-3'>优化应用性能</p>
                <div className='flex items-center justify-center text-green-600 text-sm font-medium'>
                  深入了解
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>

            <Link
              to='/examples/modal'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Layers className='w-8 h-8 text-indigo-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>模态路由</h4>
                <p className='text-sm text-gray-600 mb-3'>URL 驱动交互</p>
                <div className='flex items-center justify-center text-indigo-600 text-sm font-medium'>
                  探索功能
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>
          </div>

          <div className='mt-6 text-center'>
            <a
              href='https://reactrouter.com/en/main/guides/overview'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center text-purple-600 hover:text-purple-700 font-medium'
            >
              查看 React Router 官方指南
              <ExternalLink className='w-4 h-4 ml-1' />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdvancedRouting;
