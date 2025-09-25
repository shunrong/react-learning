import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='max-w-4xl mx-auto'>
      {/* 头部介绍 */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          React Hooks Playground
        </h1>
        <p className='text-xl text-gray-600 dark:text-gray-400 mb-6'>
          深入学习 React Hooks 的实践项目，包含所有内置 Hook
          的详细示例和原理解析
        </p>
        <div className='flex justify-center space-x-4'>
          <Link to='/useState' className='btn-primary'>
            开始学习
          </Link>
          <Link to='/hooks-principles' className='btn-secondary'>
            原理解析
          </Link>
        </div>
      </div>

      {/* 学习路径 */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
        {/* 基础 Hooks */}
        <div className='card p-6'>
          <div className='flex items-center mb-4'>
            <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-4'>
              <svg
                className='w-6 h-6 text-blue-600 dark:text-blue-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              基础 Hooks
            </h3>
          </div>
          <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
            掌握 React 最核心的状态管理和副作用处理 Hooks
          </p>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                to='/useState'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                useState - 状态管理
              </Link>
            </li>
            <li>
              <Link
                to='/useEffect'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                useEffect - 副作用处理
              </Link>
            </li>
            <li>
              <Link
                to='/useContext'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                useContext - 上下文共享
              </Link>
            </li>
            <li>
              <Link
                to='/useReducer'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                useReducer - 复杂状态
              </Link>
            </li>
          </ul>
        </div>

        {/* 性能优化 Hooks */}
        <div className='card p-6'>
          <div className='flex items-center mb-4'>
            <div className='w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mr-4'>
              <svg
                className='w-6 h-6 text-green-600 dark:text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              性能优化
            </h3>
          </div>
          <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
            学习如何使用 Hooks 优化组件性能，避免不必要的重新渲染
          </p>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                to='/useMemo'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                useMemo - 值缓存
              </Link>
            </li>
            <li>
              <Link
                to='/useCallback'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                useCallback - 函数缓存
              </Link>
            </li>
          </ul>
        </div>

        {/* 高级 Hooks */}
        <div className='card p-6'>
          <div className='flex items-center mb-4'>
            <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mr-4'>
              <svg
                className='w-6 h-6 text-purple-600 dark:text-purple-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              高级主题
            </h3>
          </div>
          <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
            深入理解 Hooks 的工作原理和高级使用技巧
          </p>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                to='/useRef'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                useRef - 引用操作
              </Link>
            </li>
            <li>
              <Link
                to='/custom-hooks'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                自定义 Hooks
              </Link>
            </li>
            <li>
              <Link
                to='/hooks-principles'
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                Hooks 原理解析
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 特色功能 */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 mb-12'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center'>
          项目特色
        </h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-blue-600 dark:text-blue-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
                />
              </svg>
            </div>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              实践驱动
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              每个 Hook 都有完整的实践示例和交互演示
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-green-600 dark:text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              原理解析
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              深入分析 Hooks 的实现原理和工作机制
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-yellow-600 dark:text-yellow-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              最佳实践
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              学习业界公认的 Hooks 使用最佳实践
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-purple-600 dark:text-purple-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                />
              </svg>
            </div>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              性能优化
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              掌握使用 Hooks 进行性能优化的技巧
            </p>
          </div>
        </div>
      </div>

      {/* 学习建议 */}
      <div className='card p-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
          学习建议
        </h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
              📚 学习路径
            </h3>
            <ol className='list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400'>
              <li>从基础 Hooks 开始，理解状态管理的概念</li>
              <li>学习副作用处理和上下文共享</li>
              <li>掌握性能优化相关的 Hooks</li>
              <li>探索高级 Hooks 和自定义 Hooks</li>
              <li>深入理解 Hooks 的实现原理</li>
            </ol>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
              💡 学习技巧
            </h3>
            <ul className='list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400'>
              <li>动手实践每个示例，观察状态变化</li>
              <li>尝试修改代码参数，观察不同效果</li>
              <li>思考每个 Hook 的适用场景</li>
              <li>对比类组件和函数组件的差异</li>
              <li>关注性能优化的最佳实践</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
