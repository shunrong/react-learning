import { motion } from 'framer-motion';
import { GitBranch, ArrowRight, ExternalLink, Calendar, Star } from 'lucide-react';

const versions = [
  {
    version: 'v3',
    name: '经典时代',
    date: '2016.02',
    description: '静态路由配置，传统的嵌套结构',
    features: ['静态路由配置', '嵌套路由支持', '异步路由加载', '集中式管理'],
    breaking: [],
    status: 'legacy'
  },
  {
    version: 'v4',
    name: '革命性重写',
    date: '2017.03',
    description: '组件化路由，动态路由匹配',
    features: ['组件化路由', '动态路由', '声明式导航', 'Switch 组件'],
    breaking: ['完全重写的 API', '路由配置方式改变', '嵌套路由重构'],
    status: 'breaking'
  },
  {
    version: 'v5',
    name: '成熟稳定',
    date: '2019.01',
    description: 'Hooks 支持，更好的性能',
    features: ['React Hooks 支持', '性能优化', 'TypeScript 改进', '代码分割优化'],
    breaking: [],
    status: 'stable'
  },
  {
    version: 'v6',
    name: '现代化重构',
    date: '2021.11',
    description: '更小体积，新的 API 设计',
    features: ['减少 58% 包体积', '新的 API 设计', '内置数据加载', '更好的 TypeScript'],
    breaking: ['useHistory → useNavigate', 'Switch → Routes', 'Redirect → Navigate'],
    status: 'current'
  },
  {
    version: 'v7',
    name: '全栈路由',
    date: '2023+',
    description: 'Remix 集成，服务端优化',
    features: ['Remix 集成', '服务端渲染优化', '流式数据加载', '边缘计算支持'],
    breaking: ['与 Remix 深度集成', '新的数据加载模式'],
    status: 'future'
  }
];

const milestones = [
  {
    date: '2014.05',
    title: 'React Router 诞生',
    description: '首个版本发布，为 React 带来客户端路由'
  },
  {
    date: '2017.03',
    title: 'v4 革命性重写',
    description: '引入组件化路由理念，改变整个生态'
  },
  {
    date: '2019.01',
    title: 'v5 Hooks 支持',
    description: '拥抱 React Hooks，提供现代化的 API'
  },
  {
    date: '2021.11',
    title: 'v6 现代化重构',
    description: '大幅减少包体积，优化开发体验'
  }
];

function RouterEvolution() {
  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-route-600 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <GitBranch className="w-8 h-8 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold">React Router 演进历史</h1>
            </div>
            <p className="text-xl text-route-100 max-w-3xl">
              探索 React Router 从 2014 年诞生到今天的完整演进过程，理解每个版本背后的设计理念和技术突破
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 时间线 */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-route-600" />
              发展时间线
            </h2>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.date} className="timeline-item">
                  <div className="timeline-dot">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-route-600 bg-route-50 px-2 py-1 rounded">
                        {milestone.date}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 版本详细对比 */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Star className="w-6 h-6 mr-2 text-route-600" />
              版本特性对比
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {versions.map((version, index) => (
                <motion.div
                  key={version.version}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className={`card ${
                    version.status === 'current' ? 'ring-2 ring-route-500' : ''
                  }`}
                >
                  <div className="card-header">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            React Router {version.version}
                          </h3>
                          {version.status === 'current' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              当前版本
                            </span>
                          )}
                          {version.status === 'future' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              未来版本
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{version.name}</p>
                      </div>
                      <span className="text-sm text-gray-500">{version.date}</span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <p className="text-gray-600 mb-4">
                      {version.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">核心特性</h4>
                        <ul className="space-y-1">
                          {version.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {version.breaking.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">重大变更</h4>
                          <ul className="space-y-1">
                            {version.breaking.map((change, idx) => (
                              <li key={idx} className="text-sm text-orange-600 flex items-start">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button className="w-full btn btn-outline text-sm">
                        查看详细示例
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 学习建议 */}
        <section className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-br from-route-50 to-primary-50 rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 学习建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">新手开发者</h4>
                <p className="text-gray-600 text-sm mb-3">
                  建议直接学习 React Router v6，它有更现代的 API 设计和更好的性能表现。
                </p>
                <a href="/basic" className="text-route-600 text-sm font-medium hover:text-route-700">
                  开始基础教程 →
                </a>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">有经验的开发者</h4>
                <p className="text-gray-600 text-sm mb-3">
                  了解版本演进历史能帮助你更好地理解设计理念的变化和迁移策略。
                </p>
                <a href="/advanced" className="text-route-600 text-sm font-medium hover:text-route-700">
                  查看高级特性 →
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default RouterEvolution;
