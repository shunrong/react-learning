import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  category: string;
}

const navItems: NavItem[] = [
  { path: '/', label: '首页', category: '概览' },

  // 基础 Hooks
  { path: '/useState', label: 'useState', category: '基础 Hooks' },
  { path: '/useEffect', label: 'useEffect', category: '基础 Hooks' },
  { path: '/useContext', label: 'useContext', category: '基础 Hooks' },
  { path: '/useReducer', label: 'useReducer', category: '基础 Hooks' },

  // 性能优化 Hooks
  { path: '/useMemo', label: 'useMemo', category: '性能优化' },
  { path: '/useCallback', label: 'useCallback', category: '性能优化' },

  // 引用 Hooks
  { path: '/useRef', label: 'useRef', category: '引用 Hooks' },
  {
    path: '/useImperativeHandle',
    label: 'useImperativeHandle',
    category: '引用 Hooks',
  },

  // 副作用 Hooks
  {
    path: '/useLayoutEffect',
    label: 'useLayoutEffect',
    category: '副作用 Hooks',
  },

  // 调试 Hooks
  { path: '/useDebugValue', label: 'useDebugValue', category: '调试 Hooks' },

  // 高级主题
  { path: '/custom-hooks', label: '自定义 Hooks', category: '高级主题' },
  { path: '/hooks-principles', label: 'Hooks 原理', category: '高级主题' },
];

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 按分类分组导航项
  const groupedNavItems = navItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>
  );

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* 顶部导航栏 */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo 和标题 */}
            <div className='flex items-center'>
              <button
                className='lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </button>
              <Link to='/' className='flex items-center ml-2 lg:ml-0'>
                <img src='/react.svg' alt='React' className='w-8 h-8 mr-3' />
                <div>
                  <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                    React Hooks Playground
                  </h1>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    深度实践与原理解析
                  </p>
                </div>
              </Link>
            </div>

            {/* 右侧工具栏 */}
            <div className='flex items-center space-x-4'>
              <a
                href='https://github.com/facebook/react'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
              >
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    fillRule='evenodd'
                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className='flex'>
        {/* 侧边栏 */}
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className='h-full overflow-y-auto pt-20 lg:pt-6 pb-6'>
            <nav className='px-4 space-y-8'>
              {Object.entries(groupedNavItems).map(([category, items]) => (
                <div key={category}>
                  <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3'>
                    {category}
                  </h3>
                  <ul className='space-y-1'>
                    {items.map(item => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={clsx(
                            'block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                            location.pathname === item.path
                              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 border-r-2 border-blue-500'
                              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                          )}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* 遮罩层 (移动端) */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 主内容区域 */}
        <main className='flex-1 min-w-0'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
