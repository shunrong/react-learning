import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MemoryStick,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Bug,
  Shield,
  Timer,
  Headphones,
  Wifi,
} from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

// 有内存泄漏的组件 - 事件监听器未清理
function LeakyEventListener({ isActive }: { isActive: boolean }) {
  const [scrollY, setScrollY] = useState(0);
  const renderCount = useRef(0);

  renderCount.current += 1;

  useEffect(() => {
    if (!isActive) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // ❌ 故意不清理事件监听器，造成内存泄漏
    // return () => window.removeEventListener('scroll', handleScroll);
  }, [isActive]);

  return (
    <div className='p-4 border rounded-lg bg-red-50 border-red-200'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm font-medium text-red-700 flex items-center'>
          <Bug className='w-4 h-4 mr-1' />
          内存泄漏组件
        </span>
        <span className='text-xs text-red-500'>
          渲染: {renderCount.current}
        </span>
      </div>
      <div className='text-sm text-gray-600 mb-2'>
        事件监听器未清理 (Scroll Y: {scrollY})
      </div>
      <div className='text-xs text-red-600'>
        ⚠️ 每次组件卸载都会泄漏一个事件监听器
      </div>
    </div>
  );
}

// 修复的组件 - 正确清理事件监听器
function FixedEventListener({ isActive }: { isActive: boolean }) {
  const [scrollY, setScrollY] = useState(0);
  const renderCount = useRef(0);

  renderCount.current += 1;

  useEffect(() => {
    if (!isActive) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // ✅ 正确清理事件监听器
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isActive]);

  return (
    <div className='p-4 border rounded-lg bg-green-50 border-green-200'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm font-medium text-green-700 flex items-center'>
          <Shield className='w-4 h-4 mr-1' />
          修复后组件
        </span>
        <span className='text-xs text-green-500'>
          渲染: {renderCount.current}
        </span>
      </div>
      <div className='text-sm text-gray-600 mb-2'>
        正确清理事件监听器 (Scroll Y: {scrollY})
      </div>
      <div className='text-xs text-green-600'>
        ✅ 组件卸载时自动清理事件监听器
      </div>
    </div>
  );
}

// 定时器泄漏演示
function TimerLeakDemo() {
  const [leakyCount, setLeakyCount] = useState(0);
  const [fixedCount, setFixedCount] = useState(0);
  const [isLeakyActive, setIsLeakyActive] = useState(false);
  const [isFixedActive, setIsFixedActive] = useState(false);
  const leakyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fixedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ❌ 有内存泄漏的定时器
  const startLeakyTimer = () => {
    setIsLeakyActive(true);
    leakyTimerRef.current = setInterval(() => {
      setLeakyCount(prev => prev + 1);
    }, 1000);
  };

  const stopLeakyTimer = () => {
    setIsLeakyActive(false);
    // ❌ 故意不清理定时器
    // if (leakyTimerRef.current) {
    //   clearInterval(leakyTimerRef.current);
    // }
  };

  // ✅ 正确清理的定时器
  const startFixedTimer = () => {
    setIsFixedActive(true);
    fixedTimerRef.current = setInterval(() => {
      setFixedCount(prev => prev + 1);
    }, 1000);
  };

  const stopFixedTimer = () => {
    setIsFixedActive(false);
    if (fixedTimerRef.current) {
      clearInterval(fixedTimerRef.current);
      fixedTimerRef.current = null;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (fixedTimerRef.current) {
        clearInterval(fixedTimerRef.current);
      }
    };
  }, []);

  return (
    <div className='performance-card'>
      <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
        <Timer className='w-5 h-5 mr-2 text-performance-600' />
        定时器内存泄漏演示
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-4 border rounded-lg bg-red-50 border-red-200'>
          <div className='text-sm font-medium text-red-700 mb-3 flex items-center'>
            <Bug className='w-4 h-4 mr-1' />
            泄漏版本 (未清理定时器)
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-3'>
            计数: {leakyCount}
          </div>
          <div className='flex gap-2'>
            <button
              onClick={startLeakyTimer}
              disabled={isLeakyActive}
              className={`btn text-sm ${isLeakyActive ? 'bg-gray-400' : 'btn-primary'}`}
            >
              <Play className='w-4 h-4 mr-1' />
              启动
            </button>
            <button
              onClick={stopLeakyTimer}
              disabled={!isLeakyActive}
              className={`btn text-sm ${!isLeakyActive ? 'bg-gray-400' : 'bg-red-500 text-white hover:bg-red-600'}`}
            >
              <Pause className='w-4 h-4 mr-1' />
              停止 (有泄漏)
            </button>
          </div>
          <div className='text-xs text-red-600 mt-2'>
            ⚠️ 停止后定时器仍在运行
          </div>
        </div>

        <div className='p-4 border rounded-lg bg-green-50 border-green-200'>
          <div className='text-sm font-medium text-green-700 mb-3 flex items-center'>
            <Shield className='w-4 h-4 mr-1' />
            修复版本 (正确清理)
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-3'>
            计数: {fixedCount}
          </div>
          <div className='flex gap-2'>
            <button
              onClick={startFixedTimer}
              disabled={isFixedActive}
              className={`btn text-sm ${isFixedActive ? 'bg-gray-400' : 'btn-primary'}`}
            >
              <Play className='w-4 h-4 mr-1' />
              启动
            </button>
            <button
              onClick={stopFixedTimer}
              disabled={!isFixedActive}
              className={`btn text-sm ${!isFixedActive ? 'bg-gray-400' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              <Pause className='w-4 h-4 mr-1' />
              停止 (已清理)
            </button>
          </div>
          <div className='text-xs text-green-600 mt-2'>
            ✅ 停止后定时器完全清理
          </div>
        </div>
      </div>
    </div>
  );
}

// 异步操作内存泄漏演示
function AsyncLeakDemo() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ❌ 有内存泄漏的异步操作
  const fetchDataWithLeak = async () => {
    setLoading(true);
    setError(null);

    try {
      // 模拟慢请求
      await new Promise(resolve => setTimeout(resolve, 3000));
      // ❌ 组件可能已经卸载，但仍然更新状态
      setData('数据加载完成 (可能泄漏)');
      setLoading(false);
    } catch (err) {
      setError('加载失败');
      setLoading(false);
    }
  };

  // ✅ 正确处理的异步操作
  const fetchDataSafely = async () => {
    setLoading(true);
    setError(null);

    // 创建取消控制器
    abortControllerRef.current = new AbortController();

    try {
      // 模拟请求
      const response = await new Promise<any>((resolve, reject) => {
        const timer = setTimeout(
          () => resolve({ ok: true, text: () => Promise.resolve('安全数据') }),
          3000
        );

        abortControllerRef.current?.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('AbortError'));
        });
      });

      if (abortControllerRef.current?.signal.aborted) return;

      const result = await response.text();
      setData(result);
      setLoading(false);
    } catch (err: any) {
      if (err.message !== 'AbortError') {
        setError('加载失败');
        setLoading(false);
      }
    }
  };

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  return (
    <div className='performance-card'>
      <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
        <Wifi className='w-5 h-5 mr-2 text-performance-600' />
        异步操作内存泄漏演示
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-4 border rounded-lg bg-red-50 border-red-200'>
          <div className='text-sm font-medium text-red-700 mb-3 flex items-center'>
            <Bug className='w-4 h-4 mr-1' />
            泄漏版本 (未取消请求)
          </div>
          <button
            onClick={fetchDataWithLeak}
            disabled={loading}
            className={`btn text-sm mb-3 ${loading ? 'bg-gray-400' : 'btn-primary'}`}
          >
            {loading ? '加载中...' : '开始请求'}
          </button>
          <div className='text-sm text-gray-600'>
            {data && <div>✓ {data}</div>}
            {error && <div className='text-red-600'>✗ {error}</div>}
          </div>
          <div className='text-xs text-red-600 mt-2'>
            ⚠️ 组件卸载后请求仍可能更新状态
          </div>
        </div>

        <div className='p-4 border rounded-lg bg-green-50 border-green-200'>
          <div className='text-sm font-medium text-green-700 mb-3 flex items-center'>
            <Shield className='w-4 h-4 mr-1' />
            修复版本 (可取消请求)
          </div>
          <div className='flex gap-2 mb-3'>
            <button
              onClick={fetchDataSafely}
              disabled={loading}
              className={`btn text-sm ${loading ? 'bg-gray-400' : 'btn-primary'}`}
            >
              {loading ? '加载中...' : '安全请求'}
            </button>
            {loading && (
              <button
                onClick={cancelRequest}
                className='btn text-sm bg-red-500 text-white hover:bg-red-600'
              >
                取消
              </button>
            )}
          </div>
          <div className='text-sm text-gray-600'>
            {data && <div>✓ {data}</div>}
            {error && <div className='text-red-600'>✗ {error}</div>}
          </div>
          <div className='text-xs text-green-600 mt-2'>
            ✅ 组件卸载时自动取消未完成的请求
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemoryManagement() {
  const [showLeakyComponents, setShowLeakyComponents] = useState(false);
  const [componentCount, setComponentCount] = useState(0);
  const { memoryUsage, isMonitoring, startMonitoring, stopMonitoring } =
    usePerformanceMonitor();

  // 模拟创建和销毁组件
  const toggleComponents = () => {
    setShowLeakyComponents(!showLeakyComponents);
    setComponentCount(prev => prev + 1);
  };

  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6'>
          <MemoryStick className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          内存管理与优化
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          学习如何检测和修复 React 应用中的内存泄漏问题
        </p>

        <div className='mt-8'>
          <a
            href='/docs/concepts/performance'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-performance-600 text-white rounded-lg hover:bg-performance-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看内存优化理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 内存监控面板 */}
      <div className='performance-card mb-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            {memoryUsage && (
              <>
                <div className='text-lg font-bold text-gray-900'>
                  内存使用: {memoryUsage.used}MB / {memoryUsage.total}MB
                </div>
                <div
                  className={`text-sm px-2 py-1 rounded ${
                    memoryUsage.percentage > 80
                      ? 'bg-red-100 text-red-800'
                      : memoryUsage.percentage > 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {memoryUsage.percentage}%
                </div>
              </>
            )}
          </div>

          <div className='flex gap-2'>
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`btn ${isMonitoring ? 'bg-red-500 hover:bg-red-600 text-white' : 'btn-primary'}`}
            >
              {isMonitoring ? (
                <Pause className='w-4 h-4 mr-2' />
              ) : (
                <Play className='w-4 h-4 mr-2' />
              )}
              {isMonitoring ? '停止监控' : '开始监控'}
            </button>
          </div>
        </div>
      </div>

      {/* 事件监听器泄漏演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='performance-card mb-8'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
          <Headphones className='w-6 h-6 mr-2 text-blue-600' />
          事件监听器内存泄漏对比
        </h2>

        <div className='flex items-center justify-between mb-4'>
          <div className='text-sm text-gray-600'>
            组件创建/销毁次数: {componentCount}
          </div>
          <button onClick={toggleComponents} className='btn btn-outline'>
            <RotateCcw className='w-4 h-4 mr-2' />
            {showLeakyComponents ? '销毁组件' : '创建组件'}
          </button>
        </div>

        {showLeakyComponents && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <LeakyEventListener isActive={showLeakyComponents} />
            <FixedEventListener isActive={showLeakyComponents} />
          </div>
        )}

        <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='flex items-start'>
            <AlertTriangle className='w-5 h-5 text-blue-600 mr-2 mt-0.5' />
            <div>
              <div className='text-sm font-medium text-blue-800 mb-1'>
                观察要点
              </div>
              <div className='text-sm text-blue-700'>
                多次创建和销毁组件，观察内存使用情况。泄漏版本会不断累积事件监听器，
                而修复版本会正确清理。打开浏览器开发者工具的内存面板可以看到详细信息。
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 定时器泄漏演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mb-8'
      >
        <TimerLeakDemo />
      </motion.div>

      {/* 异步操作泄漏演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='mb-8'
      >
        <AsyncLeakDemo />
      </motion.div>

      {/* 最佳实践建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className='performance-card'
      >
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <TrendingUp className='w-5 h-5 mr-2 text-performance-600' />
          内存管理最佳实践
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Headphones className='w-8 h-8 text-blue-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              事件监听器
            </h4>
            <p className='text-sm text-gray-600'>
              在 useEffect 的 cleanup 函数中移除事件监听器
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Timer className='w-8 h-8 text-green-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              定时器清理
            </h4>
            <p className='text-sm text-gray-600'>
              确保清理所有 setTimeout 和 setInterval
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Wifi className='w-8 h-8 text-purple-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              异步操作
            </h4>
            <p className='text-sm text-gray-600'>
              使用 AbortController 取消未完成的请求
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
