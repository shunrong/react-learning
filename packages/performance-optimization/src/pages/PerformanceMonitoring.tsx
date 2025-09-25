import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  MemoryStick,
  Timer,
  Zap,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export default function PerformanceMonitoring() {
  const {
    metrics,
    webVitals,
    memoryUsage,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    getPerformanceScore,
  } = usePerformanceMonitor();

  const [performanceScore, setPerformanceScore] = useState(0);

  useEffect(() => {
    if (metrics) {
      setPerformanceScore(getPerformanceScore());
    }
  }, [metrics, getPerformanceScore]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return TrendingUp;
    if (score >= 70) return Minus;
    return TrendingDown;
  };

  const metricCards = [
    {
      title: '渲染时间',
      value: metrics?.renderTime ? `${metrics.renderTime.toFixed(2)}ms` : '0ms',
      icon: Timer,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      target: '< 16ms',
    },
    {
      title: '内存使用',
      value: memoryUsage ? `${memoryUsage.used}MB` : '0MB',
      icon: MemoryStick,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      target: '< 50MB',
    },
    {
      title: '组件数量',
      value: metrics?.componentCount?.toString() || '0',
      icon: Cpu,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      target: '合理',
    },
    {
      title: '重渲染次数',
      value: metrics?.rerenderCount?.toString() || '0',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      target: '< 5',
    },
  ];

  const webVitalCards = webVitals
    ? [
        {
          title: 'FCP',
          value: `${webVitals.fcp.toFixed(0)}ms`,
          description: 'First Contentful Paint',
          good: webVitals.fcp < 1800,
        },
        {
          title: 'LCP',
          value: `${webVitals.lcp.toFixed(0)}ms`,
          description: 'Largest Contentful Paint',
          good: webVitals.lcp < 2500,
        },
        {
          title: 'FID',
          value: `${webVitals.fid.toFixed(0)}ms`,
          description: 'First Input Delay',
          good: webVitals.fid < 100,
        },
        {
          title: 'CLS',
          value: webVitals.cls.toFixed(3),
          description: 'Cumulative Layout Shift',
          good: webVitals.cls < 0.1,
        },
      ]
    : [];

  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-performance-500 to-blue-600 rounded-2xl mb-6'>
          <Activity className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>实时性能监控</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          监控 React 应用的实时性能指标，包括渲染时间、内存使用和 Web Vitals
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
            查看性能优化理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 控制面板 */}
      <div className='performance-card mb-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}
              />
              <span className='text-sm font-medium text-gray-700'>
                {isMonitoring ? '监控中' : '已暂停'}
              </span>
            </div>

            {performanceScore > 0 && (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500'>性能评分:</span>
                <span
                  className={`text-lg font-bold ${getScoreColor(performanceScore)}`}
                >
                  {performanceScore}
                </span>
                {(() => {
                  const ScoreIcon = getScoreIcon(performanceScore);
                  return (
                    <ScoreIcon
                      className={`w-4 h-4 ${getScoreColor(performanceScore)}`}
                    />
                  );
                })()}
              </div>
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

            <button onClick={resetMetrics} className='btn btn-outline'>
              <RotateCcw className='w-4 h-4 mr-2' />
              重置数据
            </button>
          </div>
        </div>
      </div>

      {/* 核心性能指标 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='performance-card'
            >
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className='text-right'>
                  <div className='text-xs text-gray-500'>目标</div>
                  <div className='text-sm font-medium text-gray-700'>
                    {card.target}
                  </div>
                </div>
              </div>

              <div className='text-2xl font-bold text-gray-900 mb-1'>
                {card.value}
              </div>
              <div className='text-sm text-gray-500'>{card.title}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Web Vitals */}
      {webVitalCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='performance-card mb-8'
        >
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <Zap className='w-5 h-5 mr-2 text-performance-600' />
            Web Vitals 指标
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {webVitalCards.map(vital => (
              <div key={vital.title} className='text-center'>
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                    vital.good ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <span
                    className={`text-xl font-bold ${
                      vital.good ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {vital.title}
                  </span>
                </div>

                <div className='text-lg font-bold text-gray-900 mb-1'>
                  {vital.value}
                </div>
                <div className='text-xs text-gray-500'>{vital.description}</div>

                <div
                  className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    vital.good
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {vital.good ? '良好' : '需要改进'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 内存使用详情 */}
      {memoryUsage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='performance-card'
        >
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <MemoryStick className='w-5 h-5 mr-2 text-performance-600' />
            内存使用详情
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>
                {memoryUsage.used} MB
              </div>
              <div className='text-sm text-gray-500'>已使用</div>
            </div>

            <div className='text-center'>
              <div className='text-3xl font-bold text-green-600 mb-2'>
                {memoryUsage.total} MB
              </div>
              <div className='text-sm text-gray-500'>总内存</div>
            </div>

            <div className='text-center'>
              <div className='text-3xl font-bold text-purple-600 mb-2'>
                {memoryUsage.percentage}%
              </div>
              <div className='text-sm text-gray-500'>使用率</div>
            </div>
          </div>

          <div className='mt-6'>
            <div className='flex justify-between text-sm text-gray-600 mb-2'>
              <span>内存使用进度</span>
              <span>{memoryUsage.percentage}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-3'>
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  memoryUsage.percentage > 80
                    ? 'bg-red-500'
                    : memoryUsage.percentage > 60
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, memoryUsage.percentage)}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
