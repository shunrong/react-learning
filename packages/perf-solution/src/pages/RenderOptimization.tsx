import { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Activity,
  TrendingUp,
  ExternalLink,
  BookOpen,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useRenderTimeTracker } from '@/hooks/usePerformanceMonitor';
import { generateTestData } from '@/utils/performanceMonitor';

// 未优化的组件 - 每次都重渲染
function UnoptimizedChild({
  data,
  onClick,
}: {
  data: any;
  onClick: () => void;
}) {
  const renderTracker = useRenderTimeTracker('UnoptimizedChild');
  console.log(`UnoptimizedChild rendered ${renderTracker.renderCount} times`);

  return (
    <div className='p-4 border rounded-lg bg-red-50 border-red-200'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm font-medium text-red-700'>未优化组件</span>
        <span className='text-xs text-red-500'>
          渲染次数: {renderTracker.renderCount}
        </span>
      </div>
      <div className='text-sm text-gray-600 mb-3'>
        每次父组件更新都会重渲染，即使 data 没有变化
      </div>
      <button onClick={onClick} className='btn-primary text-sm'>
        点击我 ({data.length} 项)
      </button>
    </div>
  );
}

// 使用 memo 优化的组件
const OptimizedChild = memo(function OptimizedChild({
  data,
  onClick,
}: {
  data: any;
  onClick: () => void;
}) {
  const renderTracker = useRenderTimeTracker('OptimizedChild');
  console.log(`OptimizedChild rendered ${renderTracker.renderCount} times`);

  return (
    <div className='p-4 border rounded-lg bg-green-50 border-green-200'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm font-medium text-green-700'>
          React.memo 优化
        </span>
        <span className='text-xs text-green-500'>
          渲染次数: {renderTracker.renderCount}
        </span>
      </div>
      <div className='text-sm text-gray-600 mb-3'>
        只有当 props 真正变化时才重渲染
      </div>
      <button onClick={onClick} className='btn-primary text-sm'>
        点击我 ({data.length} 项)
      </button>
    </div>
  );
});

// 复杂计算组件 - 展示 useMemo 优化
function ExpensiveCalculation({ numbers }: { numbers: number[] }) {
  const renderTracker = useRenderTimeTracker('ExpensiveCalculation');

  // 未优化版本 - 每次渲染都计算
  const expensiveValueWithoutMemo = numbers.reduce((sum, num) => {
    // 模拟复杂计算
    for (let i = 0; i < 1000; i++) {
      sum += Math.sqrt(num);
    }
    return sum;
  }, 0);

  // 优化版本 - 使用 useMemo 缓存
  const expensiveValueWithMemo = useMemo(() => {
    console.log('Computing expensive value...');
    return numbers.reduce((sum, num) => {
      // 模拟复杂计算
      for (let i = 0; i < 1000; i++) {
        sum += Math.sqrt(num);
      }
      return sum;
    }, 0);
  }, [numbers]);

  return (
    <div className='performance-card'>
      <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
        <Timer className='w-5 h-5 mr-2 text-performance-600' />
        useMemo 计算优化演示
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='p-4 border rounded-lg bg-red-50 border-red-200'>
          <div className='text-sm font-medium text-red-700 mb-2'>
            未优化计算
          </div>
          <div className='text-xs text-gray-600 mb-2'>每次渲染都计算</div>
          <div className='text-lg font-bold text-gray-900'>
            {expensiveValueWithoutMemo.toFixed(2)}
          </div>
        </div>

        <div className='p-4 border rounded-lg bg-green-50 border-green-200'>
          <div className='text-sm font-medium text-green-700 mb-2'>
            useMemo 优化
          </div>
          <div className='text-xs text-gray-600 mb-2'>缓存计算结果</div>
          <div className='text-lg font-bold text-gray-900'>
            {expensiveValueWithMemo.toFixed(2)}
          </div>
        </div>
      </div>

      <div className='mt-4 text-xs text-gray-500'>
        渲染次数: {renderTracker.renderCount} | 平均渲染时间:{' '}
        {renderTracker.getAverageRenderTime().toFixed(2)}ms
      </div>
    </div>
  );
}

// 函数优化示例
function CallbackOptimization() {
  const [items] = useState(generateTestData(5));
  const [filter, setFilter] = useState('');
  const renderTracker = useRenderTimeTracker('CallbackOptimization');

  // 未优化 - 每次渲染都创建新函数
  const handleItemClickBad = (id: number) => {
    console.log('Item clicked:', id);
  };

  // 优化 - 使用 useCallback 缓存函数
  const handleItemClick = useCallback((id: number) => {
    console.log('Item clicked:', id);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div className='performance-card'>
      <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
        <Activity className='w-5 h-5 mr-2 text-performance-600' />
        useCallback 函数优化演示
      </h3>

      <div className='mb-4'>
        <input
          type='text'
          placeholder='过滤项目...'
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-performance-500'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <h4 className='text-sm font-medium text-red-700 mb-2'>
            未优化函数 (每次都是新函数)
          </h4>
          <div className='space-y-2'>
            {filteredItems.slice(0, 3).map(item => (
              <UnoptimizedListItem
                key={`bad-${item.id}`}
                item={item}
                onClick={handleItemClickBad}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className='text-sm font-medium text-green-700 mb-2'>
            useCallback 优化 (缓存函数引用)
          </h4>
          <div className='space-y-2'>
            {filteredItems.slice(0, 3).map(item => (
              <OptimizedListItem
                key={`good-${item.id}`}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      </div>

      <div className='mt-4 text-xs text-gray-500'>
        渲染次数: {renderTracker.renderCount}
      </div>
    </div>
  );
}

// 未优化的列表项
function UnoptimizedListItem({
  item,
  onClick,
}: {
  item: any;
  onClick: (id: number) => void;
}) {
  const renderTracker = useRenderTimeTracker(`UnoptimizedListItem-${item.id}`);

  return (
    <div
      className='p-2 border border-red-200 rounded bg-red-50 cursor-pointer hover:bg-red-100 transition-colors'
      onClick={() => onClick(item.id)}
    >
      <div className='text-sm font-medium'>{item.name}</div>
      <div className='text-xs text-gray-500'>
        渲染: {renderTracker.renderCount}次
      </div>
    </div>
  );
}

// 使用 memo 优化的列表项
const OptimizedListItem = memo(function OptimizedListItem({
  item,
  onClick,
}: {
  item: any;
  onClick: (id: number) => void;
}) {
  const renderTracker = useRenderTimeTracker(`OptimizedListItem-${item.id}`);

  return (
    <div
      className='p-2 border border-green-200 rounded bg-green-50 cursor-pointer hover:bg-green-100 transition-colors'
      onClick={() => onClick(item.id)}
    >
      <div className='text-sm font-medium'>{item.name}</div>
      <div className='text-xs text-gray-500'>
        渲染: {renderTracker.renderCount}次
      </div>
    </div>
  );
});

export default function RenderOptimization() {
  const [counter, setCounter] = useState(0);
  const [staticData] = useState(generateTestData(10));
  const [numbers] = useState([1, 2, 3, 4, 5]);
  const [isRunning, setIsRunning] = useState(false);

  const renderTracker = useRenderTimeTracker('RenderOptimization');

  // 模拟频繁更新
  const startUpdates = () => {
    setIsRunning(true);
    const interval = setInterval(() => {
      setCounter(prev => prev + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsRunning(false);
    }, 5000);
  };

  const handleStaticClick = useCallback(() => {
    console.log('Static data clicked');
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-6'>
          <Zap className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          React 渲染优化技术
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          通过 React.memo、useMemo、useCallback 等技术优化组件渲染性能
        </p>

        {/* 理论文档链接 */}
        <div className='mt-8'>
          <a
            href='/docs/concepts/performance'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-performance-600 text-white rounded-lg hover:bg-performance-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看渲染优化理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 控制面板 */}
      <div className='performance-card mb-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='text-lg font-bold text-gray-900'>
              计数器: {counter}
            </div>
            <div className='text-sm text-gray-500'>
              主组件渲染次数: {renderTracker.renderCount}
            </div>
            <div className='text-sm text-gray-500'>
              平均渲染时间: {renderTracker.getAverageRenderTime().toFixed(2)}ms
            </div>
          </div>

          <div className='flex gap-2'>
            <button
              onClick={startUpdates}
              disabled={isRunning}
              className={`btn ${isRunning ? 'bg-gray-400' : 'btn-primary'}`}
            >
              {isRunning ? (
                <Pause className='w-4 h-4 mr-2' />
              ) : (
                <Play className='w-4 h-4 mr-2' />
              )}
              {isRunning ? '运行中...' : '开始频繁更新'}
            </button>

            <button onClick={() => setCounter(0)} className='btn btn-outline'>
              <RotateCcw className='w-4 h-4 mr-2' />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* React.memo 对比演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='performance-card mb-8'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
          <CheckCircle className='w-6 h-6 mr-2 text-green-600' />
          React.memo 优化对比
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <UnoptimizedChild data={staticData} onClick={handleStaticClick} />
          <OptimizedChild data={staticData} onClick={handleStaticClick} />
        </div>

        <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='flex items-start'>
            <AlertTriangle className='w-5 h-5 text-blue-600 mr-2 mt-0.5' />
            <div>
              <div className='text-sm font-medium text-blue-800 mb-1'>
                观察要点
              </div>
              <div className='text-sm text-blue-700'>
                点击"开始频繁更新"按钮，观察两个组件的渲染次数差异。
                未优化组件会随着父组件每次更新而重渲染，而 React.memo
                优化的组件由于 props 没有变化，不会重渲染。
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* useMemo 演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mb-8'
      >
        <ExpensiveCalculation numbers={numbers} />
      </motion.div>

      {/* useCallback 演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='mb-8'
      >
        <CallbackOptimization />
      </motion.div>

      {/* 优化建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className='performance-card'
      >
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <TrendingUp className='w-5 h-5 mr-2 text-performance-600' />
          渲染优化最佳实践
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Zap className='w-8 h-8 text-yellow-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              React.memo
            </h4>
            <p className='text-sm text-gray-600'>
              包装纯展示组件，避免不必要的重渲染
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Timer className='w-8 h-8 text-blue-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              useMemo
            </h4>
            <p className='text-sm text-gray-600'>
              缓存昂贵的计算结果，减少重复计算
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Activity className='w-8 h-8 text-green-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              useCallback
            </h4>
            <p className='text-sm text-gray-600'>
              缓存函数引用，避免子组件重渲染
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
