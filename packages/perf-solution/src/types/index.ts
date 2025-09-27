// 性能指标类型
export interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage: number;
  rerenderCount: number;
  bundleSize?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

// 性能测试结果
export interface PerformanceTestResult {
  id: string;
  name: string;
  description: string;
  metrics: PerformanceMetrics;
  timestamp: number;
  optimizationType: OptimizationType;
}

// 优化类型
export type OptimizationType =
  | 'memo'
  | 'useMemo'
  | 'useCallback'
  | 'lazy'
  | 'virtualization'
  | 'code-splitting'
  | 'preloading'
  | 'caching'
  | 'debouncing'
  | 'throttling';

// 测试数据项
export interface TestDataItem {
  id: number;
  name: string;
  description: string;
  value: number;
  category: string;
  isActive: boolean;
  timestamp: number;
}

// 组件性能配置
export interface ComponentPerfConfig {
  enableMemo: boolean;
  enableUseMemo: boolean;
  enableUseCallback: boolean;
  enableVirtualization: boolean;
  itemCount: number;
  updateFrequency: number;
}

// 路由懒加载配置
export interface LazyLoadConfig {
  enabled: boolean;
  preloadDelay: number;
  chunkSize: 'small' | 'medium' | 'large';
  cacheStrategy: 'memory' | 'disk' | 'hybrid';
}

// 内存使用情况
export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Web Vitals 指标
export interface WebVitalsData {
  cls: number;
  fid: number;
  fcp: number;
  lcp: number;
  ttfb: number;
}

// 性能监控配置
export interface PerformanceMonitorConfig {
  enableWebVitals: boolean;
  enableRenderTime: boolean;
  enableMemoryTracking: boolean;
  enableComponentTracking: boolean;
  sampleRate: number;
}

// 优化建议
export interface OptimizationSuggestion {
  id: string;
  type: OptimizationType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  implementation: string;
  codeExample?: string;
}

// 性能对比结果
export interface PerformanceComparison {
  before: PerformanceMetrics;
  after: PerformanceMetrics;
  improvement: {
    renderTime: number;
    memoryUsage: number;
    rerenderCount: number;
    overallScore: number;
  };
}
