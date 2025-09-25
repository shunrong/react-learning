import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Navigation,
  BookOpen,
  Code,
  Play,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Zap,
  Globe,
  Layers,
  Settings,
} from 'lucide-react';

function BasicRouting() {
  const concepts = [
    {
      title: 'SPA vs MPA',
      description: '单页应用与多页应用的根本区别',
      icon: Globe,
      content: [
        '单页应用 (SPA) 只有一个 HTML 文件，通过 JavaScript 动态更新内容',
        '多页应用 (MPA) 每个页面都是独立的 HTML 文件，需要服务器重新加载',
        'React Router 让 SPA 具备类似 MPA 的导航体验',
        '提供更流畅的用户体验和更好的性能表现',
      ],
    },
    {
      title: '路由原理',
      description: '前端路由如何工作',
      icon: Navigation,
      content: [
        '监听 URL 变化事件 (popstate, hashchange)',
        '根据 URL 匹配对应的组件',
        '使用 History API 管理浏览器历史记录',
        '实现无刷新页面切换',
      ],
    },
    {
      title: 'Hash vs History',
      description: '两种路由模式的对比',
      icon: Code,
      content: [
        'Hash 模式: URL 带 #，兼容性好，无需服务器配置',
        'History 模式: URL 干净，需要服务器支持，SEO 友好',
        'React Router 默认使用 History 模式',
        '生产环境需要配置服务器 fallback 到 index.html',
      ],
    },
  ];

  const features = [
    {
      title: '声明式导航',
      description: '使用 Link 和 NavLink 组件',
      icon: ArrowRight,
      examples: [
        '<Link to="/about">关于我们</Link>',
        '<NavLink to="/users" className={({isActive}) => isActive ? "active" : ""}>用户</NavLink>',
      ],
    },
    {
      title: '程序化导航',
      description: '使用 useNavigate Hook',
      icon: Zap,
      examples: [
        'const navigate = useNavigate();',
        'navigate("/success");',
        'navigate(-1); // 后退',
      ],
    },
    {
      title: '路由参数',
      description: '动态路径和查询参数',
      icon: Settings,
      examples: [
        '路径参数: /user/:id',
        '查询参数: ?tab=profile&sort=name',
        'const { id } = useParams();',
      ],
    },
    {
      title: '路由状态',
      description: '获取当前路由信息',
      icon: Settings,
      examples: [
        'const location = useLocation();',
        'location.pathname // 当前路径',
        'location.search // 查询参数',
      ],
    },
  ];

  const bestPractices = [
    {
      type: 'do',
      title: '使用语义化的 URL',
      description: '/user/123/profile 比 /page?id=123&type=profile 更好',
    },
    {
      type: 'do',
      title: '合理使用嵌套路由',
      description: '保持 URL 结构与组件层级一致',
    },
    {
      type: 'do',
      title: '处理 404 错误',
      description: '总是提供通配符路由处理未匹配的路径',
    },
    {
      type: 'dont',
      title: '避免过深的嵌套',
      description: '超过 3-4 层的嵌套会增加复杂度',
    },
    {
      type: 'dont',
      title: '不要在 URL 中存储敏感信息',
      description: 'URL 是公开的，不要包含密码或令牌',
    },
  ];

  const roadmap = [
    { step: 1, title: '理解路由概念', completed: true },
    { step: 2, title: '掌握基础 API', completed: true },
    { step: 3, title: '实践简单导航', completed: false },
    { step: 4, title: '学习嵌套路由', completed: false },
    { step: 5, title: '高级特性应用', completed: false },
  ];

  return (
    <div className='min-h-full bg-gray-50'>
      {/* 头部 */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white'>
        <div className='max-w-7xl mx-auto px-6 py-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='flex items-center mb-4'>
              <BookOpen className='w-8 h-8 mr-3' />
              <h1 className='text-3xl md:text-4xl font-bold'>基础路由概念</h1>
            </div>
            <p className='text-xl text-blue-100 max-w-3xl'>
              掌握 React Router 的核心概念，构建现代化的单页应用导航系统
            </p>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* 核心概念 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Lightbulb className='w-6 h-6 mr-2 text-blue-600' />
              核心概念
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {concepts.map((concept, index) => (
                <motion.div
                  key={concept.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className='card'
                >
                  <div className='card-header'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
                        <concept.icon className='w-5 h-5 text-blue-600' />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {concept.title}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {concept.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='card-content'>
                    <ul className='space-y-2'>
                      {concept.content.map((item, idx) => (
                        <li
                          key={idx}
                          className='flex items-start text-sm text-gray-600'
                        >
                          <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 主要特性 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Code className='w-6 h-6 mr-2 text-blue-600' />
              主要特性
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className='card'
                >
                  <div className='card-header'>
                    <div className='flex items-center'>
                      <feature.icon className='w-6 h-6 text-blue-600 mr-3' />
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
                    <div className='bg-gray-900 rounded-lg p-4'>
                      <div className='space-y-2'>
                        {feature.examples.map((example, idx) => (
                          <div
                            key={idx}
                            className='text-sm text-gray-100 font-mono'
                          >
                            {example}
                          </div>
                        ))}
                      </div>
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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {bestPractices.map((practice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.05 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    practice.type === 'do'
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className='flex items-start'>
                    {practice.type === 'do' ? (
                      <CheckCircle className='w-5 h-5 text-green-600 mr-3 mt-0.5' />
                    ) : (
                      <AlertCircle className='w-5 h-5 text-red-600 mr-3 mt-0.5' />
                    )}
                    <div>
                      <h4
                        className={`font-medium ${
                          practice.type === 'do'
                            ? 'text-green-900'
                            : 'text-red-900'
                        }`}
                      >
                        {practice.type === 'do' ? '✅ 推荐' : '❌ 避免'}:{' '}
                        {practice.title}
                      </h4>
                      <p
                        className={`text-sm mt-1 ${
                          practice.type === 'do'
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}
                      >
                        {practice.description}
                      </p>
                    </div>
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
              <Navigation className='w-6 h-6 mr-2 text-blue-600' />
              学习路径
            </h2>

            <div className='bg-white rounded-xl p-6 border border-gray-200'>
              <div className='space-y-4'>
                {roadmap.map((item, index) => (
                  <div key={item.step} className='flex items-center'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        item.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle className='w-4 h-4' />
                      ) : (
                        item.step
                      )}
                    </div>
                    <div className='ml-4 flex-1'>
                      <span
                        className={`text-sm ${
                          item.completed
                            ? 'text-green-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    {index < roadmap.length - 1 && (
                      <div className='w-px h-8 bg-gray-200 absolute ml-4 mt-8'></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* 实践环节 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8'
        >
          <div className='text-center mb-6'>
            <Play className='w-12 h-12 text-blue-600 mx-auto mb-4' />
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>开始实践</h3>
            <p className='text-gray-600'>通过实际操作加深对路由概念的理解</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link
              to='/examples/basic'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Navigation className='w-8 h-8 text-blue-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>基础示例</h4>
                <p className='text-sm text-gray-600 mb-3'>
                  体验 Link 导航和路由参数
                </p>
                <div className='flex items-center justify-center text-blue-600 text-sm font-medium'>
                  开始体验
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>

            <Link
              to='/examples/nested'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Layers className='w-8 h-8 text-purple-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>嵌套路由</h4>
                <p className='text-sm text-gray-600 mb-3'>
                  学习复杂页面结构设计
                </p>
                <div className='flex items-center justify-center text-purple-600 text-sm font-medium'>
                  深入学习
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>

            <Link
              to='/advanced'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Zap className='w-8 h-8 text-yellow-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>高级特性</h4>
                <p className='text-sm text-gray-600 mb-3'>
                  掌握路由守卫和懒加载
                </p>
                <div className='flex items-center justify-center text-yellow-600 text-sm font-medium'>
                  探索高级
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>
          </div>

          <div className='mt-6 text-center'>
            <a
              href='https://reactrouter.com/en/main'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center text-blue-600 hover:text-blue-700 font-medium'
            >
              查看官方文档
              <ExternalLink className='w-4 h-4 ml-1' />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BasicRouting;
