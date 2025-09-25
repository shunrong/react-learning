import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ExternalLink,
  BookOpen,
  Server,
  Zap,
  Code,
  BarChart3,
  Target,
  Globe,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: '首页', href: '/', icon: Home },
  {
    name: '理论文档',
    href: '/docs/concepts/ssr',
    icon: BookOpen,
    external: true,
    description: '深入了解SSR原理与技术演进',
  },
  { name: 'Next.js Demo', href: '/nextjs', icon: Zap },
  { name: 'Remix Demo', href: '/remix', icon: Code },
  { name: '自定义SSR', href: '/custom', icon: Server },
  { name: '方案对比', href: '/comparison', icon: BarChart3 },
  { name: '性能优化', href: '/performance', icon: Target },
  { name: '最佳实践', href: '/best-practices', icon: Globe },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <div className="w-64 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-ssr-500 to-ssr-600 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">
              SSR 解决方案
            </span>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map(item => {
            const isActive = !item.external && location.pathname === item.href;
            const Icon = item.icon;

            const className = `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-ssr-50 text-ssr-700 border-r-2 border-ssr-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`;

            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  title={item.description}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.name}</span>
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                className={className}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 底部信息 */}
        <div className="p-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">React SSR 实践</div>
            <div className="text-xs text-gray-400 mb-3">
              探索现代服务端渲染解决方案
            </div>
            <a
              href="/docs/concepts/ssr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-ssr-600 hover:text-ssr-700"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              查看理论文档
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Server className="w-4 h-4" />
              <span>当前路径:</span>
              <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                {location.pathname}
              </code>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>React SSR Solutions</span>
              <span className="px-2 py-1 bg-ssr-100 text-ssr-700 rounded text-xs font-medium">
                v1.0
              </span>
            </div>

            <a
              href="/docs/concepts/ssr"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-xs"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              理论文档
            </a>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
