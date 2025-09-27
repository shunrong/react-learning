import { useState, lazy, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Split,
  ExternalLink,
  BookOpen,
  Activity,
  Package,
  Download,
  Timer,
  Zap,
  Eye,
  MousePointer,
  Loader,
  CheckCircle,
} from 'lucide-react';

// 模拟重型组件 - 懒加载
const HeavyChart = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div className='p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border border-blue-200'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Activity className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  重型图表组件
                </h3>
                <p className='text-gray-600 mb-4'>
                  这是一个模拟的重型图表组件，包含复杂的数据可视化逻辑
                </p>
                <div className='grid grid-cols-3 gap-4 text-sm'>
                  <div className='bg-white p-3 rounded'>
                    <div className='text-blue-600 font-bold text-lg'>1.2MB</div>
                    <div className='text-gray-500'>包大小</div>
                  </div>
                  <div className='bg-white p-3 rounded'>
                    <div className='text-green-600 font-bold text-lg'>2.5s</div>
                    <div className='text-gray-500'>加载时间</div>
                  </div>
                  <div className='bg-white p-3 rounded'>
                    <div className='text-purple-600 font-bold text-lg'>15+</div>
                    <div className='text-gray-500'>依赖包</div>
                  </div>
                </div>
              </div>
            </div>
          ),
        });
      }, 2000); // 模拟2秒加载时间
    })
);

const HeavyDataTable = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div className='p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border border-green-200'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Package className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  数据表格组件
                </h3>
                <p className='text-gray-600 mb-4'>
                  包含复杂数据处理、排序、筛选功能的表格组件
                </p>
                <div className='bg-white rounded-lg p-4'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b'>
                        <th className='text-left p-2'>ID</th>
                        <th className='text-left p-2'>名称</th>
                        <th className='text-left p-2'>状态</th>
                        <th className='text-left p-2'>数值</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4].map(i => (
                        <tr key={i} className='border-b'>
                          <td className='p-2'>{i}</td>
                          <td className='p-2'>项目 {i}</td>
                          <td className='p-2'>
                            <span className='px-2 py-1 bg-green-100 text-green-800 rounded text-xs'>
                              活跃
                            </span>
                          </td>
                          <td className='p-2'>
                            {(Math.random() * 100).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ),
        });
      }, 1500);
    })
);

const HeavyEditor = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div className='p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg border border-yellow-200'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Timer className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  富文本编辑器
                </h3>
                <p className='text-gray-600 mb-4'>
                  功能丰富的富文本编辑器，支持多种格式和插件
                </p>
                <div className='bg-white rounded-lg p-4 border'>
                  <div className='border-b pb-2 mb-2 flex gap-2'>
                    {['B', 'I', 'U', 'A', '📎', '🖼️', '📊'].map(btn => (
                      <button
                        key={btn}
                        className='px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200'
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                  <div className='text-left text-gray-600 min-h-20 p-2 bg-gray-50 rounded'>
                    这是一个功能强大的富文本编辑器示例...
                  </div>
                </div>
              </div>
            </div>
          ),
        });
      }, 1800);
    })
);

// 加载状态组件
function LoadingFallback({ name }: { name: string }) {
  return (
    <div className='p-6 border border-gray-200 rounded-lg bg-gray-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-performance-200 border-t-performance-600 mx-auto mb-4'></div>
        <div className='text-gray-600 font-medium'>正在加载 {name}...</div>
        <div className='text-sm text-gray-500 mt-1'>
          代码分割正在工作，首次加载需要下载模块
        </div>
      </div>
    </div>
  );
}

// 预加载演示
function PreloadDemo() {
  const [isHovered, setIsHovered] = useState(false);
  const [preloadStatus, setPreloadStatus] = useState<
    'idle' | 'loading' | 'loaded'
  >('idle');

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (preloadStatus === 'idle') {
      setPreloadStatus('loading');
      // 预加载组件
      import('./CodeSplitting').then(() => {
        setPreloadStatus('loaded');
      });
    }
  }, [preloadStatus]);

  return (
    <div className='performance-card'>
      <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
        <MousePointer className='w-5 h-5 mr-2 text-performance-600' />
        智能预加载演示
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div
          className='p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-performance-500 transition-colors cursor-pointer'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className='text-center'>
            <Eye className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              悬停预加载
            </h4>
            <p className='text-sm text-gray-600 mb-4'>
              鼠标悬停时开始预加载组件，提升用户体验
            </p>
            <div
              className={`text-sm font-medium ${
                preloadStatus === 'loaded'
                  ? 'text-green-600'
                  : preloadStatus === 'loading'
                    ? 'text-yellow-600'
                    : 'text-gray-500'
              }`}
            >
              状态:{' '}
              {preloadStatus === 'loaded'
                ? '已预加载'
                : preloadStatus === 'loading'
                  ? '预加载中...'
                  : '未加载'}
            </div>
          </div>
        </div>

        <div className='p-6 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='text-center'>
            <CheckCircle className='w-12 h-12 text-blue-600 mx-auto mb-4' />
            <h4 className='text-lg font-semibold text-gray-900 mb-2'>
              预加载策略
            </h4>
            <div className='text-sm text-gray-700 space-y-2'>
              <div className='flex items-center justify-between'>
                <span>鼠标悬停:</span>
                <span
                  className={isHovered ? 'text-green-600' : 'text-gray-400'}
                >
                  {isHovered ? '✓ 触发' : '等待'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span>网络空闲:</span>
                <span className='text-blue-600'>✓ 启用</span>
              </div>
              <div className='flex items-center justify-between'>
                <span>可见性检测:</span>
                <span className='text-blue-600'>✓ 启用</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <div className='text-sm text-yellow-800'>
          <strong>优化提示:</strong> 预加载可以在用户还未点击时就开始下载代码，
          但要平衡预加载的时机和网络资源消耗。
        </div>
      </div>
    </div>
  );
}

export default function CodeSplitting() {
  const [activeTab, setActiveTab] = useState<
    'chart' | 'table' | 'editor' | null
  >(null);
  const [loadTimes, setLoadTimes] = useState<Record<string, number>>({});

  const handleTabClick = useCallback((tab: 'chart' | 'table' | 'editor') => {
    const startTime = performance.now();
    setActiveTab(tab);

    // 记录加载时间
    setTimeout(() => {
      const endTime = performance.now();
      setLoadTimes(prev => ({
        ...prev,
        [tab]: endTime - startTime,
      }));
    }, 100);
  }, []);

  const components = [
    {
      id: 'chart' as const,
      name: '图表组件',
      description: '复杂的数据可视化组件',
      icon: Activity,
      component: HeavyChart,
      size: '1.2MB',
      deps: 15,
    },
    {
      id: 'table' as const,
      name: '表格组件',
      description: '功能丰富的数据表格',
      icon: Package,
      component: HeavyDataTable,
      size: '800KB',
      deps: 8,
    },
    {
      id: 'editor' as const,
      name: '编辑器组件',
      description: '富文本编辑器',
      icon: Timer,
      component: HeavyEditor,
      size: '1.5MB',
      deps: 12,
    },
  ];

  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6'>
          <Split className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          代码分割与懒加载
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          通过动态导入和懒加载优化应用加载性能
        </p>

        <div className='mt-8'>
          <a
            href='/docs/concepts/performance'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-performance-600 text-white rounded-lg hover:bg-performance-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看代码分割理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 组件选择器 */}
      <div className='performance-card mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
          <Download className='w-6 h-6 mr-2 text-green-600' />
          按需加载组件演示
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          {components.map(comp => {
            const Icon = comp.icon;
            const isActive = activeTab === comp.id;
            const loadTime = loadTimes[comp.id];

            return (
              <button
                key={comp.id}
                onClick={() => handleTabClick(comp.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className='flex items-center mb-3'>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      isActive ? 'bg-green-500' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`}
                    />
                  </div>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {comp.name}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {comp.description}
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div className='text-gray-600'>
                    大小: <span className='font-medium'>{comp.size}</span>
                  </div>
                  <div className='text-gray-600'>
                    依赖: <span className='font-medium'>{comp.deps}</span>
                  </div>
                </div>

                {loadTime && (
                  <div className='mt-2 text-xs text-green-600'>
                    ✓ 加载耗时: {loadTime.toFixed(0)}ms
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 组件显示区域 */}
        <div className='min-h-80'>
          {activeTab === null ? (
            <div className='text-center py-12 text-gray-500'>
              <Loader className='w-12 h-12 mx-auto mb-4 opacity-50' />
              <div className='text-lg font-medium mb-2'>
                选择一个组件体验懒加载
              </div>
              <div className='text-sm'>
                点击上方任意组件卡片，观察代码分割的效果
              </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <LoadingFallback
                  name={components.find(c => c.id === activeTab)?.name || ''}
                />
              }
            >
              {activeTab === 'chart' && <HeavyChart />}
              {activeTab === 'table' && <HeavyDataTable />}
              {activeTab === 'editor' && <HeavyEditor />}
            </Suspense>
          )}
        </div>

        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='text-sm font-medium text-blue-800 mb-2'>
            代码分割效果
          </div>
          <div className='text-sm text-blue-700 space-y-1'>
            <div>
              • <strong>首次加载</strong>: 只下载必要的代码，大幅减少初始包大小
            </div>
            <div>
              • <strong>按需加载</strong>: 用户点击时才下载对应组件代码
            </div>
            <div>
              • <strong>缓存机制</strong>:
              加载过的组件会被浏览器缓存，再次使用即时显示
            </div>
          </div>
        </div>
      </div>

      {/* 预加载演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mb-8'
      >
        <PreloadDemo />
      </motion.div>

      {/* 代码分割最佳实践 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='performance-card'
      >
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <Zap className='w-5 h-5 mr-2 text-performance-600' />
          代码分割最佳实践
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-lg font-semibold text-gray-900 mb-4'>
              分割策略
            </h4>
            <div className='space-y-3 text-sm'>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                <div>
                  <div className='font-medium text-gray-900'>路由级分割</div>
                  <div className='text-gray-600'>
                    按页面路由分割，用户访问时加载
                  </div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                <div>
                  <div className='font-medium text-gray-900'>组件级分割</div>
                  <div className='text-gray-600'>
                    大型组件按需加载，如图表、编辑器
                  </div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                <div>
                  <div className='font-medium text-gray-900'>第三方库分割</div>
                  <div className='text-gray-600'>
                    分离vendor包，利用浏览器缓存
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-lg font-semibold text-gray-900 mb-4'>
              优化技巧
            </h4>
            <div className='space-y-3 text-sm'>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                <div>
                  <div className='font-medium text-gray-900'>预加载时机</div>
                  <div className='text-gray-600'>
                    鼠标悬停、网络空闲时预加载
                  </div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                <div>
                  <div className='font-medium text-gray-900'>加载状态</div>
                  <div className='text-gray-600'>提供友好的加载指示器</div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                <div>
                  <div className='font-medium text-gray-900'>错误处理</div>
                  <div className='text-gray-600'>网络失败时的重试机制</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
          <h5 className='font-semibold text-gray-900 mb-2'>性能收益</h5>
          <div className='grid grid-cols-3 gap-4 text-center text-sm'>
            <div>
              <div className='text-2xl font-bold text-green-600'>-60%</div>
              <div className='text-gray-600'>初始包大小</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-blue-600'>-40%</div>
              <div className='text-gray-600'>首屏加载时间</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-purple-600'>+50%</div>
              <div className='text-gray-600'>缓存命中率</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
