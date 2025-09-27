import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

// 导入各种状态管理方案的示例
import ReduxToolkitExample from '@/examples/redux-toolkit/ReduxToolkitExample';
import ZustandExample from '@/examples/zustand/ZustandExample';
import JotaiExample from '@/examples/jotai/JotaiExample';
import ContextReducerExample from '@/examples/context-reducer/ContextReducerExample';
import ComparisonExample from '@/examples/comparison/ComparisonExample';
import PerformanceExample from '@/examples/performance/PerformanceExample';

// 导航配置
const navigation = [
  {
    name: 'Redux Toolkit',
    path: '/redux-toolkit',
    description: '现代 Redux 最佳实践',
    icon: '⚛️',
  },
  {
    name: 'Zustand',
    path: '/zustand',
    description: '轻量级状态管理',
    icon: '🐻',
  },
  {
    name: 'Jotai',
    path: '/jotai',
    description: '原子化状态管理',
    icon: '⚛️',
  },
  {
    name: 'Context + useReducer',
    path: '/context-reducer',
    description: 'React 内置方案',
    icon: '🎣',
  },
  {
    name: '方案对比',
    path: '/comparison',
    description: '并排对比不同方案',
    icon: '📊',
  },
  {
    name: '性能基准',
    path: '/performance',
    description: '性能测试与分析',
    icon: '⚡',
  },
];

const HomePage: React.FC = () => {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          React 状态管理方案对比
        </h1>
        <p className='text-xl text-gray-600 mb-8'>
          通过同一个 Todo 应用深入对比不同的状态管理解决方案
        </p>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <h2 className='text-lg font-semibold text-blue-900 mb-2'>
            🎯 学习目标
          </h2>
          <ul className='text-left text-blue-800 space-y-2'>
            <li>• 理解不同状态管理方案的设计思想和使用场景</li>
            <li>• 通过相同功能的实现对比各方案的优缺点</li>
            <li>• 掌握现代 React 状态管理的最佳实践</li>
            <li>• 学会根据项目需求选择合适的状态管理方案</li>
          </ul>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {navigation.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className='block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200'
          >
            <div className='text-3xl mb-3'>{item.icon}</div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {item.name}
            </h3>
            <p className='text-gray-600 text-sm'>{item.description}</p>
          </NavLink>
        ))}
      </div>

      <div className='mt-12 bg-gray-50 rounded-lg p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          📚 对比维度
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <h3 className='font-medium text-gray-800 mb-2'>代码复杂度</h3>
            <ul className='text-gray-600 space-y-1'>
              <li>• 样板代码数量</li>
              <li>• 学习曲线陡峭程度</li>
              <li>• 类型安全性</li>
            </ul>
          </div>
          <div>
            <h3 className='font-medium text-gray-800 mb-2'>性能表现</h3>
            <ul className='text-gray-600 space-y-1'>
              <li>• 渲染优化能力</li>
              <li>• 内存使用效率</li>
              <li>• Bundle 大小影响</li>
            </ul>
          </div>
          <div>
            <h3 className='font-medium text-gray-800 mb-2'>开发体验</h3>
            <ul className='text-gray-600 space-y-1'>
              <li>• DevTools 支持</li>
              <li>• 调试便利性</li>
              <li>• 生态系统完善度</li>
            </ul>
          </div>
          <div>
            <h3 className='font-medium text-gray-800 mb-2'>适用场景</h3>
            <ul className='text-gray-600 space-y-1'>
              <li>• 项目规模匹配度</li>
              <li>• 团队协作友好性</li>
              <li>• 维护成本考量</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 导航栏 */}
      <nav className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <NavLink
                to='/'
                className='text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors'
              >
                🎯 状态管理对比
              </NavLink>
            </div>

            {!isHomePage && (
              <div className='flex space-x-1'>
                {navigation.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      clsx('nav-link', isActive ? 'active' : '')
                    }
                  >
                    <span className='mr-1'>{item.icon}</span>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/redux-toolkit' element={<ReduxToolkitExample />} />
          <Route path='/zustand' element={<ZustandExample />} />
          <Route path='/jotai' element={<JotaiExample />} />
          <Route path='/context-reducer' element={<ContextReducerExample />} />
          <Route path='/comparison' element={<ComparisonExample />} />
          <Route path='/performance' element={<PerformanceExample />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
