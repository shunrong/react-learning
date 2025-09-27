# Hooks库开发指南

> 🎣 打造高质量、可复用的React Hooks库实践指南

## 🔍 问题背景：为什么需要Hooks库？

### 💔 重复逻辑的噩梦

作为一个曾经维护过15个React项目的架构师，我见过太多重复的Hook逻辑。让我分享一个真实的场景：

#### 📊 项目中的Hook重复统计

让我用一个真实的企业级项目为例，展示Hook重复带来的痛苦。这家公司有15个React项目，当我加入团队时，发现了大量重复的Hook逻辑。

**项目背景：企业级应用集群**
- 项目数量：15个React应用
- 团队规模：25名前端开发者
- 技术栈：React 18 + TypeScript
- 开发模式：各项目独立开发，缺乏共享机制

**Hook重复的惊人数据统计**

| Hook类型 | 重复实现数量 | 总代码行数 | 主要问题 | 质量差异 |
|---------|-------------|-----------|----------|----------|
| **数据获取Hook** | 12种不同实现 | 3600行重复代码 | 18个分散的Bug | 行为严重不一致 |
| **本地存储Hook** | 8种不同实现 | 800行重复代码 | SSR兼容性、类型安全 | 维护成本极高 |
| **表单处理Hook** | 15种不同实现 | 4500行重复代码 | 验证逻辑不统一 | 用户体验差异大 |
| **窗口尺寸Hook** | 6种不同实现 | 480行重复代码 | 性能问题、内存泄漏 | 浏览器兼容性不一致 |
| **防抖节流Hook** | 10种不同实现 | 600行重复代码 | 实现质量参差不齐 | 性能影响各异 |

**问题的深层影响**

这种重复不仅仅是代码冗余的问题，它带来了更深层的影响：

**学习成本呈指数级增长：** 每个开发者加入新项目时，都需要重新学习该项目特有的Hook实现。一个有经验的React开发者，在我们公司切换项目时需要花费2-3天时间熟悉各种自定义Hook的用法。

**质量控制完全失控：** 由于每个项目都有自己的Hook实现，相同功能的质量差异巨大。有些项目的`useLocalStorage`考虑了SSR兼容性和错误处理，有些项目的实现在生产环境会直接崩溃。

**维护成本成倍增加：** 当我们发现某个Hook存在安全漏洞或性能问题时，需要在所有项目中分别修复。这不仅耗时，而且容易遗漏，导致一些项目长期存在已知问题。

**技术债务快速积累：** 由于缺乏统一的Hook标准，每个开发者都在按照自己的理解实现功能，导致技术债务快速积累，项目代码质量参差不齐。

#### 🤯 开发者的痛苦体验

#### 2. **质量保证的集中化**

#### 3. **开发效率的指数级提升**

## 🧠 Hooks库架构设计思考

### 🎯 核心设计挑战

设计Hooks库时，我遇到了几个关键的架构决策问题：

#### 挑战1：通用性 vs 特定性
**问题**：如何平衡Hook的通用性和特定业务场景的需求？

**思考过程**：
- **完全通用**：API复杂，学习成本高，但适用面广
- **完全特定**：API简单，但复用性差，维护成本高
- **分层设计**：基础Hook通用，组合Hook特定

**我的选择**：**分层Hook架构**

#### 挑战2：API设计的一致性
**问题**：如何设计直观且一致的Hook API？

**我的解决方案**：**Hook API设计系统**

#### 挑战3：性能优化与内存管理
**问题**：如何确保Hook库的性能和内存安全？

**我的解决方案**：**性能优化策略**

## 💡 核心Hook实现方案

### 🎯 1. 基础工具Hook

#### 🔄 状态管理Hook

状态管理是React Hook库中最常见的需求，我们需要提供比原生`useState`更强大的状态管理能力：

**基础计数器Hook：**
```typescript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}
```

**对象状态管理Hook：**
```typescript
function useObjectState<T extends Record<string, any>>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  
  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const resetField = useCallback(<K extends keyof T>(field: K) => {
    setState(prev => ({ ...prev, [field]: initialState[field] }));
  }, [initialState]);
  
  const reset = useCallback(() => setState(initialState), [initialState]);
  
  return { state, setField, resetField, reset };
}
```

#### ⏱️ 时间相关Hook

时间处理是前端开发中的常见需求，提供标准化的时间Hook能显著提升开发效率：

**防抖Hook：**
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

**节流Hook：**
```typescript
function useThrottle<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const lastExecutedRef = useRef<number>(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastExecutedRef.current >= delay) {
      lastExecutedRef.current = now;
      return fn(...args);
    }
  }, [fn, delay]) as T;
}
```

#### 💾 存储相关Hook

提供统一的存储接口，支持localStorage、sessionStorage以及内存存储：

**本地存储Hook：**
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue] as const;
}
```

### 🎯 2. 表单处理Hook

表单处理是React应用中最复杂的部分之一，需要处理状态管理、验证、错误处理等多个方面：

```typescript
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);
  
  const setTouched = useCallback(<K extends keyof T>(field: K) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);
  
  const handleChange = useCallback(<K extends keyof T>(field: K) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, e.target.value as T[K]);
    }, [setValue]);
  
  const handleBlur = useCallback(<K extends keyof T>(field: K) => 
    () => {
      setTouched(field);
    }, [setTouched]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    handleChange,
    handleBlur,
    reset,
  };
}
```

## 🧪 Hook测试策略

### 🎯 测试框架搭建

Hook的测试需要特殊的工具和方法，我推荐使用`@testing-library/react-hooks`进行Hook的单元测试：

**基础Hook测试：**
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

**异步Hook测试：**
```typescript
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { useFetch } from '../useFetch';

describe('useFetch', () => {
  it('should handle successful fetch', async () => {
    const mockData = { message: 'success' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });
    
    const { result } = renderHook(() => useFetch('/api/test'));
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });
});
```

## 🚀 发布与维护

### 📦 包发布策略

Hook库的发布需要考虑版本兼容性、依赖管理、以及用户升级体验：

**版本管理策略：**
- **主版本(major)**：破坏性API变更
- **次版本(minor)**：新增Hook或增强功能
- **补丁版本(patch)**：bug修复和性能优化

**发布流程：**
1. **代码检查**：ESLint + TypeScript检查
2. **单元测试**：确保所有Hook测试通过
3. **构建打包**：生成多种格式(ESM、CommonJS、UMD)
4. **文档更新**：自动生成API文档和变更日志
5. **发布部署**：发布到npm，更新文档站点

**依赖管理原则：**
- **零依赖**：核心Hook库应该没有外部依赖
- **Peer Dependencies**：将React作为peerDependency
- **可选依赖**：特殊Hook可以有optionalDependencies

### 📊 使用监控与分析

建立Hook使用监控系统能够帮助我们了解Hook库的使用情况，发现潜在问题，并持续优化Hook的设计。

**Hook使用统计的重要性**

通过监控Hook的使用情况，我们可以了解：
  private events: HookUsageEvent[] = [];
  
  // 记录Hook使用
  trackHookUsage(hookName: string, props: any, performance: PerformanceMetrics) {
    this.events.push({
      hookName,
      props: this.sanitizeProps(props),
      performance,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    });
  }
  
  // 分析流行度
  getPopularHooks(): HookPopularity[] {
    const usage = new Map<string, number>();
    
    this.events.forEach(event => {
      const count = usage.get(event.hookName) || 0;
      usage.set(event.hookName, count + 1);
    });
    
    return Array.from(usage.entries())
      .map(([hook, count]) => ({ hook, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  // 性能分析
  getPerformanceInsights(): PerformanceInsight[] {
    return this.groupBy(this.events, 'hookName')
      .map(([hookName, events]) => ({
        hookName,
        averageRenderTime: this.average(events.map(e => e.performance.renderTime)),
        memoryUsage: this.average(events.map(e => e.performance.memoryUsage)),
        errorRate: events.filter(e => e.performance.hasError).length / events.length
      }));
  }
  
  // 生成改进建议
  generateOptimizationSuggestions(): OptimizationSuggestion[] {
    const insights = this.getPerformanceInsights();
    const suggestions: OptimizationSuggestion[] = [];
    
    insights.forEach(insight => {
      if (insight.averageRenderTime > 16) {
        suggestions.push({
          hookName: insight.hookName,
          type: 'performance',
          message: `${insight.hookName} 渲染时间过长，建议优化`,
          priority: 'high'
        });
      }
      
      if (insight.errorRate > 0.05) {
        suggestions.push({
          hookName: insight.hookName,
          type: 'reliability',
          message: `${insight.hookName} 错误率较高，需要改进错误处理`,
          priority: 'high'
        });
      }
    });
    
    return suggestions;
  }
}
```

## 🎯 总结与最佳实践

### 💡 Hook设计原则

基于我的实践经验，总结出Hook设计的核心原则：

1. **单一职责**：每个Hook只做一件事，做好一件事
2. **可组合性**：Hook可以相互组合，构建更复杂的功能
3. **API一致性**：相似功能的Hook应该有相似的API设计
4. **性能优先**：始终考虑性能影响，避免不必要的重渲染
5. **错误友好**：提供清晰的错误信息和优雅的错误处理

### 🚀 开发建议

#### 📋 开发流程
1. **需求分析**：明确Hook的使用场景和API需求
2. **设计API**：设计简洁、一致的API接口
3. **实现逻辑**：编写核心逻辑，注意性能和内存安全
4. **编写测试**：全面的单元测试和集成测试
5. **文档编写**：详细的API文档和使用示例
6. **性能测试**：确保Hook的性能表现
7. **发布部署**：版本管理和发布流程

#### ⚠️ 常见陷阱
- **过度抽象**：不要为了复用而过度抽象
- **API不稳定**：频繁变更API会影响用户体验
- **内存泄漏**：注意清理事件监听器和定时器
- **性能问题**：避免在Hook中进行昂贵的计算
- **缺乏文档**：良好的文档是Hook库成功的关键

### 📈 成功指标

- **采用率**：团队中Hook的使用覆盖率
- **开发效率**：相关功能的开发时间减少比例
- **代码质量**：Bug减少率和代码重复率降低
- **开发者满意度**：团队对Hook库的满意度评分
- **维护成本**：Hook相关问题的处理时间

记住：**优秀的Hook库不是一次性设计出来的，而是在实际使用中不断演进和完善的**。从团队的实际需求出发，逐步构建和完善Hook库，才能真正发挥其价值。

## 🔧 Hook开发核心技术

### 🎯 自定义Hook设计模式

```typescript
// 1. 状态管理Hook模式
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}

// 2. 副作用管理Hook模式
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}

// 3. 数据获取Hook模式
function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => abortController.abort();
  }, [url, JSON.stringify(options)]);
  
  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    // 触发useEffect重新执行
  }, []);
  
  return { data, loading, error, refetch };
}

// 4. 表单管理Hook模式
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);
  
  const setTouched = useCallback(<K extends keyof T>(field: K) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, [setTouched]);
  
  const handleChange = useCallback(<K extends keyof T>(field: K) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, e.target.value as T[K]);
    }, [setValue]);
  
  const handleBlur = useCallback(<K extends keyof T>(field: K) => 
    () => {
      setTouched(field);
    }, [setTouched]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    handleChange,
    handleBlur,
    reset,
  };
}
```

### 🧪 Hook测试策略

```typescript
// Hook测试工具
import { renderHook, act } from '@testing-library/react-hooks';

describe('useCounter Hook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
  
  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
  
  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(12);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });
});

// 异步Hook测试
describe('useFetch Hook', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('should handle successful fetch', async () => {
    const mockData = { id: 1, name: 'Test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useFetch<typeof mockData>('/api/test')
    );
    
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });
  
  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useFetch('/api/test')
    );
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error?.message).toBe('Network error');
  });
});
```

### 📚 API文档生成

```typescript
// JSDoc注释示例
/**
 * 计数器Hook，提供计数状态和操作方法
 * 
 * @param initialValue - 初始值，默认为0
 * @returns 包含count状态和操作方法的对象
 * 
 * @example
 * ```tsx
 * function Counter() {
 *   const { count, increment, decrement, reset } = useCounter(0);
 *   
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={increment}>+</button>
 *       <button onClick={decrement}>-</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @since 1.0.0
 */
function useCounter(initialValue: number = 0): UseCounterReturn {
  // Hook实现...
}

// API文档生成工具配置
const apiDocConfig = {
  input: 'src/**/*.ts',
  output: 'docs/api',
  format: 'markdown',
  includePrivate: false,
  theme: 'minimal',
  plugins: [
    'typedoc-plugin-markdown',
    'typedoc-plugin-example-tag'
  ]
};

// TypeScript声明文件
declare module '@your-org/hooks' {
  export interface UseCounterOptions {
    min?: number;
    max?: number;
    step?: number;
  }
  
  export interface UseCounterReturn {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    canIncrement: boolean;
    canDecrement: boolean;
  }
  
  export function useCounter(
    initialValue?: number, 
    options?: UseCounterOptions
  ): UseCounterReturn;
  
  export function useFetch<T = any>(
    url: string,
    options?: RequestInit
  ): {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  };
}
```

### 🔄 版本升级和迁移

```typescript
// 版本兼容性管理
class HookVersionManager {
  // 废弃警告
  static deprecationWarning(hookName: string, version: string, alternative?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[DEPRECATED] ${hookName} is deprecated since v${version}.` +
        (alternative ? ` Use ${alternative} instead.` : '') +
        ' It will be removed in the next major version.'
      );
    }
  }
  
  // 自动迁移工具
  static createMigrationGuide(fromVersion: string, toVersion: string) {
    return {
      breaking_changes: [
        {
          hook: 'useOldHook',
          change: 'Renamed to useNewHook',
          migration: 'Replace useOldHook with useNewHook',
          codemod: 'npx @your-org/hooks-codemod v1-to-v2'
        }
      ],
      new_features: [
        {
          hook: 'useNewFeature',
          description: 'New hook for advanced state management'
        }
      ],
      improvements: [
        {
          hook: 'useExisting',
          description: 'Performance improvements and bug fixes'
        }
      ]
    };
  }
}

// 向后兼容的Hook包装器
function createCompatWrapper<T extends (...args: any[]) => any>(
  newHook: T,
  oldHookName: string,
  version: string
): T {
  return ((...args: Parameters<T>) => {
    HookVersionManager.deprecationWarning(
      oldHookName, 
      version, 
      newHook.name
    );
    return newHook(...args);
  }) as T;
}

// 使用示例
export const useOldCounter = createCompatWrapper(
  useCounter,
  'useOldCounter',
  '2.0.0'
);
```

## 📈 性能优化与最佳实践

### ⚡ Hook性能优化

```typescript
// 1. 避免不必要的重渲染
function useOptimizedState<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  
  // 使用useCallback避免每次渲染创建新函数
  const setValueOptimized = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      
      // 浅比较，避免不必要的更新
      return Object.is(prev, next) ? prev : next;
    });
  }, []);
  
  return [value, setValueOptimized] as const;
}

// 2. 内存泄漏防护
function useAsyncOperation<T>() {
  const mountedRef = useRef(true);
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    if (!mountedRef.current) return;
    
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await asyncFn();
      
      if (mountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (error) {
      if (mountedRef.current) {
        setState({ 
          data: null, 
          loading: false, 
          error: error instanceof Error ? error : new Error('Unknown error')
        });
      }
    }
  }, []);
  
  return { ...state, execute };
}

// 3. 智能缓存Hook
function useSmartMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options: {
    maxAge?: number;
    maxSize?: number;
  } = {}
) {
  const cache = useRef(new Map<string, { value: T; timestamp: number }>());
  
  return useMemo(() => {
    const key = JSON.stringify(deps);
    const cached = cache.current.get(key);
    const now = Date.now();
    
    // 检查缓存是否有效
    if (cached && (!options.maxAge || now - cached.timestamp < options.maxAge)) {
      return cached.value;
    }
    
    // 清理过期缓存
    if (options.maxAge) {
      for (const [k, v] of cache.current.entries()) {
        if (now - v.timestamp > options.maxAge) {
          cache.current.delete(k);
        }
      }
    }
    
    // 限制缓存大小
    if (options.maxSize && cache.current.size >= options.maxSize) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }
    
    const value = factory();
    cache.current.set(key, { value, timestamp: now });
    
    return value;
  }, deps);
}
```

---

*Hook库的成功在于解决实际问题，提升开发效率，统一团队标准。希望这些实践经验能够帮助你构建出色的Hook库，让团队的React开发更加高效和愉悦。*
