import { PerformanceMetrics, WebVitalsData, MemoryUsage } from '@/types';

// 性能监控类
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private startTime: number = 0;

  constructor() {
    this.initializeObservers();
  }

  // 初始化性能观察器
  private initializeObservers() {
    // 观察渲染性能
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'measure') {
            this.recordMetric({
              renderTime: entry.duration,
              componentCount: 0,
              memoryUsage: this.getMemoryUsage().used,
              rerenderCount: 0,
            });
          }
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
      this.observers.push(observer);
    }
  }

  // 开始性能测量
  startMeasure(name: string = 'component-render') {
    this.startTime = performance.now();
    performance.mark(`${name}-start`);
  }

  // 结束性能测量
  endMeasure(name: string = 'component-render'): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const endTime = performance.now();
    const duration = endTime - this.startTime;

    return duration;
  }

  // 获取内存使用情况
  getMemoryUsage(): MemoryUsage {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
        total: Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
        percentage: Math.round(
          (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
        ),
        trend: 'stable', // 这里可以通过历史数据计算趋势
      };
    }

    return {
      used: 0,
      total: 0,
      percentage: 0,
      trend: 'stable',
    };
  }

  // 获取 Web Vitals 数据
  async getWebVitals(): Promise<WebVitalsData> {
    return new Promise(resolve => {
      // 模拟 Web Vitals 数据获取
      setTimeout(() => {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;

        resolve({
          cls: Math.random() * 0.1, // Cumulative Layout Shift
          fid: Math.random() * 100, // First Input Delay
          fcp: navigation?.loadEventEnd - navigation?.fetchStart || 1000, // First Contentful Paint
          lcp: navigation?.loadEventEnd - navigation?.fetchStart || 1500, // Largest Contentful Paint
          ttfb: navigation?.responseStart - navigation?.requestStart || 200, // Time to First Byte
        });
      }, 100);
    });
  }

  // 记录性能指标
  recordMetric(metric: PerformanceMetrics) {
    this.metrics.push({
      ...metric,
      componentCount: metric.componentCount || 0,
      memoryUsage: metric.memoryUsage || this.getMemoryUsage().used,
    });

    // 保持最近 100 条记录
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  // 获取平均性能指标
  getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        renderTime: 0,
        componentCount: 0,
        memoryUsage: 0,
        rerenderCount: 0,
      };
    }

    const sum = this.metrics.reduce(
      (acc, metric) => ({
        renderTime: acc.renderTime + metric.renderTime,
        componentCount: acc.componentCount + metric.componentCount,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        rerenderCount: acc.rerenderCount + metric.rerenderCount,
      }),
      { renderTime: 0, componentCount: 0, memoryUsage: 0, rerenderCount: 0 }
    );

    const count = this.metrics.length;

    return {
      renderTime: Math.round((sum.renderTime / count) * 100) / 100,
      componentCount: Math.round(sum.componentCount / count),
      memoryUsage: Math.round((sum.memoryUsage / count) * 100) / 100,
      rerenderCount: Math.round(sum.rerenderCount / count),
    };
  }

  // 清理观察器
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }

  // 获取性能评分
  getPerformanceScore(): number {
    const avg = this.getAverageMetrics();

    // 简单的评分算法 (0-100)
    let score = 100;

    // 渲染时间影响 (超过 16ms 扣分)
    if (avg.renderTime > 16) {
      score -= Math.min(30, (avg.renderTime - 16) * 2);
    }

    // 内存使用影响 (超过 50MB 扣分)
    if (avg.memoryUsage > 50) {
      score -= Math.min(20, (avg.memoryUsage - 50) * 0.5);
    }

    // 重渲染次数影响
    if (avg.rerenderCount > 5) {
      score -= Math.min(25, (avg.rerenderCount - 5) * 3);
    }

    return Math.max(0, Math.round(score));
  }
}

// 单例实例
export const performanceMonitor = new PerformanceMonitor();

// 性能测试工具函数
export const measureRenderTime = async (
  renderFn: () => Promise<void> | void
): Promise<number> => {
  const start = performance.now();
  await renderFn();
  const end = performance.now();
  return end - start;
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// 生成测试数据
export const generateTestData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
    value: Math.random() * 1000,
    category: ['A', 'B', 'C'][i % 3],
    isActive: Math.random() > 0.5,
    timestamp: Date.now() + i * 1000,
  }));
};
