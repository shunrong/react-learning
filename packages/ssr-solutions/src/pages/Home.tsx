import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Server,
  Zap,
  Code,
  BarChart3,
  Target,
  Globe,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Clock,
  Search,
  Share2,
  Smartphone,
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Clock,
      title: '首屏性能优化',
      description: '服务端预渲染，大幅提升首屏加载速度',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Search,
      title: 'SEO 友好',
      description: '搜索引擎可直接解析内容，提升排名和流量',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Share2,
      title: '社交分享',
      description: '动态生成 Open Graph 标签，完美支持社交分享',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: Smartphone,
      title: '渐进增强',
      description: '即使 JavaScript 失败也能正常显示内容',
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  const solutions = [
    {
      id: 'nextjs',
      name: 'Next.js',
      description: 'React 生态的领军 SSR 框架',
      icon: Zap,
      features: ['零配置', 'ISR 增量渲染', 'Edge Runtime', 'Image 优化'],
      color: 'border-blue-200 hover:border-blue-400',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      href: '/nextjs',
    },
    {
      id: 'remix',
      name: 'Remix',
      description: '现代 Web 标准的拥护者',
      icon: Code,
      features: ['嵌套路由', '表单优先', 'Web 标准', '渐进增强'],
      color: 'border-purple-200 hover:border-purple-400',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      href: '/remix',
    },
    {
      id: 'custom',
      name: '自定义 SSR',
      description: '从零构建的服务端渲染方案',
      icon: Server,
      features: ['完全控制', '轻量级', '定制化', '学习价值'],
      color: 'border-green-200 hover:border-green-400',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      href: '/custom',
    },
  ];

  const demos = [
    {
      title: '方案对比分析',
      description: '深入对比不同 SSR 方案的优缺点和适用场景',
      icon: BarChart3,
      href: '/comparison',
      color: 'text-indigo-600',
    },
    {
      title: '性能优化实践',
      description: '掌握 SSR 应用的性能监控和优化技巧',
      icon: Target,
      href: '/performance',
      color: 'text-red-600',
    },
    {
      title: '最佳实践指南',
      description: '企业级 SSR 应用的架构设计和实施策略',
      icon: Globe,
      href: '/best-practices',
      color: 'text-teal-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* 头部介绍 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ssr-500 to-ssr-600 rounded-2xl mb-6">
          <Server className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          服务端渲染解决方案
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          探索现代 Web 应用的服务端渲染技术，从 Next.js 到 Remix，从自定义方案到最佳实践，
          全面掌握 SSR 技术栈
        </p>

        <div className="flex items-center justify-center space-x-4">
          <a
            href="/docs/concepts/ssr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-ssr-600 text-white rounded-lg hover:bg-ssr-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            查看理论文档
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
          <Link
            to="/comparison"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            方案对比
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </motion.div>

      {/* SSR 核心优势 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="ssr-card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          为什么选择服务端渲染？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* SSR 方案展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          主流 SSR 解决方案
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Link
                  to={solution.href}
                  className={`block ssr-card ${solution.color} group transition-all duration-200 hover:transform hover:-translate-y-1`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 ${solution.bgColor} rounded-xl flex items-center justify-center mr-4`}
                    >
                      <Icon className={`w-6 h-6 ${solution.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-ssr-600 transition-colors">
                        {solution.name}
                      </h3>
                      <p className="text-sm text-gray-500">{solution.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {solution.features.map(feature => (
                      <div
                        key={feature}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-ssr-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-sm text-ssr-600 group-hover:text-ssr-700">
                    <span>查看演示</span>
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 实践演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          深度实践演示
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demos.map((demo, index) => {
            const Icon = demo.icon;
            return (
              <motion.div
                key={demo.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={demo.href}
                  className="block ssr-card group hover:border-gray-300 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                      <Icon className={`w-8 h-8 ${demo.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-ssr-600 transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{demo.description}</p>
                    <div className="flex items-center justify-center text-sm text-ssr-600 group-hover:text-ssr-700">
                      <span>开始探索</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
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
        transition={{ duration: 0.6, delay: 0.4 }}
        className="ssr-card"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          推荐学习路径
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📚 理论基础
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-ssr-100 text-ssr-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-gray-900">SSR 核心概念</div>
                  <div className="text-sm text-gray-600">
                    理解服务端渲染的原理和优势
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-ssr-100 text-ssr-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-gray-900">技术演进历程</div>
                  <div className="text-sm text-gray-600">
                    从传统 SSR 到现代同构应用的发展
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-ssr-100 text-ssr-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-gray-900">架构设计原则</div>
                  <div className="text-sm text-gray-600">
                    企业级 SSR 应用的设计考量
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🛠️ 实践项目
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-gray-900">Next.js 实战</div>
                  <div className="text-sm text-gray-600">
                    体验生产级 SSR 框架的强大功能
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-gray-900">Remix 探索</div>
                  <div className="text-sm text-gray-600">
                    感受现代 Web 标准的魅力
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-gray-900">性能优化</div>
                  <div className="text-sm text-gray-600">
                    掌握 SSR 应用的优化技巧
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-ssr-50 border border-ssr-200 rounded-lg">
          <div className="flex items-start">
            <BookOpen className="w-5 h-5 text-ssr-600 mr-2 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-ssr-800 mb-1">
                💡 学习建议
              </div>
              <div className="text-sm text-ssr-700">
                建议先阅读理论文档了解基础概念，然后通过实践项目加深理解。
                重点关注不同方案的特点和适用场景，最终形成自己的技术选型判断。
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
