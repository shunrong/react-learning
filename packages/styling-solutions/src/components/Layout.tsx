import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  Palette,
  Zap,
  BarChart3,
  Menu,
  X,
  BookOpen,
  ExternalLink,
  Wind,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: '首页', href: '/', icon: Home },
  {
    name: '理论文档',
    href: '/docs/concepts/styling',
    icon: BookOpen,
    external: true,
    description: '深入了解样式方案原理',
  },
  { name: 'CSS Modules', href: '/css-modules', icon: FileText },
  { name: 'Styled Components', href: '/styled-components', icon: Palette },
  { name: 'Emotion', href: '/emotion', icon: Zap },
  { name: 'Tailwind CSS', href: '/tailwind', icon: Wind },
  { name: '方案对比', href: '/comparison', icon: BarChart3 },
  { name: '性能测试', href: '/performance', icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* 移动端侧边栏覆盖层 */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className='flex h-full flex-col'>
          {/* Logo */}
          <div className='flex h-16 items-center justify-between px-6 border-b border-gray-200'>
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <Palette className='w-5 h-5 text-white' />
              </div>
              <span className='ml-3 text-lg font-semibold text-gray-900'>
                样式方案
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className='lg:hidden p-1 rounded-md hover:bg-gray-100'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* 导航菜单 */}
          <nav className='flex-1 px-4 py-6 space-y-2'>
            {navigation.map(item => {
              const isActive =
                !item.external && location.pathname === item.href;
              const Icon = item.icon;

              const className = `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`;

              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={() => setSidebarOpen(false)}
                    className={className}
                    title={item.description}
                  >
                    <Icon className='w-5 h-5 mr-3' />
                    <span className='flex-1'>{item.name}</span>
                    <ExternalLink className='w-4 h-4 opacity-50' />
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={className}
                >
                  <Icon className='w-5 h-5 mr-3' />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 底部信息 */}
          <div className='p-6 border-t border-gray-200'>
            <div className='text-center'>
              <div className='text-sm text-gray-500 mb-2'>
                React 样式方案实战演示
              </div>
              <div className='text-xs text-gray-400 mb-3'>
                通过交互式演示体验四种主流方案
              </div>
              <a
                href='/docs/concepts/styling'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center text-xs text-blue-600 hover:text-blue-700'
              >
                <BookOpen className='w-3 h-3 mr-1' />
                查看理论文档
                <ExternalLink className='w-3 h-3 ml-1' />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 主内容区域 */}
      <div className='flex-1 flex flex-col lg:pl-0'>
        {/* 顶部导航栏 */}
        <header className='bg-white shadow-sm border-b border-gray-200 lg:hidden'>
          <div className='flex h-16 items-center justify-between px-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='p-2 rounded-md hover:bg-gray-100'
            >
              <Menu className='w-5 h-5' />
            </button>
            <h1 className='text-lg font-semibold text-gray-900'>
              React 样式方案
            </h1>
            <div className='w-9' /> {/* 占位符，保持居中 */}
          </div>
        </header>

        {/* 页面内容 */}
        <main className='flex-1 overflow-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='p-6 lg:p-8'
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
