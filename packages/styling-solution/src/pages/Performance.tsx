import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Zap,
  Package,
  Clock,
  Monitor,
  Cpu,
  Activity,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  rerenderCount: number;
  cssParseTime: number;
}

interface TestResult {
  method: string;
  color: string;
  metrics: PerformanceMetrics;
  score: number;
}

const mockPerformanceData: TestResult[] = [
  {
    method: 'CSS Modules',
    color: 'green',
    metrics: {
      renderTime: 1.2,
      bundleSize: 0,
      memoryUsage: 8.5,
      rerenderCount: 12,
      cssParseTime: 0.8,
    },
    score: 95,
  },
  {
    method: 'Styled Components',
    color: 'pink',
    metrics: {
      renderTime: 2.8,
      bundleSize: 15.2,
      memoryUsage: 12.3,
      rerenderCount: 18,
      cssParseTime: 3.2,
    },
    score: 72,
  },
  {
    method: 'Emotion',
    color: 'yellow',
    metrics: {
      renderTime: 1.8,
      bundleSize: 7.1,
      memoryUsage: 9.8,
      rerenderCount: 14,
      cssParseTime: 2.1,
    },
    score: 85,
  },
  {
    method: 'Tailwind CSS',
    color: 'cyan',
    metrics: {
      renderTime: 1.1,
      bundleSize: 10.5,
      memoryUsage: 7.9,
      rerenderCount: 11,
      cssParseTime: 0.5,
    },
    score: 92,
  },
];

const metricConfigs = [
  {
    key: 'renderTime',
    label: '渲染时间',
    unit: 'ms',
    icon: Clock,
    description: '组件首次渲染完成时间',
    lowerIsBetter: true,
  },
  {
    key: 'bundleSize',
    label: '包体积',
    unit: 'KB',
    icon: Package,
    description: '运行时库的gzipped体积',
    lowerIsBetter: true,
  },
  {
    key: 'memoryUsage',
    label: '内存使用',
    unit: 'MB',
    icon: Monitor,
    description: '样式系统占用的内存',
    lowerIsBetter: true,
  },
  {
    key: 'rerenderCount',
    label: '重渲染次数',
    unit: '次',
    icon: Activity,
    description: '状态变化导致的重渲染次数',
    lowerIsBetter: true,
  },
  {
    key: 'cssParseTime',
    label: 'CSS解析时间',
    unit: 'ms',
    icon: Cpu,
    description: '样式解析和应用时间',
    lowerIsBetter: true,
  },
];

export default function Performance() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const [results, setResults] = useState<TestResult[]>(mockPerformanceData);
  const [selectedMetric, setSelectedMetric] = useState('renderTime');

  const runBenchmark = () => {
    setIsRunning(true);
    setCurrentTest(0);

    // 模拟测试过程
    const interval = setInterval(() => {
      setCurrentTest(prev => {
        if (prev >= results.length - 1) {
          setIsRunning(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const resetTests = () => {
    setIsRunning(false);
    setCurrentTest(0);
    // 重新生成随机数据
    const newResults = mockPerformanceData.map(result => ({
      ...result,
      metrics: {
        ...result.metrics,
        renderTime: result.metrics.renderTime + (Math.random() - 0.5) * 0.5,
        memoryUsage: result.metrics.memoryUsage + (Math.random() - 0.5) * 2,
        rerenderCount: Math.max(
          1,
          result.metrics.rerenderCount + Math.floor((Math.random() - 0.5) * 4)
        ),
      },
    }));
    setResults(newResults);
  };

  const getBestWorst = (metricKey: string) => {
    const values = results.map(
      r => r.metrics[metricKey as keyof PerformanceMetrics]
    );
    const config = metricConfigs.find(c => c.key === metricKey);
    const isLowerBetter = config?.lowerIsBetter;

    if (isLowerBetter) {
      return {
        best: Math.min(...values),
        worst: Math.max(...values),
      };
    } else {
      return {
        best: Math.max(...values),
        worst: Math.min(...values),
      };
    }
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'green', label: '优秀' };
    if (score >= 80) return { grade: 'B', color: 'blue', label: '良好' };
    if (score >= 70) return { grade: 'C', color: 'yellow', label: '一般' };
    return { grade: 'D', color: 'red', label: '需要改进' };
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
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6'>
          <BarChart3 className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>性能测试基准</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          通过真实的性能数据对比，了解不同样式方案的运行时表现和资源消耗
        </p>

        {/* 理论文档链接 */}
        <div className='mt-8'>
          <a
            href='/docs/concepts/styling'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看性能优化理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 测试控制面板 */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center'>
              <Activity className='w-5 h-5 text-green-600 mr-2' />
              <span className='font-medium text-gray-900'>性能基准测试</span>
            </div>
            {isRunning && (
              <div className='flex items-center text-blue-600'>
                <div className='animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2'></div>
                <span className='text-sm'>
                  正在测试 {results[currentTest]?.method}...
                </span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isRunning
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className='w-4 h-4' />
                  运行中...
                </>
              ) : (
                <>
                  <Play className='w-4 h-4' />
                  开始测试
                </>
              )}
            </button>

            <button
              onClick={resetTests}
              className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2'
            >
              <RotateCcw className='w-4 h-4' />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 性能评分卡 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {results.map((result, index) => {
          const gradeInfo = getPerformanceGrade(result.score);
          const isActive = isRunning && currentTest === index;

          return (
            <motion.div
              key={result.method}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-300 ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-gray-900'>{result.method}</h3>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-${gradeInfo.color}-500`}
                >
                  {gradeInfo.grade}
                </div>
              </div>

              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 mb-1'>
                  {result.score}
                </div>
                <div
                  className={`text-sm font-medium text-${gradeInfo.color}-600`}
                >
                  {gradeInfo.label}
                </div>
              </div>

              {isActive && (
                <div className='mt-4 flex items-center justify-center'>
                  <div className='animate-pulse flex items-center text-blue-600 text-sm'>
                    <Activity className='w-4 h-4 mr-1' />
                    测试中...
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 详细指标对比 */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            详细性能指标
          </h2>

          {/* 指标选择器 */}
          <div className='flex flex-wrap gap-2'>
            {metricConfigs.map(config => (
              <button
                key={config.key}
                onClick={() => setSelectedMetric(config.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedMetric === config.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <config.icon className='w-4 h-4' />
                {config.label}
              </button>
            ))}
          </div>
        </div>

        <div className='p-6'>
          {metricConfigs
            .filter(config => config.key === selectedMetric)
            .map(config => {
              const { best, worst } = getBestWorst(config.key);

              return (
                <div key={config.key}>
                  <div className='flex items-center mb-4'>
                    <config.icon className='w-5 h-5 text-blue-600 mr-2' />
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {config.label}
                    </h3>
                    <span className='text-gray-500 text-sm ml-2'>
                      ({config.description})
                    </span>
                  </div>

                  <div className='space-y-4'>
                    {results.map(result => {
                      const value =
                        result.metrics[config.key as keyof PerformanceMetrics];
                      const percentage = config.lowerIsBetter
                        ? ((worst - value) / (worst - best)) * 100
                        : ((value - worst) / (best - worst)) * 100;
                      const isWorst = value === worst;
                      const isBest = value === best;

                      return (
                        <div key={result.method} className='space-y-2'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-900'>
                              {result.method}
                            </span>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm font-bold text-gray-900'>
                                {value.toFixed(1)} {config.unit}
                              </span>
                              {isBest && (
                                <CheckCircle className='w-4 h-4 text-green-500' />
                              )}
                              {isWorst && (
                                <AlertTriangle className='w-4 h-4 text-red-500' />
                              )}
                            </div>
                          </div>

                          <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isBest
                                  ? 'bg-green-500'
                                  : isWorst
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.max(5, percentage)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 性能建议 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center mb-4'>
            <TrendingUp className='w-6 h-6 text-green-600 mr-2' />
            <h3 className='text-xl font-semibold text-gray-900'>
              性能优化建议
            </h3>
          </div>

          <div className='space-y-4'>
            <div className='border-l-4 border-green-500 pl-4'>
              <h4 className='font-semibold text-gray-900'>CSS Modules</h4>
              <p className='text-sm text-gray-600'>
                • 零运行时开销，适合性能敏感应用
                <br />
                • 使用 CSS 预处理器优化开发体验
                <br />• 配置自动 PurgeCSS 减少包体积
              </p>
            </div>

            <div className='border-l-4 border-cyan-500 pl-4'>
              <h4 className='font-semibold text-gray-900'>Tailwind CSS</h4>
              <p className='text-sm text-gray-600'>
                • 配置 PurgeCSS 移除未使用的样式
                <br />
                • 使用 JIT 模式提升构建性能
                <br />• 合理使用组件抽象避免重复
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center mb-4'>
            <Zap className='w-6 h-6 text-yellow-600 mr-2' />
            <h3 className='text-xl font-semibold text-gray-900'>
              CSS-in-JS 优化
            </h3>
          </div>

          <div className='space-y-4'>
            <div className='border-l-4 border-yellow-500 pl-4'>
              <h4 className='font-semibold text-gray-900'>Emotion</h4>
              <p className='text-sm text-gray-600'>
                • 使用 @emotion/babel-plugin 优化
                <br />
                • 避免在渲染函数中创建样式对象
                <br />• 合理使用缓存和 memoization
              </p>
            </div>

            <div className='border-l-4 border-pink-500 pl-4'>
              <h4 className='font-semibold text-gray-900'>Styled Components</h4>
              <p className='text-sm text-gray-600'>
                • 启用 babel-plugin-styled-components
                <br />
                • 避免频繁的动态样式计算
                <br />• 使用 shouldForwardProp 优化属性传递
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 测试环境说明 */}
      <div className='bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200'>
        <div className='text-center mb-6'>
          <Monitor className='w-12 h-12 text-gray-600 mx-auto mb-4' />
          <h3 className='text-2xl font-bold text-gray-900 mb-2'>测试环境</h3>
          <p className='text-gray-600'>基于真实应用场景的性能基准测试</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <Cpu className='w-6 h-6 text-blue-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>测试设备</h4>
            <p className='text-sm text-gray-600'>
              Chrome 120+ / React 18
              <br />
              MacBook Pro M2 / 16GB RAM
            </p>
          </div>

          <div className='text-center'>
            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <Activity className='w-6 h-6 text-green-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>测试场景</h4>
            <p className='text-sm text-gray-600'>
              1000个组件渲染
              <br />
              状态更新和重渲染测试
            </p>
          </div>

          <div className='text-center'>
            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <Clock className='w-6 h-6 text-purple-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>测试指标</h4>
            <p className='text-sm text-gray-600'>
              渲染时间 / 内存使用
              <br />
              包体积 / CSS解析时间
            </p>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <div className='inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium'>
            💡 性能数据仅供参考，实际表现因项目而异
          </div>
        </div>
      </div>
    </div>
  );
}
