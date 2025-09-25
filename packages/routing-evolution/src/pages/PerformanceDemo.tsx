import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Gauge, 
  Clock, 
  TrendingUp, 
  Activity, 
  Target,
  CheckCircle,
  ExternalLink,
  Monitor,
  Cpu,
  BarChart3,
  Layers,
  Globe
} from 'lucide-react';

// 性能监控工具
function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderCount: 0,
    memoryUsage: 0,
    routeChangeTime: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // 模拟性能监控
    const interval = setInterval(() => {
      setMetrics({
        loadTime: Math.round(performance.now() - startTime),
        renderCount: Math.floor(Math.random() * 10) + 1,
        memoryUsage: Math.round(Math.random() * 50 + 20),
        routeChangeTime: Math.round(Math.random() * 100 + 50)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <div className='bg-blue-50 rounded-lg p-4 text-center'>
        <Clock className='w-6 h-6 text-blue-600 mx-auto mb-2' />
        <div className='text-2xl font-bold text-blue-900'>{metrics.loadTime}ms</div>
        <div className='text-sm text-blue-600'>页面加载时间</div>
      </div>
      <div className='bg-green-50 rounded-lg p-4 text-center'>
        <Activity className='w-6 h-6 text-green-600 mx-auto mb-2' />
        <div className='text-2xl font-bold text-green-900'>{metrics.renderCount}</div>
        <div className='text-sm text-green-600'>组件渲染次数</div>
      </div>
      <div className='bg-orange-50 rounded-lg p-4 text-center'>
        <Monitor className='w-6 h-6 text-orange-600 mx-auto mb-2' />
        <div className='text-2xl font-bold text-orange-900'>{metrics.memoryUsage}MB</div>
        <div className='text-sm text-orange-600'>内存占用</div>
      </div>
      <div className='bg-purple-50 rounded-lg p-4 text-center'>
        <TrendingUp className='w-6 h-6 text-purple-600 mx-auto mb-2' />
        <div className='text-2xl font-bold text-purple-900'>{metrics.routeChangeTime}ms</div>
        <div className='text-sm text-purple-600'>路由切换时间</div>
      </div>
    </div>
  );
}

// 懒加载演示组件
const HeavyComponent = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className='bg-white rounded-lg p-6 border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>重型组件已加载</h3>
            <p className='text-gray-600 mb-4'>
              这是一个模拟的重型组件，通过 React.lazy() 实现懒加载，
              只有在需要时才会下载和执行代码。
            </p>
            <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
              <div className='flex items-center text-green-800'>
                <CheckCircle className='w-4 h-4 mr-2' />
                <span className='text-sm font-medium'>懒加载成功</span>
              </div>
            </div>
          </div>
        )
      });
    }, 2000);
  })
);

function PerformanceDemo() {
  const [showHeavyComponent, setShowHeavyComponent] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const optimizationTechniques = [
    {
      title: '代码分割',
      description: '使用 React.lazy() 和动态导入实现按需加载',
      icon: Layers,
      color: 'blue',
      benefits: ['减少初始包大小', '提升首屏加载速度', '更好的缓存策略'],
      example: `// 路由级代码分割
const Dashboard = lazy(() => import('./Dashboard'));
const UserProfile = lazy(() => import('./UserProfile'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Suspense>
  );
}`
    },
    {
      title: '预加载策略',
      description: '智能预加载用户可能访问的路由',
      icon: Target,
      color: 'green',
      benefits: ['减少路由切换延迟', '提升用户体验', '充分利用空闲时间'],
      example: `// 路由预加载
function useRoutePreload() {
  const preloadRoute = (routeName) => {
    const routeMap = {
      dashboard: () => import('./Dashboard'),
      profile: () => import('./UserProfile')
    };
    
    // 在空闲时间预加载
    requestIdleCallback(() => {
      routeMap[routeName]?.();
    });
  };
  
  return preloadRoute;
}`
    },
    {
      title: '路由缓存',
      description: '缓存已加载的路由组件和数据',
      icon: Globe,
      color: 'purple',
      benefits: ['避免重复渲染', '保持组件状态', '减少网络请求'],
      example: `// 路由组件缓存
const routeCache = new Map();

function CachedRoute({ path, component: Component }) {
  if (!routeCache.has(path)) {
    routeCache.set(path, <Component />);
  }
  
  return routeCache.get(path);
}`
    },
    {
      title: '性能监控',
      description: '实时监控路由性能指标',
      icon: BarChart3,
      color: 'orange',
      benefits: ['及时发现问题', '数据驱动优化', '用户体验量化'],
      example: `// 性能监控
function useRoutePerformance() {
  const trackRouteChange = (route) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 发送性能数据
      analytics.track('route_change', {
        route,
        duration,
        timestamp: Date.now()
      });
    };
  };
  
  return trackRouteChange;
}`
    }
  ];

  const bestPractices = [
    {
      category: '资源优化',
      tips: [
        '使用 React.lazy() 进行组件级代码分割',
        '合理设置 Suspense 边界和 fallback',
        '压缩和优化静态资源',
        '启用 HTTP/2 和资源缓存'
      ]
    },
    {
      category: '渲染优化',
      tips: [
        '使用 React.memo 避免不必要的重渲染',
        '合理使用 useCallback 和 useMemo',
        '避免在渲染函数中创建复杂对象',
        '使用虚拟化处理大量数据'
      ]
    },
    {
      category: '路由优化',
      tips: [
        '预加载关键路由组件',
        '使用浅层路由避免整页重新加载',
        '合理设计路由层级结构',
        '避免过深的嵌套路由'
      ]
    },
    {
      category: '监控和调试',
      tips: [
        '使用 React DevTools Profiler',
        '监控 Core Web Vitals 指标',
        '设置性能预算和阈值',
        '定期进行性能回归测试'
      ]
    }
  ];

  const tabs = [
    { id: 'overview', label: '概览', icon: Gauge },
    { id: 'techniques', label: '优化技术', icon: Zap },
    { id: 'practices', label: '最佳实践', icon: CheckCircle },
    { id: 'demo', label: '实时演示', icon: Activity }
  ];

  return (
    <div className='min-h-full bg-gray-50'>
      {/* 头部 */}
      <div className='bg-gradient-to-r from-orange-600 to-red-600 text-white'>
        <div className='max-w-7xl mx-auto px-6 py-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='flex items-center mb-4'>
              <Gauge className='w-8 h-8 mr-3' />
              <h1 className='text-3xl md:text-4xl font-bold'>路由性能优化</h1>
            </div>
            <p className='text-xl text-orange-100 max-w-3xl'>
              掌握路由性能优化的核心技术和最佳实践，构建快速响应的用户体验
            </p>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* 标签导航 */}
        <div className='flex flex-wrap gap-2 mb-8'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                activeTab === tab.id
                  ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <tab.icon className='w-4 h-4 mr-2' />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 概览页面 */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='space-y-8'
          >
            <div className='card'>
              <div className='card-header'>
                <h2 className='text-2xl font-bold text-gray-900'>实时性能监控</h2>
                <p className='text-gray-600 mt-1'>当前页面的性能指标</p>
              </div>
              <div className='card-content'>
                <PerformanceMetrics />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='card'>
                <div className='card-header'>
                  <h3 className='text-lg font-semibold text-gray-900'>为什么需要性能优化？</h3>
                </div>
                <div className='card-content'>
                  <ul className='space-y-3 text-gray-600'>
                    <li className='flex items-start'>
                      <Clock className='w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0' />
                      <div>
                        <strong>用户体验</strong>
                        <p className='text-sm'>快速的路由切换提升用户满意度</p>
                      </div>
                    </li>
                    <li className='flex items-start'>
                      <TrendingUp className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <div>
                        <strong>业务指标</strong>
                        <p className='text-sm'>页面加载速度直接影响转化率</p>
                      </div>
                    </li>
                    <li className='flex items-start'>
                      <Target className='w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0' />
                      <div>
                        <strong>SEO 优化</strong>
                        <p className='text-sm'>搜索引擎偏好快速加载的网站</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='card'>
                <div className='card-header'>
                  <h3 className='text-lg font-semibold text-gray-900'>核心性能指标</h3>
                </div>
                <div className='card-content'>
                  <div className='space-y-4'>
                    <div className='border-l-4 border-blue-500 pl-4'>
                      <h4 className='font-medium text-gray-900'>FCP (First Contentful Paint)</h4>
                      <p className='text-sm text-gray-600'>首次内容绘制时间</p>
                    </div>
                    <div className='border-l-4 border-green-500 pl-4'>
                      <h4 className='font-medium text-gray-900'>LCP (Largest Contentful Paint)</h4>
                      <p className='text-sm text-gray-600'>最大内容绘制时间</p>
                    </div>
                    <div className='border-l-4 border-orange-500 pl-4'>
                      <h4 className='font-medium text-gray-900'>CLS (Cumulative Layout Shift)</h4>
                      <p className='text-sm text-gray-600'>累积布局偏移</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 优化技术页面 */}
        {activeTab === 'techniques' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='space-y-8'
          >
            {optimizationTechniques.map((technique, index) => (
              <motion.div
                key={technique.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='card'
              >
                <div className='card-header'>
                  <div className='flex items-center'>
                    <div className={`w-10 h-10 bg-${technique.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                      <technique.icon className={`w-5 h-5 text-${technique.color}-600`} />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-gray-900'>{technique.title}</h3>
                      <p className='text-gray-600'>{technique.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className='card-content'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div>
                      <h4 className='font-medium text-gray-900 mb-3'>核心优势</h4>
                      <ul className='space-y-2'>
                        {technique.benefits.map((benefit, idx) => (
                          <li key={idx} className='flex items-center text-sm text-gray-600'>
                            <CheckCircle className='w-4 h-4 text-green-500 mr-2 flex-shrink-0' />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className='font-medium text-gray-900 mb-3'>代码示例</h4>
                      <div className='bg-gray-900 rounded-lg overflow-hidden'>
                        <div className='px-3 py-2 bg-gray-800 text-gray-400 text-xs'>
                          {technique.title}.tsx
                        </div>
                        <pre className='p-3 text-xs text-gray-100 overflow-x-auto leading-relaxed'>
                          <code>{technique.example}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 最佳实践页面 */}
        {activeTab === 'practices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            {bestPractices.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='card'
              >
                <div className='card-header'>
                  <h3 className='text-lg font-semibold text-gray-900'>{category.category}</h3>
                </div>
                
                <div className='card-content'>
                  <ul className='space-y-3'>
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className='flex items-start text-sm text-gray-600'>
                        <CheckCircle className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 实时演示页面 */}
        {activeTab === 'demo' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='space-y-6'
          >
            <div className='card'>
              <div className='card-header'>
                <h2 className='text-xl font-semibold text-gray-900'>懒加载演示</h2>
                <p className='text-gray-600 mt-1'>体验代码分割和懒加载的效果</p>
              </div>
              
              <div className='card-content space-y-4'>
                <button
                  onClick={() => setShowHeavyComponent(!showHeavyComponent)}
                  className='btn btn-primary flex items-center'
                >
                  <Layers className='w-4 h-4 mr-2' />
                  {showHeavyComponent ? '隐藏' : '加载'}重型组件
                </button>
                
                {showHeavyComponent && (
                  <Suspense 
                    fallback={
                      <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 text-center'>
                        <div className='animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3'></div>
                        <p className='text-gray-600'>组件加载中...</p>
                      </div>
                    }
                  >
                    <HeavyComponent />
                  </Suspense>
                )}
              </div>
            </div>

            <div className='card'>
              <div className='card-header'>
                <h3 className='text-lg font-semibold text-gray-900'>性能监控工具</h3>
              </div>
              <div className='card-content'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <a 
                    href='https://developers.google.com/web/tools/lighthouse'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <Monitor className='w-8 h-8 text-blue-600 mb-3' />
                    <h4 className='font-medium text-gray-900 mb-1'>Lighthouse</h4>
                    <p className='text-sm text-gray-600 mb-2'>综合性能审计工具</p>
                    <div className='flex items-center text-blue-600 text-sm'>
                      了解更多 <ExternalLink className='w-3 h-3 ml-1' />
                    </div>
                  </a>
                  
                  <a 
                    href='https://web.dev/vitals/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <Activity className='w-8 h-8 text-green-600 mb-3' />
                    <h4 className='font-medium text-gray-900 mb-1'>Core Web Vitals</h4>
                    <p className='text-sm text-gray-600 mb-2'>核心网页指标</p>
                    <div className='flex items-center text-green-600 text-sm'>
                      查看指标 <ExternalLink className='w-3 h-3 ml-1' />
                    </div>
                  </a>
                  
                  <a 
                    href='https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <Cpu className='w-8 h-8 text-purple-600 mb-3' />
                    <h4 className='font-medium text-gray-900 mb-1'>React Profiler</h4>
                    <p className='text-sm text-gray-600 mb-2'>React 性能分析</p>
                    <div className='flex items-center text-purple-600 text-sm'>
                      学习使用 <ExternalLink className='w-3 h-3 ml-1' />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 底部行动指南 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className='bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mt-12'
        >
          <div className='text-center mb-6'>
            <Zap className='w-12 h-12 text-orange-600 mx-auto mb-4' />
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>开始性能优化</h3>
            <p className='text-gray-600'>立即应用这些技术，提升你的应用性能</p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-white rounded-lg p-6 text-center'>
              <Target className='w-8 h-8 text-orange-600 mx-auto mb-3' />
              <h4 className='font-semibold text-gray-900 mb-2'>设定目标</h4>
              <p className='text-sm text-gray-600 mb-3'>制定明确的性能指标</p>
              <div className='text-orange-600 text-sm font-medium'>
                定义 KPI
              </div>
            </div>
            
            <div className='bg-white rounded-lg p-6 text-center'>
              <Monitor className='w-8 h-8 text-green-600 mx-auto mb-3' />
              <h4 className='font-semibold text-gray-900 mb-2'>监控测量</h4>
              <p className='text-sm text-gray-600 mb-3'>建立性能监控体系</p>
              <div className='text-green-600 text-sm font-medium'>
                持续监控
              </div>
            </div>
            
            <div className='bg-white rounded-lg p-6 text-center'>
              <TrendingUp className='w-8 h-8 text-blue-600 mx-auto mb-3' />
              <h4 className='font-semibold text-gray-900 mb-2'>迭代优化</h4>
              <p className='text-sm text-gray-600 mb-3'>基于数据持续改进</p>
              <div className='text-blue-600 text-sm font-medium'>
                永不停歇
              </div>
            </div>
          </div>
          
          <div className='mt-6 text-center'>
            <div className='inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium'>
              💡 记住：性能优化是一个持续的过程，而不是一次性任务
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PerformanceDemo;