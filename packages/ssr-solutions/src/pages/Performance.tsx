import { motion } from 'framer-motion';
import {
  Target,
  ExternalLink,
  BookOpen,
  Clock,
  Zap,
  BarChart3,
  Globe,
  Server,
  Image,
  Code,
} from 'lucide-react';

export default function Performance() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SSR 性能优化
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          掌握服务端渲染应用的性能监控、分析和优化技巧
        </p>

        <div className="mt-8">
          <a
            href="/docs/concepts/ssr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            查看 SSR 理论
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </motion.div>

      {/* 性能指标 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="ssr-card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          关键性能指标
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'TTFB', value: '< 200ms', description: '首字节时间', icon: Clock },
            { name: 'FCP', value: '< 1.5s', description: '首次内容绘制', icon: Image },
            { name: 'LCP', value: '< 2.5s', description: '最大内容绘制', icon: BarChart3 },
            { name: 'FID', value: '< 100ms', description: '首次输入延迟', icon: Zap },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="text-center p-6 bg-white border border-gray-200 rounded-lg"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600 mb-2">{metric.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{metric.name}</div>
                <div className="text-sm text-gray-600">{metric.description}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 优化策略 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="ssr-card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          性能优化策略
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: '服务端优化',
              icon: Server,
              strategies: [
                '并行数据获取',
                '服务端缓存',
                '数据库查询优化',
                '响应压缩',
                'CDN 分发'
              ]
            },
            {
              title: '渲染优化',
              icon: Code,
              strategies: [
                '流式渲染',
                '组件懒加载',
                'Critical CSS',
                '资源预加载',
                '代码分割'
              ]
            },
            {
              title: '客户端优化',
              icon: Globe,
              strategies: [
                '水合优化',
                'Service Worker',
                '资源缓存',
                '图片优化',
                '字体优化'
              ]
            }
          ].map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.strategies.map((strategy, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      {strategy}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 开发中提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="ssr-card"
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Code className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🚧 功能开发中
          </h3>
          <p className="text-gray-600 mb-6">
            SSR 性能优化演示功能正在开发中，敬请期待更完整的实践演示！
          </p>
          <a
            href="/docs/concepts/performance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            查看性能优化理论
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
