import { useState, useEffect, useRef, useCallback } from 'react';

// Web Vitals 相关类型
export interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
  trend: 'stable' | 'increasing' | 'decreasing';
}

export interface PerformanceMetrics {
  renderTime?: number;
  memoryUsage?: number;
  rerenderCount?: number;
  fps?: number;
  componentCount?: number;
  [key: string]: any;
}

export interface WebVitalsData {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

// 性能监控 Hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [memoryUsage, setMemoryUsage] = useState<MemoryUsage | null>(null);
  const [webVitals, setWebVitals] = useState<WebVitalsData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateMetrics = useCallback(() => {
    // 模拟性能指标

    // 获取内存信息
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const totalMB = memory.totalJSHeapSize / 1024 / 1024;

      setMemoryUsage({
        used: Math.round(usedMB * 100) / 100,
        total: Math.round(totalMB * 100) / 100,
        percentage: Math.round((usedMB / totalMB) * 100),
        trend: 'stable',
      });
    }

    // 更新其他指标
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.random() * 20 + 5,
      memoryUsage: memoryUsage?.used || 0,
      rerenderCount: Math.floor(Math.random() * 50),
      fps: Math.floor(Math.random() * 20) + 40,
      componentCount: Math.floor(Math.random() * 20) + 10,
    }));

    // 模拟 Web Vitals 数据
    setWebVitals({
      fcp: Math.random() * 1000 + 800,
      lcp: Math.random() * 1500 + 1200,
      fid: Math.random() * 50 + 10,
      cls: Math.random() * 0.2,
      ttfb: Math.random() * 200 + 100,
    });
  }, [memoryUsage?.used]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    updateMetrics();
    intervalRef.current = setInterval(updateMetrics, 1000);
  }, [updateMetrics]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({});
    setMemoryUsage(null);
    setWebVitals(null);
  }, []);

  const getPerformanceScore = useCallback(() => {
    if (!metrics.renderTime || !webVitals) return 0;

    let score = 100;

    // 渲染时间评分 (目标 < 16ms)
    if (metrics.renderTime > 16) {
      score -= Math.min(30, (metrics.renderTime - 16) * 2);
    }

    // Web Vitals 评分
    if (webVitals.fcp > 1800) score -= 15;
    if (webVitals.lcp > 2500) score -= 20;
    if (webVitals.fid > 100) score -= 15;
    if (webVitals.cls > 0.1) score -= 20;

    return Math.max(0, Math.round(score));
  }, [metrics, webVitals]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    metrics,
    memoryUsage,
    webVitals,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    getPerformanceScore,
  };
}

// 渲染时间追踪 Hook
export function useRenderTimeTracker(_componentName: string) {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const startTime = useRef(performance.now());

  renderCount.current += 1;

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    renderTimes.current.push(renderTime);

    // 只保留最近10次渲染时间
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }

    startTime.current = performance.now();
  });

  const getAverageRenderTime = useCallback(() => {
    if (renderTimes.current.length === 0) return 0;
    const total = renderTimes.current.reduce((sum, time) => sum + time, 0);
    return total / renderTimes.current.length;
  }, []);

  return {
    renderCount: renderCount.current,
    getAverageRenderTime,
  };
}

// 虚拟化 Hook
export function useVirtualization(
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    itemCount - 1,
    visibleStart + Math.ceil(containerHeight / itemHeight)
  );

  const visibleItems = [];
  for (let i = visibleStart; i <= visibleEnd; i++) {
    visibleItems.push(i);
  }

  const totalHeight = itemCount * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleStart,
    visibleEnd,
  };
}
