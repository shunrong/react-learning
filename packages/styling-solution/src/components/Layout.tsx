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
];

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 顶部导航栏 */}
      <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex h-16 items-center justify-between px-4 lg:px-8'>
            {/* Logo */}
            <Link to='/' className='flex items-center'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <Palette className='w-5 h-5 text-white' />
              </div>
              <span className='ml-3 text-lg font-semibold text-gray-900'>
                React 样式方案演示
              </span>
            </Link>

            {/* 桌面端导航 */}
            <nav className='hidden lg:flex items-center space-x-1'>
              {navigation.map(item => {
                const isActive =
                  !item.external && location.pathname === item.href;
                const Icon = item.icon;

                const className = `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`;

                if (item.external) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={className}
                      title={item.description}
                    >
                      <Icon className='w-4 h-4 mr-2' />
                      <span>{item.name}</span>
                      <ExternalLink className='w-3 h-3 ml-1 opacity-50' />
                    </a>
                  );
                }

                return (
                  <Link key={item.name} to={item.href} className={className}>
                    <Icon className='w-4 h-4 mr-2' />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='lg:hidden p-2 rounded-md hover:bg-gray-100'
            >
              {mobileMenuOpen ? (
                <X className='w-5 h-5' />
              ) : (
                <Menu className='w-5 h-5' />
              )}
            </button>
          </div>

          {/* 移动端下拉菜单 */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='lg:hidden border-t border-gray-200'
            >
              <nav className='px-4 py-4 space-y-2'>
                {navigation.map(item => {
                  const isActive =
                    !item.external && location.pathname === item.href;
                  const Icon = item.icon;

                  const className = `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`;

                  if (item.external) {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        onClick={() => setMobileMenuOpen(false)}
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
                      onClick={() => setMobileMenuOpen(false)}
                      className={className}
                    >
                      <Icon className='w-5 h-5 mr-3' />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* 页面内容 */}
      <main className='max-w-7xl mx-auto px-4 lg:px-8 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
