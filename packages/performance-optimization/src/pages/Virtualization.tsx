import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ExternalLink,
  BookOpen,
  Activity,
  List,
  Zap,
  BarChart3,
  Users,
  Timer,
  Settings,
  Play,
  Pause,
} from 'lucide-react';
import {
  useVirtualization,
  useRenderTimeTracker,
} from '@/hooks/usePerformanceMonitor';
import { generateTestData } from '@/utils/performanceMonitor';

// 普通列表组件 (非虚拟化)
function RegularList({
  items,
  onItemClick,
}: {
  items: any[];
  onItemClick: (id: number) => void;
}) {
  const renderTracker = useRenderTimeTracker('RegularList');

  return (
    <div className='h-80 overflow-auto border border-gray-300 rounded-lg p-4 bg-white'>
      <div className='text-xs text-gray-500 mb-2 sticky top-0 bg-white'>
        普通列表 - 渲染次数: {renderTracker.renderCount} | 平均耗时:{' '}
        {renderTracker.getAverageRenderTime().toFixed(2)}ms
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          className='p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors'
          onClick={() => onItemClick(item.id)}
        >
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-medium text-gray-900'>
                #{index + 1} {item.name}
              </div>
              <div className='text-sm text-gray-500'>{item.description}</div>
            </div>
            <div className='text-sm text-gray-400'>
              分值: {item.value.toFixed(1)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 虚拟化列表组件
function VirtualizedList({
  items,
  onItemClick,
  itemHeight = 80,
  containerHeight = 320,
}: {
  items: any[];
  onItemClick: (id: number) => void;
  itemHeight?: number;
  containerHeight?: number;
}) {
  const renderTracker = useRenderTimeTracker('VirtualizedList');

  const { visibleItems, totalHeight, handleScroll, visibleStart, visibleEnd } =
    useVirtualization(items.length, itemHeight, containerHeight);

  return (
    <div
      className='border border-gray-300 rounded-lg overflow-hidden bg-white'
      style={{ height: containerHeight }}
    >
      <div className='text-xs text-gray-500 p-2 border-b bg-gray-50'>
        虚拟化列表 - 渲染次数: {renderTracker.renderCount} | 显示项:{' '}
        {visibleStart + 1}-{visibleEnd + 1} / {items.length} | 平均耗时:{' '}
        {renderTracker.getAverageRenderTime().toFixed(2)}ms
      </div>
      <div
        className='overflow-auto'
        style={{ height: containerHeight - 40 }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(index => {
            const item = items[index];
            if (!item) return null;

            return (
              <div
                key={item.id}
                className='p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors absolute left-0 right-0'
                style={{
                  top: index * itemHeight,
                  height: itemHeight,
                }}
                onClick={() => onItemClick(item.id)}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='font-medium text-gray-900'>
                      #{index + 1} {item.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {item.description}
                    </div>
                  </div>
                  <div className='text-sm text-gray-400'>
                    分值: {item.value.toFixed(1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 无限滚动演示
function InfiniteScrollDemo() {
  const [items, setItems] = useState(() => generateTestData(100));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newItems = generateTestData(50).map(item => ({
      ...item,
      id: item.id + items.length,
    }));

    setItems(prev => [...prev, ...newItems]);
    setLoading(false);

    // 模拟数据耗尽
    if (items.length >= 500) {
      setHasMore(false);
    }
  }, [items.length, loading, hasMore]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      // 当滚动到底部附近时加载更多
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        loadMore();
      }
    },
    [loadMore]
  );

  return (
    <div className='performance-card'>
      <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
        <List className='w-5 h-5 mr-2 text-performance-600' />
        无限滚动演示
      </h3>

      <div
        className='h-80 overflow-auto border border-gray-300 rounded-lg bg-white'
        onScroll={handleScroll}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className='p-3 border-b border-gray-100 hover:bg-gray-50'
          >
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-gray-900'>
                  #{index + 1} {item.name}
                </div>
                <div className='text-sm text-gray-500'>{item.description}</div>
              </div>
              <div className='text-sm text-gray-400'>
                分值: {item.value.toFixed(1)}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className='p-4 text-center text-gray-500'>
            <div className='animate-spin rounded-full h-6 w-6 border-2 border-performance-600 border-t-transparent mx-auto mb-2'></div>
            加载更多...
          </div>
        )}

        {!hasMore && (
          <div className='p-4 text-center text-gray-400'>没有更多数据了</div>
        )}
      </div>

      <div className='mt-4 text-sm text-gray-600'>
        已加载 {items.length} 项 | {hasMore ? '滚动加载更多' : '加载完成'}
      </div>
    </div>
  );
}

export default function Virtualization() {
  const [itemCount, setItemCount] = useState(1000);
  const [testData, setTestData] = useState(() => generateTestData(1000));
  const [isStressTest, setIsStressTest] = useState(false);

  // 更新测试数据
  const updateTestData = (count: number) => {
    setItemCount(count);
    setTestData(generateTestData(count));
  };

  // 压力测试
  const runStressTest = () => {
    setIsStressTest(true);
    const counts = [5000, 10000, 20000];
    let index = 0;

    const interval = setInterval(() => {
      if (index >= counts.length) {
        clearInterval(interval);
        setIsStressTest(false);
        return;
      }

      updateTestData(counts[index]);
      index++;
    }, 3000);
  };

  const handleItemClick = useCallback((id: number) => {
    console.log('Item clicked:', id);
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
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6'>
          <Layers className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>虚拟化技术</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          通过虚拟滚动和窗口化技术优化大列表性能
        </p>

        <div className='mt-8'>
          <a
            href='/docs/concepts/performance'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-performance-600 text-white rounded-lg hover:bg-performance-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看虚拟化理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 控制面板 */}
      <div className='performance-card mb-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5 text-gray-500' />
              <span className='text-sm font-medium text-gray-700'>数据量:</span>
              <span className='text-lg font-bold text-gray-900'>
                {itemCount.toLocaleString()}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <Settings className='w-4 h-4 text-gray-500' />
              <select
                value={itemCount}
                onChange={e => updateTestData(Number(e.target.value))}
                className='px-3 py-1 border border-gray-300 rounded-md text-sm'
                disabled={isStressTest}
              >
                <option value={100}>100 项</option>
                <option value={500}>500 项</option>
                <option value={1000}>1,000 项</option>
                <option value={5000}>5,000 项</option>
                <option value={10000}>10,000 项</option>
                <option value={20000}>20,000 项</option>
              </select>
            </div>
          </div>

          <div className='flex gap-2'>
            <button
              onClick={runStressTest}
              disabled={isStressTest}
              className={`btn ${isStressTest ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              {isStressTest ? (
                <Pause className='w-4 h-4 mr-2' />
              ) : (
                <Play className='w-4 h-4 mr-2' />
              )}
              {isStressTest ? '压力测试中...' : '开始压力测试'}
            </button>
          </div>
        </div>
      </div>

      {/* 虚拟化对比演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='performance-card mb-8'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
          <BarChart3 className='w-6 h-6 mr-2 text-purple-600' />
          虚拟化 vs 普通列表性能对比
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-semibold text-red-700 mb-4 flex items-center'>
              <Activity className='w-5 h-5 mr-2' />
              普通列表 (渲染所有项)
            </h3>
            <RegularList
              items={testData.slice(0, Math.min(200, testData.length))}
              onItemClick={handleItemClick}
            />
            <div className='mt-2 text-sm text-red-600'>
              ⚠️ 为防止浏览器卡死，只显示前200项
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-green-700 mb-4 flex items-center'>
              <Zap className='w-5 h-5 mr-2' />
              虚拟化列表 (只渲染可见项)
            </h3>
            <VirtualizedList items={testData} onItemClick={handleItemClick} />
            <div className='mt-2 text-sm text-green-600'>
              ✅ 可流畅处理 {testData.length.toLocaleString()} 项数据
            </div>
          </div>
        </div>

        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='text-sm font-medium text-blue-800 mb-2'>
            性能对比说明
          </div>
          <div className='text-sm text-blue-700 space-y-1'>
            <div>
              • <strong>普通列表</strong>: 渲染所有DOM节点，内存占用高，滚动卡顿
            </div>
            <div>
              • <strong>虚拟化列表</strong>:
              只渲染可见区域，内存占用低，滚动流畅
            </div>
            <div>
              • <strong>性能提升</strong>: 数据量越大，虚拟化的优势越明显
            </div>
          </div>
        </div>
      </motion.div>

      {/* 无限滚动演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mb-8'
      >
        <InfiniteScrollDemo />
      </motion.div>

      {/* 性能指标统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='performance-card'
      >
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <Timer className='w-5 h-5 mr-2 text-performance-600' />
          虚拟化技术优势
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center p-6 bg-green-50 rounded-lg border border-green-200'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Zap className='w-8 h-8 text-green-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              渲染性能
            </h4>
            <div className='text-2xl font-bold text-green-600 mb-2'>10x+</div>
            <p className='text-sm text-gray-600'>
              渲染速度提升，只渲染可见元素
            </p>
          </div>

          <div className='text-center p-6 bg-blue-50 rounded-lg border border-blue-200'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <BarChart3 className='w-8 h-8 text-blue-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              内存使用
            </h4>
            <div className='text-2xl font-bold text-blue-600 mb-2'>90%↓</div>
            <p className='text-sm text-gray-600'>内存占用大幅降低，稳定运行</p>
          </div>

          <div className='text-center p-6 bg-purple-50 rounded-lg border border-purple-200'>
            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Users className='w-8 h-8 text-purple-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              数据规模
            </h4>
            <div className='text-2xl font-bold text-purple-600 mb-2'>
              无限制
            </div>
            <p className='text-sm text-gray-600'>支持百万级数据流畅交互</p>
          </div>
        </div>

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='p-4 bg-gray-50 rounded-lg'>
            <h5 className='font-semibold text-gray-900 mb-2'>适用场景</h5>
            <ul className='space-y-1 text-gray-600'>
              <li>• 大数据表格和列表</li>
              <li>• 社交媒体动态流</li>
              <li>• 商品目录和搜索结果</li>
              <li>• 聊天消息历史</li>
            </ul>
          </div>

          <div className='p-4 bg-gray-50 rounded-lg'>
            <h5 className='font-semibold text-gray-900 mb-2'>技术要点</h5>
            <ul className='space-y-1 text-gray-600'>
              <li>• 计算可见区域范围</li>
              <li>• 动态创建和销毁DOM</li>
              <li>• 保持滚动位置一致</li>
              <li>• 优化滚动事件处理</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
