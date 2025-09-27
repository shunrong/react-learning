import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  Menu,
  X,
  Home,
  GitBranch,
  Settings,
  Layers,
  Zap,
  BarChart3,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { NavigationItem } from '@/types';

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: '首页',
    path: '/',
    icon: Home,
  },
  {
    id: 'evolution',
    label: 'Router 演进',
    path: '/evolution',
    icon: GitBranch,
    badge: '核心',
  },
  {
    id: 'basic',
    label: '基础路由',
    path: '/basic',
    icon: Navigation,
  },
  {
    id: 'advanced',
    label: '高级特性',
    path: '/advanced',
    icon: Settings,
    children: [
      {
        id: 'nested',
        label: '嵌套路由',
        path: '/examples/nested',
      },
      {
        id: 'dynamic',
        label: '动态路由',
        path: '/examples/dynamic',
      },
      {
        id: 'protected',
        label: '路由守卫',
        path: '/examples/protected',
      },
      {
        id: 'lazy',
        label: '懒加载',
        path: '/examples/lazy',
      },
      {
        id: 'modal',
        label: '模态路由',
        path: '/examples/modal',
      },
    ],
  },
  {
    id: 'patterns',
    label: '设计模式',
    path: '/patterns',
    icon: Layers,
  },
  {
    id: 'performance',
    label: '性能优化',
    path: '/performance',
    icon: Zap,
    badge: 'NEW',
  },
  {
    id: 'comparison',
    label: '方案对比',
    path: '/comparison',
    icon: BarChart3,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['advanced']);
  const location = useLocation();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isChildActive = (children: NavigationItem[]) => {
    return children.some(child => isActiveRoute(child.path));
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* 移动端遮罩 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className='fixed inset-0 z-20 bg-black/50 lg:hidden'
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%',
        }}
        className='fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 lg:static lg:translate-x-0 sidebar-transition'
      >
        {/* 侧边栏头部 */}
        <div className='flex items-center justify-between h-16 px-6 border-b border-gray-200'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-route-500 to-primary-600 rounded-lg flex items-center justify-center'>
              <Navigation className='w-5 h-5 text-white' />
            </div>
            <div>
              <h1 className='text-lg font-semibold text-gray-900'>
                React Router
              </h1>
              <p className='text-xs text-gray-500'>演进历史</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className='p-2 text-gray-400 hover:text-gray-600 lg:hidden'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto'>
          {navigationItems.map(item => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isChildActive(item.children)
                        ? 'text-route-700 bg-route-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className='flex items-center space-x-3'>
                      {item.icon && <item.icon className='w-5 h-5' />}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className='px-2 py-0.5 text-xs bg-route-100 text-route-700 rounded-full'>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {expandedItems.includes(item.id) ? (
                      <ChevronDown className='w-4 h-4' />
                    ) : (
                      <ChevronRight className='w-4 h-4' />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedItems.includes(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className='overflow-hidden'
                      >
                        <div className='ml-8 mt-2 space-y-1'>
                          {item.children.map(child => (
                            <Link
                              key={child.id}
                              to={child.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                isActiveRoute(child.path)
                                  ? 'text-route-700 bg-route-50 font-medium'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? 'text-route-700 bg-route-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon && <item.icon className='w-5 h-5' />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className='px-2 py-0.5 text-xs bg-route-100 text-route-700 rounded-full'>
                      {item.badge}
                    </span>
                  )}
                  {item.external && <ExternalLink className='w-4 h-4' />}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* 侧边栏底部信息 */}
        <div className='p-4 border-t border-gray-200'>
          <div className='bg-gradient-to-r from-route-50 to-primary-50 rounded-lg p-4'>
            <h3 className='text-sm font-medium text-gray-900 mb-1'>
              🚀 学习进度
            </h3>
            <p className='text-xs text-gray-600 mb-3'>
              掌握现代 React 路由系统的方方面面
            </p>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div className='bg-gradient-to-r from-route-500 to-primary-500 h-2 rounded-full w-3/4'></div>
            </div>
            <p className='text-xs text-gray-500 mt-1'>75% 完成</p>
          </div>
        </div>
      </motion.aside>

      {/* 主内容区域 */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* 顶部导航栏 */}
        <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='p-2 text-gray-400 hover:text-gray-600 lg:hidden'
            >
              <Menu className='w-5 h-5' />
            </button>

            <div className='hidden lg:block'>
              <div className='flex items-center space-x-2 text-sm text-gray-500'>
                <Navigation className='w-4 h-4' />
                <span>当前路径:</span>
                <code className='px-2 py-1 bg-gray-100 rounded text-xs font-mono'>
                  {location.pathname}
                </code>
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='hidden md:block'>
              <div className='flex items-center space-x-2 text-sm text-gray-500'>
                <span>React Router</span>
                <span className='px-2 py-1 bg-route-100 text-route-700 rounded text-xs font-medium'>
                  v6.8.1
                </span>
              </div>
            </div>

            <a
              href='https://reactrouter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-outline text-xs'
            >
              <ExternalLink className='w-4 h-4 mr-1' />
              官方文档
            </a>
          </div>
        </header>

        {/* 页面内容 */}
        <main className='flex-1 overflow-auto'>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='h-full'
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
