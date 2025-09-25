import { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ExternalLink,
  BookOpen,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Timer,
  MemoryStick,
  Package,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import {
  usePerformanceMonitor,
  useRenderTimeTracker,
} from '@/hooks/usePerformanceMonitor';
import { generateTestData } from '@/utils/performanceMonitor';

// 未优化的组件
function UnoptimizedComponent({
  data,
  onUpdate,
}: {
  data: any[];
  onUpdate: () => void;
}) {
  const renderTracker = useRenderTimeTracker('UnoptimizedComponent');

  // ❌ 每次渲染都执行复杂计算
  const expensiveCalculation = data.reduce((sum, item) => {
    // 模拟复杂计算
    for (let i = 0; i < 1000; i++) {
      sum += Math.sqrt(item.value || 0);
    }
    return sum;
  }, 0);

  // ❌ 每次渲染都创建新函数
  const handleClick = (id: number) => {
    console.log('Clicked:', id);
    onUpdate();
  };

  return (
    <div className='p-4 border rounded-lg bg-red-50 border-red-200'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-red-700'>未优化组件</h3>
        <div className='text-xs text-red-500'>
          渲染次数: {renderTracker.renderCount} | 平均耗时:{' '}
          {renderTracker.getAverageRenderTime().toFixed(2)}ms
        </div>
      </div>

      <div className='bg-white p-3 rounded mb-4'>
        <div className='text-sm text-gray-600 mb-2'>复杂计算结果:</div>
        <div className='text-xl font-bold text-gray-900'>
          {expensiveCalculation.toFixed(2)}
        </div>
      </div>

      <div className='space-y-2 max-h-40 overflow-auto'>
        {data.slice(0, 5).map(item => (
          <div
            key={item.id}
            className='p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer'
            onClick={() => handleClick(item.id)}
          >
            <div className='text-sm font-medium'>{item.name}</div>
            <div className='text-xs text-gray-500'>
              值: {item.value?.toFixed(1)}
            </div>
          </div>
        ))}
      </div>

      <div className='mt-4 text-xs text-red-600'>
        ⚠️ 问题: 每次渲染都计算、创建新函数、未使用记忆化
      </div>
    </div>
  );
}

// 优化的组件
const OptimizedComponent = memo(function OptimizedComponent({
  data,
  onUpdate,
}: {
  data: any[];
  onUpdate: () => void;
}) {
  const renderTracker = useRenderTimeTracker('OptimizedComponent');

  // ✅ 使用 useMemo 缓存复杂计算
  const expensiveCalculation = useMemo(() => {
    return data.reduce((sum, item) => {
      // 模拟复杂计算
      for (let i = 0; i < 1000; i++) {
        sum += Math.sqrt(item.value || 0);
      }
      return sum;
    }, 0);
  }, [data]);

  // ✅ 使用 useCallback 缓存函数
  const handleClick = useCallback(
    (id: number) => {
      console.log('Clicked:', id);
      onUpdate();
    },
    [onUpdate]
  );

  return (
    <div className='p-4 border rounded-lg bg-green-50 border-green-200'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-green-700'>优化后组件</h3>
        <div className='text-xs text-green-500'>
          渲染次数: {renderTracker.renderCount} | 平均耗时:{' '}
          {renderTracker.getAverageRenderTime().toFixed(2)}ms
        </div>
      </div>

      <div className='bg-white p-3 rounded mb-4'>
        <div className='text-sm text-gray-600 mb-2'>缓存计算结果:</div>
        <div className='text-xl font-bold text-gray-900'>
          {expensiveCalculation.toFixed(2)}
        </div>
      </div>

      <div className='space-y-2 max-h-40 overflow-auto'>
        {data.slice(0, 5).map(item => (
          <OptimizedListItem key={item.id} item={item} onClick={handleClick} />
        ))}
      </div>

      <div className='mt-4 text-xs text-green-600'>
        ✅ 优化: React.memo + useMemo + useCallback + 子组件优化
      </div>
    </div>
  );
});

// 优化的列表项
const OptimizedListItem = memo(function OptimizedListItem({
  item,
  onClick,
}: {
  item: any;
  onClick: (id: number) => void;
}) {
  return (
    <div
      className='p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer transition-colors'
      onClick={() => onClick(item.id)}
    >
      <div className='text-sm font-medium'>{item.name}</div>
      <div className='text-xs text-gray-500'>值: {item.value?.toFixed(1)}</div>
    </div>
  );
});

// 性能指标对比
function PerformanceMetricsComparison() {
  const { metrics, isMonitoring, startMonitoring, stopMonitoring } =
    usePerformanceMonitor();

  const [beforeMetrics] = useState({
    renderTime: 85.6,
    memoryUsage: 45.2,
    rerenderCount: 156,
    bundleSize: 2.3,
    fcp: 2800,
    lcp: 4200,
  });

  const afterMetrics = {
    renderTime: metrics?.renderTime || 12.3,
    memoryUsage: metrics?.memoryUsage || 28.7,
    rerenderCount: metrics?.rerenderCount || 23,
    bundleSize: 1.1,
    fcp: 1200,
    lcp: 1800,
  };

  const improvements = {
    renderTime:
      ((beforeMetrics.renderTime - afterMetrics.renderTime) /
        beforeMetrics.renderTime) *
      100,
    memoryUsage:
      ((beforeMetrics.memoryUsage - afterMetrics.memoryUsage) /
        beforeMetrics.memoryUsage) *
      100,
    rerenderCount:
      ((beforeMetrics.rerenderCount - afterMetrics.rerenderCount) /
        beforeMetrics.rerenderCount) *
      100,
    bundleSize:
      ((beforeMetrics.bundleSize - afterMetrics.bundleSize) /
        beforeMetrics.bundleSize) *
      100,
    fcp: ((beforeMetrics.fcp - afterMetrics.fcp) / beforeMetrics.fcp) * 100,
    lcp: ((beforeMetrics.lcp - afterMetrics.lcp) / beforeMetrics.lcp) * 100,
  };

  const metricConfig = [
    {
      key: 'renderTime' as const,
      label: '渲染时间',
      unit: 'ms',
      icon: Timer,
      color: 'blue',
      target: '< 16ms',
    },
    {
      key: 'memoryUsage' as const,
      label: '内存使用',
      unit: 'MB',
      icon: MemoryStick,
      color: 'green',
      target: '< 50MB',
    },
    {
      key: 'rerenderCount' as const,
      label: '重渲染次数',
      unit: '次',
      icon: Activity,
      color: 'purple',
      target: '< 50次',
    },
    {
      key: 'bundleSize' as const,
      label: '包体积',
      unit: 'MB',
      icon: Package,
      color: 'orange',
      target: '< 2MB',
    },
    {
      key: 'fcp' as const,
      label: 'FCP',
      unit: 'ms',
      icon: Zap,
      color: 'red',
      target: '< 1.8s',
    },
    {
      key: 'lcp' as const,
      label: 'LCP',
      unit: 'ms',
      icon: TrendingUp,
      color: 'indigo',
      target: '< 2.5s',
    },
  ];

  return (
    <div className='performance-card'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold text-gray-900 flex items-center'>
          <BarChart3 className='w-5 h-5 mr-2 text-performance-600' />
          性能指标对比分析
        </h3>

        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          className={`btn text-sm ${isMonitoring ? 'bg-red-500 hover:bg-red-600 text-white' : 'btn-primary'}`}
        >
          {isMonitoring ? (
            <Pause className='w-4 h-4 mr-1' />
          ) : (
            <Play className='w-4 h-4 mr-1' />
          )}
          {isMonitoring ? '停止监控' : '开始监控'}
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {metricConfig.map(config => {
          const Icon = config.icon;
          const before = beforeMetrics[config.key];
          const after = afterMetrics[config.key];
          const improvement = improvements[config.key];
          const isImproved = improvement > 0;

          return (
            <div
              key={config.key}
              className='bg-white border border-gray-200 rounded-lg p-4'
            >
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center'>
                  <div
                    className={`w-8 h-8 bg-${config.color}-100 rounded-lg flex items-center justify-center mr-2`}
                  >
                    <Icon className={`w-4 h-4 text-${config.color}-600`} />
                  </div>
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      {config.label}
                    </div>
                    <div className='text-xs text-gray-500'>{config.target}</div>
                  </div>
                </div>

                <div
                  className={`flex items-center text-sm font-medium ${
                    isImproved ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isImproved ? (
                    <TrendingDown className='w-4 h-4 mr-1' />
                  ) : (
                    <TrendingUp className='w-4 h-4 mr-1' />
                  )}
                  {Math.abs(improvement).toFixed(1)}%
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-gray-500'>优化前:</span>
                  <span className='text-sm font-medium text-red-600'>
                    {before.toFixed(1)} {config.unit}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-gray-500'>优化后:</span>
                  <span className='text-sm font-medium text-green-600'>
                    {after.toFixed(1)} {config.unit}
                  </span>
                </div>
              </div>

              <div className='mt-3'>
                <div className='flex justify-between text-xs text-gray-500 mb-1'>
                  <span>改善程度</span>
                  <span>{improvement.toFixed(1)}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isImproved ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.abs(improvement))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Comparison() {
  const [data, setData] = useState(() => generateTestData(20));
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [isAutoUpdate, setIsAutoUpdate] = useState(false);

  const handleUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const regenerateData = useCallback(() => {
    setData(generateTestData(20));
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const startAutoUpdate = useCallback(() => {
    setIsAutoUpdate(true);
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setIsAutoUpdate(false);
    }, 10000);
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
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl mb-6'>
          <BarChart3 className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>性能对比分析</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          优化前后的性能指标对比和效果评估
        </p>

        <div className='mt-8'>
          <a
            href='/docs/concepts/performance'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-performance-600 text-white rounded-lg hover:bg-performance-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看性能分析理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 控制面板 */}
      <div className='performance-card mb-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='text-sm text-gray-600'>
              触发更新次数:{' '}
              <span className='font-bold text-gray-900'>{updateTrigger}</span>
            </div>
            <div className='text-sm text-gray-600'>
              数据项:{' '}
              <span className='font-bold text-gray-900'>{data.length}</span>
            </div>
          </div>

          <div className='flex gap-2'>
            <button onClick={handleUpdate} className='btn btn-outline text-sm'>
              <Zap className='w-4 h-4 mr-1' />
              触发更新
            </button>

            <button
              onClick={regenerateData}
              className='btn btn-outline text-sm'
            >
              <RotateCcw className='w-4 h-4 mr-1' />
              重新生成数据
            </button>

            <button
              onClick={startAutoUpdate}
              disabled={isAutoUpdate}
              className={`btn text-sm ${isAutoUpdate ? 'bg-gray-400' : 'btn-primary'}`}
            >
              {isAutoUpdate ? (
                <Pause className='w-4 h-4 mr-1' />
              ) : (
                <Play className='w-4 h-4 mr-1' />
              )}
              {isAutoUpdate ? '自动更新中...' : '开始压力测试'}
            </button>
          </div>
        </div>
      </div>

      {/* 组件对比演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='performance-card mb-8'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
          <Activity className='w-6 h-6 mr-2 text-cyan-600' />
          组件性能对比演示
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <UnoptimizedComponent data={data} onUpdate={handleUpdate} />
          <OptimizedComponent data={data} onUpdate={handleUpdate} />
        </div>

        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='text-sm font-medium text-blue-800 mb-2'>
            对比测试说明
          </div>
          <div className='text-sm text-blue-700 space-y-1'>
            <div>
              • <strong>点击"触发更新"</strong>: 观察两个组件的渲染性能差异
            </div>
            <div>
              • <strong>开始压力测试</strong>:
              10秒内每0.5秒触发一次更新，测试高频更新场景
            </div>
            <div>
              • <strong>重新生成数据</strong>:
              更换测试数据，观察useMemo的缓存效果
            </div>
            <div>
              • <strong>关注指标</strong>: 渲染次数、平均渲染时间、页面响应性
            </div>
          </div>
        </div>
      </motion.div>

      {/* 性能指标对比 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mb-8'
      >
        <PerformanceMetricsComparison />
      </motion.div>

      {/* 优化效果总结 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='performance-card'
      >
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <TrendingUp className='w-5 h-5 mr-2 text-performance-600' />
          优化效果总结
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <CheckCircle className='w-5 h-5 mr-2 text-green-600' />
              优化成果
            </h4>
            <div className='space-y-3'>
              <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
                <span className='text-sm font-medium text-gray-900'>
                  渲染性能提升
                </span>
                <span className='text-lg font-bold text-green-600'>85%+</span>
              </div>
              <div className='flex items-center justify-between p-3 bg-blue-50 rounded-lg'>
                <span className='text-sm font-medium text-gray-900'>
                  内存使用减少
                </span>
                <span className='text-lg font-bold text-blue-600'>36%+</span>
              </div>
              <div className='flex items-center justify-between p-3 bg-purple-50 rounded-lg'>
                <span className='text-sm font-medium text-gray-900'>
                  重渲染减少
                </span>
                <span className='text-lg font-bold text-purple-600'>85%+</span>
              </div>
              <div className='flex items-center justify-between p-3 bg-orange-50 rounded-lg'>
                <span className='text-sm font-medium text-gray-900'>
                  包体积减少
                </span>
                <span className='text-lg font-bold text-orange-600'>52%+</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <Activity className='w-5 h-5 mr-2 text-blue-600' />
              优化技术
            </h4>
            <div className='space-y-3'>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <div className='text-sm font-medium text-gray-900 mb-1'>
                  React.memo
                </div>
                <div className='text-xs text-gray-600'>
                  避免不必要的组件重渲染
                </div>
              </div>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <div className='text-sm font-medium text-gray-900 mb-1'>
                  useMemo
                </div>
                <div className='text-xs text-gray-600'>缓存昂贵的计算结果</div>
              </div>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <div className='text-sm font-medium text-gray-900 mb-1'>
                  useCallback
                </div>
                <div className='text-xs text-gray-600'>
                  缓存函数引用，优化子组件
                </div>
              </div>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <div className='text-sm font-medium text-gray-900 mb-1'>
                  代码分割
                </div>
                <div className='text-xs text-gray-600'>
                  按需加载，减少初始包大小
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg'>
          <div className='text-center'>
            <div className='text-lg font-bold text-gray-900 mb-2'>
              🎉 整体性能提升: 70%+
            </div>
            <div className='text-sm text-gray-600'>
              通过系统性的性能优化，应用响应速度显著提升，用户体验大幅改善
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
