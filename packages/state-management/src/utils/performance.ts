import type {
  PerformanceMetrics,
  BenchmarkResult,
  StateManagementType,
} from '@/types/todo';

// 性能监控工具
export class PerformanceMonitor {
  private metrics: Map<StateManagementType, PerformanceMetrics> = new Map();
  private renderStartTime: number = 0;

  // 开始渲染计时
  startRender(_type: StateManagementType) {
    this.renderStartTime = performance.now();
  }

  // 结束渲染计时
  endRender(type: StateManagementType) {
    const renderTime = performance.now() - this.renderStartTime;

    const current = this.metrics.get(type) || {
      stateManagement: type,
      renderCount: 0,
      averageRenderTime: 0,
      totalRenderTime: 0,
    };

    const newMetrics: PerformanceMetrics = {
      ...current,
      renderCount: current.renderCount + 1,
      totalRenderTime: current.totalRenderTime + renderTime,
      averageRenderTime:
        (current.totalRenderTime + renderTime) / (current.renderCount + 1),
    };

    this.metrics.set(type, newMetrics);
    return newMetrics;
  }

  // 获取性能指标
  getMetrics(type: StateManagementType): PerformanceMetrics | undefined {
    return this.metrics.get(type);
  }

  // 获取所有指标
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  // 重置指标
  reset(type?: StateManagementType) {
    if (type) {
      this.metrics.delete(type);
    } else {
      this.metrics.clear();
    }
  }

  // 比较性能
  compare(): {
    fastest: StateManagementType | null;
    comparison: Array<{ type: StateManagementType; score: number }>;
  } {
    const metrics = this.getAllMetrics();
    if (metrics.length === 0) {
      return { fastest: null, comparison: [] };
    }

    const comparison = metrics
      .map(metric => ({
        type: metric.stateManagement,
        score: this.calculateScore(metric),
      }))
      .sort((a, b) => b.score - a.score);

    return {
      fastest: comparison[0]?.type || null,
      comparison,
    };
  }

  private calculateScore(metric: PerformanceMetrics): number {
    // 综合评分：渲染时间越短越好，权重较高
    const timeScore = Math.max(0, 100 - metric.averageRenderTime);

    // 可以根据需要添加其他指标
    return timeScore;
  }
}

// 基准测试工具
export class BenchmarkRunner {
  private results: BenchmarkResult[] = [];

  // 运行基准测试
  async runBenchmark(
    method: StateManagementType,
    operation: string,
    testFunction: () => void | Promise<void>,
    iterations: number = 1000
  ): Promise<BenchmarkResult> {
    const durations: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await testFunction();
      const end = performance.now();
      durations.push(end - start);
    }

    const totalDuration = durations.reduce(
      (sum, duration) => sum + duration,
      0
    );
    const averageTime = totalDuration / iterations;

    const result: BenchmarkResult = {
      method,
      operation,
      duration: totalDuration,
      iterations,
      averageTime,
    };

    this.results.push(result);
    return result;
  }

  // 获取基准测试结果
  getResults(): BenchmarkResult[] {
    return [...this.results];
  }

  // 清除结果
  clearResults() {
    this.results = [];
  }

  // 比较不同方案的性能
  compareOperations(operation: string): BenchmarkResult[] {
    return this.results
      .filter(result => result.operation === operation)
      .sort((a, b) => a.averageTime - b.averageTime);
  }

  // 生成性能报告
  generateReport(): string {
    const operations = [...new Set(this.results.map(r => r.operation))];

    let report = '# 状态管理性能基准测试报告\n\n';

    operations.forEach(operation => {
      const operationResults = this.compareOperations(operation);
      report += `## ${operation}\n\n`;
      report += '| 方案 | 平均时间 (ms) | 总时间 (ms) | 迭代次数 |\n';
      report += '|------|---------------|-------------|----------|\n';

      operationResults.forEach(result => {
        report += `| ${result.method} | ${result.averageTime.toFixed(4)} | ${result.duration.toFixed(2)} | ${result.iterations} |\n`;
      });

      report += '\n';
    });

    return report;
  }
}

// 内存使用监控
export const measureMemoryUsage = (): number => {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
  }
  return 0;
};

// React 渲染性能 Hook
export const useRenderPerformance = (type: StateManagementType) => {
  const monitor = new PerformanceMonitor();

  const startMeasure = () => monitor.startRender(type);
  const endMeasure = () => monitor.endRender(type);
  const getMetrics = () => monitor.getMetrics(type);

  return { startMeasure, endMeasure, getMetrics };
};
